import crypto from "node:crypto";

import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMocks = vi.hoisted(() => ({
  tenantFindUnique: vi.fn(),
  idempotencyFindUnique: vi.fn(),
  idempotencyCreate: vi.fn(),
  idempotencyUpdate: vi.fn(),
  orderFindFirst: vi.fn(),
  orderCreate: vi.fn(),
  paymentCreate: vi.fn(),
  paymentUpdate: vi.fn(),
  productFindMany: vi.fn(),
  prismaTransaction: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    tenant: {
      findUnique: prismaMocks.tenantFindUnique,
    },
    idempotencyKey: {
      findUnique: prismaMocks.idempotencyFindUnique,
      create: prismaMocks.idempotencyCreate,
      update: prismaMocks.idempotencyUpdate,
    },
    order: {
      findFirst: prismaMocks.orderFindFirst,
      create: prismaMocks.orderCreate,
    },
    payment: {
      create: prismaMocks.paymentCreate,
      update: prismaMocks.paymentUpdate,
    },
    product: {
      findMany: prismaMocks.productFindMany,
    },
    $transaction: prismaMocks.prismaTransaction,
  },
}));

vi.mock("@/src/server/payments/mercadopago", () => ({
  PAYMENT_PROVIDER: "mercadopago",
  createMercadoPagoPreference: vi.fn(),
}));

vi.mock("@/src/server/payments/reconciliation-jobs", () => ({
  computeNextRetryAt: vi.fn(() => new Date("2026-01-01T00:00:00.000Z")),
  enqueueReconciliationJob: vi.fn(),
}));

import { CheckoutServiceError, createCheckoutIntent } from "@/src/server/checkout/service";

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

function hashCheckoutPayload(payload: unknown) {
  return crypto.createHash("sha256").update(canonicalize(payload)).digest("hex");
}

describe("checkout idempotency", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    prismaMocks.tenantFindUnique.mockResolvedValue({
      id: "tenant-1",
      slug: "rafa-petshop",
      isActive: true,
      currencyCode: "ARS",
    });
  });

  it("returns same order for same idempotency key + same payload", async () => {
    const payload = {
      customer: {
        email: "test@example.com",
      },
      items: [
        {
          productId: "prod-1",
          variantId: "var-1",
          quantity: 1,
        },
      ],
    };

    const requestHash = hashCheckoutPayload({
      ...payload,
      tenantSlug: "rafa-petshop",
    });

    prismaMocks.idempotencyFindUnique.mockResolvedValue({
      id: "idem-1",
      tenantId: "tenant-1",
      key: "idem-key-1",
      requestHash,
      orderId: "order-1",
    });

    prismaMocks.orderFindFirst.mockResolvedValue({
      id: "order-1",
      tenantId: "tenant-1",
      status: "PENDING_PAYMENT",
      currencyCode: "ARS",
      subtotalInCents: 130000,
      totalInCents: 130000,
      createdAt: new Date(),
      updatedAt: new Date(),
      items: [
        {
          id: "item-1",
          quantity: 1,
          unitPriceInCents: 130000,
          lineTotalInCents: 130000,
          titleSnapshot: "Producto 1",
          variantLabelSnapshot: "10kg",
        },
      ],
      payments: [
        {
          id: "payment-1",
          provider: "mercadopago",
          status: "PENDING",
          providerPreferenceId: "pref-1",
          providerPaymentId: null,
          rawPayload: { checkoutUrl: "https://mp.test/checkout" },
        },
      ],
    });

    const result = await createCheckoutIntent({
      payload,
      idempotencyKey: "idem-key-1",
    });

    expect(result.idempotencyReused).toBe(true);
    expect(result.orderId).toBe("order-1");
    expect(result.payment.checkoutUrl).toBe("https://mp.test/checkout");
    expect(prismaMocks.orderCreate).not.toHaveBeenCalled();
    expect(prismaMocks.paymentCreate).not.toHaveBeenCalled();
  });

  it("returns 409 for same idempotency key with different payload", async () => {
    const payload = {
      customer: {
        email: "test@example.com",
      },
      items: [
        {
          productId: "prod-1",
          variantId: "var-1",
          quantity: 2,
        },
      ],
    };

    prismaMocks.idempotencyFindUnique.mockResolvedValue({
      id: "idem-1",
      tenantId: "tenant-1",
      key: "idem-key-1",
      requestHash: "different-hash",
      orderId: "order-1",
    });

    await expect(
      createCheckoutIntent({
        payload,
        idempotencyKey: "idem-key-1",
      })
    ).rejects.toMatchObject<Partial<CheckoutServiceError>>({
      status: 409,
      code: "IDEMPOTENCY_CONFLICT",
    });
  });
});
