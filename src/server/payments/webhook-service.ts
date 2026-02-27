import crypto from "node:crypto";

import { Prisma, type PaymentEvent } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { DEFAULT_TENANT_SLUG } from "@/src/server/catalog";
import {
  PAYMENT_PROVIDER,
  fetchMercadoPagoPayment,
  searchMercadoPagoPaymentByExternalReference,
} from "@/src/server/payments/mercadopago";
import { syncMercadoPagoPaymentState } from "@/src/server/payments/sync-service";

export type WebhookProcessResult = {
  ok: true;
  duplicate: boolean;
  ignored: boolean;
  orderId: string | null;
  paymentId: string | null;
  rawEventId: string;
};

function toStringOrNull(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  return null;
}

function getObject(input: unknown): Record<string, unknown> {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return {};
  }

  return input as Record<string, unknown>;
}

function extractWebhookMetadata(payload: Record<string, unknown>, rawBody: string) {
  const bodyData = getObject(payload.data);

  const paymentReference =
    toStringOrNull(bodyData.id) ||
    toStringOrNull(payload["data.id"]) ||
    toStringOrNull(payload.id);

  const externalReference =
    toStringOrNull(payload.external_reference) ||
    toStringOrNull((bodyData.metadata as Record<string, unknown> | undefined)?.orderId);

  const eventType =
    toStringOrNull(payload.action) ||
    toStringOrNull(payload.type) ||
    toStringOrNull(payload.topic) ||
    "unknown";

  const rawEventId =
    toStringOrNull(payload.id) ||
    crypto.createHash("sha256").update(rawBody).digest("hex");

  return {
    eventType,
    rawEventId,
    paymentReference,
    externalReference,
  };
}

function isUniqueConstraintError(error: unknown) {
  const maybePrismaError = error as { code?: unknown } | null;
  return maybePrismaError?.code === "P2002";
}

async function markEventProcessedOnly(eventId: string, paymentReference: string | null) {
  await prisma.paymentEvent.update({
    where: {
      id: eventId,
    },
    data: {
      paymentReference,
      processedAt: new Date(),
    },
  });
}

export async function processPaymentWebhook(input: {
  payload: Record<string, unknown>;
  rawBody: string;
  tenantSlug?: string;
  signatureValid: boolean;
}) {
  const tenantSlug = input.tenantSlug?.trim() || DEFAULT_TENANT_SLUG;
  const tenant = await prisma.tenant.findUnique({ where: { slug: tenantSlug } });

  if (!tenant) {
    return {
      ok: true,
      duplicate: false,
      ignored: true,
      orderId: null,
      paymentId: null,
      rawEventId: "tenant-not-found",
    } satisfies WebhookProcessResult;
  }

  const { eventType, paymentReference, rawEventId, externalReference } =
    extractWebhookMetadata(input.payload, input.rawBody);

  let paymentEvent: PaymentEvent;

  try {
    paymentEvent = await prisma.paymentEvent.create({
      data: {
        tenantId: tenant.id,
        provider: PAYMENT_PROVIDER,
        rawEventId,
        eventType,
        paymentReference,
        signatureValid: input.signatureValid,
        payload: input.payload as Prisma.InputJsonValue,
      },
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        ok: true,
        duplicate: true,
        ignored: false,
        orderId: null,
        paymentId: null,
        rawEventId,
      } satisfies WebhookProcessResult;
    }

    throw error;
  }

  let providerPayment: Record<string, unknown> | null = null;

  if (paymentReference) {
    providerPayment = (await fetchMercadoPagoPayment(
      paymentReference
    )) as unknown as Record<string, unknown>;
  } else if (externalReference) {
    providerPayment = await searchMercadoPagoPaymentByExternalReference(externalReference);
  }

  if (!providerPayment) {
    await markEventProcessedOnly(paymentEvent.id, paymentReference);

    return {
      ok: true,
      duplicate: false,
      ignored: true,
      orderId: null,
      paymentId: null,
      rawEventId,
    } satisfies WebhookProcessResult;
  }

  const syncResult = await syncMercadoPagoPaymentState({
    tenantId: tenant.id,
    providerPayment,
    source: "webhook",
    paymentEventId: paymentEvent.id,
  });

  if (syncResult.paymentTransition?.kind === "invalid") {
    console.warn("[payments:webhook:payment-transition-invalid]", {
      rawEventId,
      paymentId: syncResult.paymentId,
      reason: syncResult.paymentTransition.reason,
      providerStatus: syncResult.resolution.normalizedStatus,
    });
  }

  if (syncResult.orderTransition?.kind === "invalid") {
    console.warn("[payments:webhook:order-transition-invalid]", {
      rawEventId,
      orderId: syncResult.orderId,
      reason: syncResult.orderTransition.reason,
      providerStatus: syncResult.resolution.normalizedStatus,
    });
  }

  return {
    ok: true,
    duplicate: false,
    ignored: syncResult.ignored,
    orderId: syncResult.orderId,
    paymentId: syncResult.paymentId,
    rawEventId,
  } satisfies WebhookProcessResult;
}
