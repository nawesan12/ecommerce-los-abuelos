import type { Order, Payment, Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { buildPaymentLockKey, acquirePaymentStateLock } from "@/src/server/payments/locking";
import { PAYMENT_PROVIDER } from "@/src/server/payments/mercadopago";
import {
  enqueueReconciliationJob,
  markReconciliationCompleted,
} from "@/src/server/payments/reconciliation-jobs";
import {
  isRetryableResolution,
  isTerminalResolution,
  resolveMercadoPagoStatus,
  transitionOrderStatus,
  transitionPaymentStatus,
  type ProviderStatusResolution,
  type TransitionDecision,
} from "@/src/server/payments/state-machine";

export type PaymentSyncSource = "webhook" | "reconciliation";

export type PaymentSyncResult = {
  ignored: boolean;
  tenantId: string;
  orderId: string | null;
  paymentId: string | null;
  providerPaymentId: string | null;
  providerPreferenceId: string | null;
  externalReference: string | null;
  resolution: ProviderStatusResolution;
  paymentTransition: TransitionDecision<"PENDING" | "APPROVED" | "REJECTED" | "CANCELLED"> | null;
  orderTransition:
    | TransitionDecision<
        | "PENDING_PAYMENT"
        | "PAID"
        | "PREPARING"
        | "READY_FOR_DELIVERY"
        | "DELIVERED"
        | "FAILED"
        | "CANCELLED"
      >
    | null;
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

function toObject(input: unknown): Record<string, unknown> {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return {};
  }

  return input as Record<string, unknown>;
}

function readSnapshotFields(providerPayment: Record<string, unknown>) {
  const providerPaymentId = toStringOrNull(providerPayment.id);
  const providerPreferenceId = toStringOrNull(providerPayment.preference_id);
  const externalReference = toStringOrNull(providerPayment.external_reference);
  const providerStatus = toStringOrNull(providerPayment.status);
  const amountRaw = Number(providerPayment.transaction_amount || 0);
  const amountInCents = Number.isFinite(amountRaw) ? Math.round(amountRaw * 100) : 0;

  return {
    providerPaymentId,
    providerPreferenceId,
    externalReference,
    providerStatus,
    amountInCents,
  };
}

function selectOrderTimestampPatch(
  nextStatus: Order["status"],
  current: Pick<Order, "paidAt" | "failedAt" | "cancelledAt">
) {
  return {
    paidAt: nextStatus === "PAID" ? new Date() : current.paidAt,
    failedAt: nextStatus === "FAILED" ? new Date() : current.failedAt,
    cancelledAt: nextStatus === "CANCELLED" ? new Date() : current.cancelledAt,
  };
}

function shouldQueueRetryForPending(
  existingPaymentStatus: Payment["status"],
  paymentTransition: TransitionDecision<Payment["status"]>,
  resolution: ProviderStatusResolution
) {
  if (!isRetryableResolution(resolution)) {
    return false;
  }

  if (paymentTransition.kind === "apply") {
    return true;
  }

  return existingPaymentStatus === "PENDING";
}

function toJsonValue(payload: Record<string, unknown>): Prisma.InputJsonValue {
  return payload as unknown as Prisma.InputJsonValue;
}

export async function syncMercadoPagoPaymentState(input: {
  tenantId: string;
  providerPayment: Record<string, unknown>;
  source: PaymentSyncSource;
  paymentEventId?: string;
}) {
  const snapshot = toObject(input.providerPayment);
  const fields = readSnapshotFields(snapshot);
  const resolution = resolveMercadoPagoStatus(fields.providerStatus);

  const result = await prisma.$transaction(async (tx) => {
    const lockKey = buildPaymentLockKey({
      tenantId: input.tenantId,
      orderId: fields.externalReference,
      providerPaymentId: fields.providerPaymentId,
      providerPreferenceId: fields.providerPreferenceId,
    });

    await acquirePaymentStateLock(tx, lockKey);

    const order = fields.externalReference
      ? await tx.order.findFirst({
          where: {
            id: fields.externalReference,
            tenantId: input.tenantId,
          },
        })
      : null;

    const paymentLookup: Prisma.PaymentWhereInput[] = [];

    if (fields.providerPaymentId) {
      paymentLookup.push({ providerPaymentId: fields.providerPaymentId });
    }

    if (fields.providerPreferenceId) {
      paymentLookup.push({ providerPreferenceId: fields.providerPreferenceId });
    }

    if (order?.id) {
      paymentLookup.push({ orderId: order.id });
    }

    let payment = paymentLookup.length
      ? await tx.payment.findFirst({
          where: {
            tenantId: input.tenantId,
            provider: PAYMENT_PROVIDER,
            OR: paymentLookup,
          },
          orderBy: {
            createdAt: "asc",
          },
        })
      : null;

    if (!payment && order) {
      payment = await tx.payment.create({
        data: {
          tenantId: input.tenantId,
          orderId: order.id,
          provider: PAYMENT_PROVIDER,
          status: resolution.paymentTargetStatus,
          amountInCents: fields.amountInCents || order.totalInCents,
          currencyCode: order.currencyCode,
          providerPreferenceId: fields.providerPreferenceId,
          providerPaymentId: fields.providerPaymentId,
          externalReference: fields.externalReference || order.id,
          rawPayload: toJsonValue(snapshot),
          processedAt: new Date(),
        },
      });
    }

    if (!payment) {
      if (input.paymentEventId) {
        await tx.paymentEvent.update({
          where: { id: input.paymentEventId },
          data: {
            processedAt: new Date(),
            paymentReference: fields.providerPaymentId,
          },
        });
      }

      return {
        ignored: true,
        orderId: null,
        paymentId: null,
        paymentTransition: null,
        orderTransition: null,
      } satisfies Pick<
        PaymentSyncResult,
        "ignored" | "orderId" | "paymentId" | "paymentTransition" | "orderTransition"
      >;
    }

    const paymentTransition = transitionPaymentStatus(payment.status, resolution);

    payment = await tx.payment.update({
      where: {
        id: payment.id,
      },
      data: {
        status: paymentTransition.kind === "apply" ? paymentTransition.next : undefined,
        providerPaymentId: fields.providerPaymentId,
        providerPreferenceId: fields.providerPreferenceId,
        externalReference: fields.externalReference || order?.id || payment.externalReference,
        amountInCents: fields.amountInCents || payment.amountInCents,
        rawPayload: toJsonValue(snapshot),
        processedAt: new Date(),
      },
    });

    let orderTransition: TransitionDecision<Order["status"]> | null = null;

    if (order) {
      orderTransition = transitionOrderStatus(order.status, resolution);

      if (orderTransition.kind === "apply") {
        await tx.order.update({
          where: { id: order.id },
          data: {
            status: orderTransition.next,
            ...selectOrderTimestampPatch(orderTransition.next, order),
          },
        });
      }
    }

    if (isTerminalResolution(resolution)) {
      await markReconciliationCompleted(
        {
          tenantId: input.tenantId,
          paymentId: payment.id,
          providerStatus: resolution.normalizedStatus,
        },
        tx
      );
    } else if (shouldQueueRetryForPending(payment.status, paymentTransition, resolution)) {
      await enqueueReconciliationJob(
        {
          tenantId: input.tenantId,
          paymentId: payment.id,
          orderId: order?.id || payment.orderId,
          externalReference: fields.externalReference || payment.externalReference,
        },
        tx
      );
    }

    if (input.paymentEventId) {
      await tx.paymentEvent.update({
        where: {
          id: input.paymentEventId,
        },
        data: {
          orderId: order?.id || null,
          paymentId: payment.id,
          paymentReference: fields.providerPaymentId,
          processedAt: new Date(),
        },
      });
    }

    return {
      ignored: false,
      orderId: order?.id || payment.orderId,
      paymentId: payment.id,
      paymentTransition,
      orderTransition,
    } satisfies Pick<
      PaymentSyncResult,
      "ignored" | "orderId" | "paymentId" | "paymentTransition" | "orderTransition"
    >;
  });

  return {
    tenantId: input.tenantId,
    providerPaymentId: fields.providerPaymentId,
    providerPreferenceId: fields.providerPreferenceId,
    externalReference: fields.externalReference,
    resolution,
    ...result,
  } satisfies PaymentSyncResult;
}
