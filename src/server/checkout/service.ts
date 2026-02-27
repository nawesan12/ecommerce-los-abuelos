import crypto from "node:crypto";

import { Prisma, type Order, type Payment, type Product, type ProductVariant, type Tenant } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { DEFAULT_TENANT_SLUG } from "@/src/server/catalog";
import { PAYMENT_PROVIDER, createMercadoPagoPreference } from "@/src/server/payments/mercadopago";
import {
  computeNextRetryAt,
  enqueueReconciliationJob,
} from "@/src/server/payments/reconciliation-jobs";
import type { CheckoutRequest } from "@/src/server/checkout/schema";
import {
  toPublicOrderStatus,
  toPublicPaymentStatus,
  type PublicCheckoutStatus,
} from "@/src/server/checkout/status";

export class CheckoutServiceError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

type CheckoutResponse = {
  orderId: string;
  status: PublicCheckoutStatus;
  totals: {
    subtotal: number;
    total: number;
    currencyCode: string;
  };
  payment: {
    provider: string;
    status: PublicCheckoutStatus;
    preferenceId: string | null;
    paymentReference: string | null;
    checkoutUrl: string | null;
  };
  idempotencyReused: boolean;
};

type PreparedCheckoutItem = {
  productId: string;
  variantId: string;
  quantity: number;
  unitPriceInCents: number;
  lineTotalInCents: number;
  titleSnapshot: string;
  variantLabelSnapshot: string;
};

type ProductWithVariants = Pick<Product, "id" | "externalRef" | "title" | "isActive"> & {
  variants: Array<Pick<ProductVariant, "id" | "externalRef" | "label" | "priceInCents" | "isActive">>;
};

type OrderWithRelations = Order & {
  items: Array<{
    id: string;
    quantity: number;
    unitPriceInCents: number;
    lineTotalInCents: number;
    titleSnapshot: string;
    variantLabelSnapshot: string;
  }>;
  payments: Payment[];
};

function normalizeTenantSlug(tenantSlug?: string) {
  return tenantSlug?.trim() || DEFAULT_TENANT_SLUG;
}

function isUniqueConstraintError(error: unknown) {
  const maybePrismaError = error as { code?: unknown } | null;
  return maybePrismaError?.code === "P2002";
}

function canonicalize(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map((item) => canonicalize(item)).join(",")}]`;
  }

  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const sorted = Object.keys(obj)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${canonicalize(obj[key])}`)
      .join(",");

    return `{${sorted}}`;
  }

  return JSON.stringify(value);
}

function hashCheckoutPayload(payload: CheckoutRequest) {
  return crypto.createHash("sha256").update(canonicalize(payload)).digest("hex");
}

function extractCheckoutUrl(rawPayload: Prisma.JsonValue | null): string | null {
  if (!rawPayload || typeof rawPayload !== "object" || Array.isArray(rawPayload)) {
    return null;
  }

  const payload = rawPayload as Record<string, unknown>;

  if (typeof payload.checkoutUrl === "string") {
    return payload.checkoutUrl;
  }

  if (typeof payload.init_point === "string") {
    return payload.init_point;
  }

  if (typeof payload.sandbox_init_point === "string") {
    return payload.sandbox_init_point;
  }

  return null;
}

function mapOrderToCheckoutResponse(
  order: OrderWithRelations,
  payment: Payment | null,
  idempotencyReused: boolean
): CheckoutResponse {
  return {
    orderId: order.id,
    status: toPublicOrderStatus(order.status),
    totals: {
      subtotal: order.subtotalInCents / 100,
      total: order.totalInCents / 100,
      currencyCode: order.currencyCode,
    },
    payment: {
      provider: payment?.provider || PAYMENT_PROVIDER,
      status: payment ? toPublicPaymentStatus(payment.status) : "pending",
      preferenceId: payment?.providerPreferenceId || null,
      paymentReference: payment?.providerPaymentId || null,
      checkoutUrl: payment ? extractCheckoutUrl(payment.rawPayload) : null,
    },
    idempotencyReused,
  };
}

async function getActiveTenantOrThrow(tenantSlug: string) {
  const tenant = await prisma.tenant.findUnique({
    where: { slug: tenantSlug },
  });

  if (!tenant || !tenant.isActive) {
    throw new CheckoutServiceError(404, "TENANT_NOT_FOUND", "Tenant no disponible");
  }

  return tenant;
}

async function getOrderWithRelations(tenantId: string, orderId: string) {
  return prisma.order.findFirst({
    where: {
      id: orderId,
      tenantId,
    },
    include: {
      items: {
        select: {
          id: true,
          quantity: true,
          unitPriceInCents: true,
          lineTotalInCents: true,
          titleSnapshot: true,
          variantLabelSnapshot: true,
        },
      },
      payments: {
        orderBy: { createdAt: "asc" },
      },
    },
  }) as Promise<OrderWithRelations | null>;
}

async function resolveCheckoutItems(
  tenantId: string,
  items: CheckoutRequest["items"]
): Promise<PreparedCheckoutItem[]> {
  const productIds = [...new Set(items.map((item) => item.productId))];

  const products = await prisma.product.findMany({
    where: {
      tenantId,
      isActive: true,
      OR: [{ id: { in: productIds } }, { externalRef: { in: productIds } }],
    },
    select: {
      id: true,
      externalRef: true,
      title: true,
      isActive: true,
      variants: {
        where: { isActive: true },
        select: {
          id: true,
          externalRef: true,
          label: true,
          priceInCents: true,
          isActive: true,
        },
        orderBy: { priceInCents: "asc" },
      },
    },
  }) as ProductWithVariants[];

  const productsByAnyId = new Map<string, ProductWithVariants>();

  for (const product of products) {
    productsByAnyId.set(product.id, product);
    productsByAnyId.set(product.externalRef, product);
  }

  const aggregated = new Map<string, PreparedCheckoutItem>();

  for (const item of items) {
    const product = productsByAnyId.get(item.productId);

    if (!product || !product.isActive) {
      throw new CheckoutServiceError(
        422,
        "PRODUCT_UNAVAILABLE",
        `Producto inválido o inactivo: ${item.productId}`
      );
    }

    const variant = item.variantId
      ? product.variants.find(
          (candidate) =>
            candidate.id === item.variantId || candidate.externalRef === item.variantId
        )
      : product.variants[0];

    if (!variant || !variant.isActive) {
      throw new CheckoutServiceError(
        422,
        "VARIANT_UNAVAILABLE",
        `Variante inválida para el producto ${item.productId}`
      );
    }

    const current = aggregated.get(variant.id);

    if (current) {
      current.quantity += item.quantity;
      current.lineTotalInCents = current.unitPriceInCents * current.quantity;
      aggregated.set(variant.id, current);
      continue;
    }

    const normalized: PreparedCheckoutItem = {
      productId: product.id,
      variantId: variant.id,
      quantity: item.quantity,
      unitPriceInCents: variant.priceInCents,
      lineTotalInCents: variant.priceInCents * item.quantity,
      titleSnapshot: product.title,
      variantLabelSnapshot: variant.label,
    };

    aggregated.set(variant.id, normalized);
  }

  const preparedItems = [...aggregated.values()];

  if (preparedItems.length === 0) {
    throw new CheckoutServiceError(422, "EMPTY_CART", "No hay items válidos para procesar");
  }

  return preparedItems;
}

async function ensureMercadoPagoPreference(input: {
  tenant: Tenant;
  tenantSlug: string;
  order: OrderWithRelations;
  payment: Payment;
  idempotencyKey?: string;
}) {
  const currentUrl = extractCheckoutUrl(input.payment.rawPayload);

  if (input.payment.providerPreferenceId && currentUrl) {
    return input.payment;
  }

  const customerEmail = input.order.customerEmail;

  if (!customerEmail) {
    throw new CheckoutServiceError(
      500,
      "MISSING_CUSTOMER_EMAIL",
      "No se encontró email de comprador para iniciar pago"
    );
  }

  let preference;

  try {
    preference = await createMercadoPagoPreference({
      orderId: input.order.id,
      tenantSlug: input.tenantSlug,
      currencyCode: input.order.currencyCode,
      customerEmail,
      items: input.order.items.map((item) => ({
        title: `${item.titleSnapshot} - ${item.variantLabelSnapshot}`,
        quantity: item.quantity,
        unitPriceInCents: item.unitPriceInCents,
      })),
    });
  } catch (error) {
    console.error("[checkout:payment-provider]", error);
    throw new CheckoutServiceError(
      502,
      "PAYMENT_PROVIDER_UNAVAILABLE",
      "No se pudo iniciar el pago con el proveedor"
    );
  }

  const updatedPayment = await prisma.payment.update({
    where: { id: input.payment.id },
    data: {
      providerPreferenceId: preference.preferenceId,
      rawPayload: {
        ...((preference.rawResponse as Record<string, unknown>) || {}),
        checkoutUrl: preference.checkoutUrl,
        sandboxCheckoutUrl: preference.sandboxCheckoutUrl,
      },
    },
  });

  if (input.idempotencyKey) {
    await prisma.idempotencyKey.update({
      where: {
        tenantId_key: {
          tenantId: input.tenant.id,
          key: input.idempotencyKey,
        },
      },
      data: {
        responseStatus: 201,
        responseBody: {
          orderId: input.order.id,
          checkoutUrl: preference.checkoutUrl,
          paymentPreferenceId: preference.preferenceId,
        },
      },
    });
  }

  return updatedPayment;
}

async function buildResponseFromExistingOrder(input: {
  tenant: Tenant;
  tenantSlug: string;
  orderId: string;
  idempotencyKey?: string;
}) {
  const existingOrder = await getOrderWithRelations(input.tenant.id, input.orderId);

  if (!existingOrder) {
    throw new CheckoutServiceError(404, "ORDER_NOT_FOUND", "Orden no encontrada");
  }

  let payment = existingOrder.payments[0] || null;

  if (payment) {
    payment = await ensureMercadoPagoPreference({
      tenant: input.tenant,
      tenantSlug: input.tenantSlug,
      order: existingOrder,
      payment,
      idempotencyKey: input.idempotencyKey,
    });

    if (payment.status === "PENDING") {
      await enqueueReconciliationJob({
        tenantId: input.tenant.id,
        paymentId: payment.id,
        orderId: existingOrder.id,
        externalReference: existingOrder.id,
        nextRetryAt: computeNextRetryAt(1),
      });
    }
  }

  return mapOrderToCheckoutResponse(existingOrder, payment, true);
}

export async function createCheckoutIntent(input: {
  payload: CheckoutRequest;
  idempotencyKey?: string;
}) {
  const tenantSlug = normalizeTenantSlug(input.payload.tenantSlug);
  const tenant = await getActiveTenantOrThrow(tenantSlug);
  const requestHash = hashCheckoutPayload({
    ...input.payload,
    tenantSlug,
  });

  if (input.idempotencyKey) {
    const existingKey = await prisma.idempotencyKey.findUnique({
      where: {
        tenantId_key: {
          tenantId: tenant.id,
          key: input.idempotencyKey,
        },
      },
    });

    if (existingKey) {
      if (existingKey.requestHash !== requestHash) {
        throw new CheckoutServiceError(
          409,
          "IDEMPOTENCY_CONFLICT",
          "La misma Idempotency-Key fue usada con otro payload"
        );
      }

      if (existingKey.orderId) {
        return buildResponseFromExistingOrder({
          tenant,
          tenantSlug,
          orderId: existingKey.orderId,
          idempotencyKey: input.idempotencyKey,
        });
      }

      throw new CheckoutServiceError(
        409,
        "IDEMPOTENCY_IN_PROGRESS",
        "Solicitud en procesamiento, reintentá en unos segundos"
      );
    }
  }

  const preparedItems = await resolveCheckoutItems(tenant.id, input.payload.items);
  const subtotalInCents = preparedItems.reduce((sum, item) => sum + item.lineTotalInCents, 0);

  let createdOrder: OrderWithRelations;
  let createdPayment: Payment;

  try {
    const created = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          tenantId: tenant.id,
          status: "PENDING_PAYMENT",
          customerEmail: input.payload.customer.email,
          customerName: input.payload.customer.name,
          customerPhone: input.payload.customer.phone,
          notes: input.payload.notes,
          currencyCode: tenant.currencyCode,
          subtotalInCents,
          totalInCents: subtotalInCents,
          shippingInCents: 0,
          items: {
            create: preparedItems.map((item) => ({
              productId: item.productId,
              variantId: item.variantId,
              quantity: item.quantity,
              unitPriceInCents: item.unitPriceInCents,
              lineTotalInCents: item.lineTotalInCents,
              titleSnapshot: item.titleSnapshot,
              variantLabelSnapshot: item.variantLabelSnapshot,
            })),
          },
        },
        include: {
          items: {
            select: {
              id: true,
              quantity: true,
              unitPriceInCents: true,
              lineTotalInCents: true,
              titleSnapshot: true,
              variantLabelSnapshot: true,
            },
          },
          payments: {
            orderBy: { createdAt: "asc" },
          },
        },
      });

      const payment = await tx.payment.create({
        data: {
          tenantId: tenant.id,
          orderId: order.id,
          provider: PAYMENT_PROVIDER,
          status: "PENDING",
          amountInCents: order.totalInCents,
          currencyCode: order.currencyCode,
          externalReference: order.id,
        },
      });

      await enqueueReconciliationJob(
        {
          tenantId: tenant.id,
          paymentId: payment.id,
          orderId: order.id,
          externalReference: order.id,
          nextRetryAt: computeNextRetryAt(1),
        },
        tx
      );

      if (input.idempotencyKey) {
        await tx.idempotencyKey.create({
          data: {
            tenantId: tenant.id,
            key: input.idempotencyKey,
            requestHash,
            orderId: order.id,
            responseStatus: 201,
          },
        });
      }

      return { order, payment };
    });

    createdOrder = created.order as OrderWithRelations;
    createdPayment = created.payment;
  } catch (error) {
    if (input.idempotencyKey && isUniqueConstraintError(error)) {
      const existingKey = await prisma.idempotencyKey.findUnique({
        where: {
          tenantId_key: {
            tenantId: tenant.id,
            key: input.idempotencyKey,
          },
        },
      });

      if (existingKey?.orderId && existingKey.requestHash === requestHash) {
        return buildResponseFromExistingOrder({
          tenant,
          tenantSlug,
          orderId: existingKey.orderId,
          idempotencyKey: input.idempotencyKey,
        });
      }

      if (existingKey && existingKey.requestHash !== requestHash) {
        throw new CheckoutServiceError(
          409,
          "IDEMPOTENCY_CONFLICT",
          "La misma Idempotency-Key fue usada con otro payload"
        );
      }

      throw new CheckoutServiceError(
        409,
        "IDEMPOTENCY_CONFLICT",
        "No se pudo resolver la solicitud idempotente"
      );
    }

    throw error;
  }

  const payment = await ensureMercadoPagoPreference({
    tenant,
    tenantSlug,
    order: createdOrder,
    payment: createdPayment,
    idempotencyKey: input.idempotencyKey,
  });

  return mapOrderToCheckoutResponse(createdOrder, payment, false);
}

export async function getCheckoutOrderStatus(input: {
  orderId: string;
  tenantSlug?: string;
}) {
  const tenantSlug = normalizeTenantSlug(input.tenantSlug);

  const order = await prisma.order.findFirst({
    where: {
      id: input.orderId,
      tenant: {
        slug: tenantSlug,
      },
    },
    include: {
      payments: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      items: {
        select: {
          id: true,
          quantity: true,
          unitPriceInCents: true,
          lineTotalInCents: true,
          titleSnapshot: true,
          variantLabelSnapshot: true,
        },
      },
    },
  }) as OrderWithRelations | null;

  if (!order) {
    return null;
  }

  const payment = order.payments[0] || null;

  return {
    orderId: order.id,
    status: toPublicOrderStatus(order.status),
    totals: {
      subtotal: order.subtotalInCents / 100,
      total: order.totalInCents / 100,
      currencyCode: order.currencyCode,
    },
    payment: {
      provider: payment?.provider || PAYMENT_PROVIDER,
      status: payment ? toPublicPaymentStatus(payment.status) : "pending",
      preferenceId: payment?.providerPreferenceId || null,
      paymentReference: payment?.providerPaymentId || null,
    },
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
}
