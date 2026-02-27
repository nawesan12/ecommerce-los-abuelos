import type { Prisma, PrismaClient } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { PAYMENT_PROVIDER } from "@/src/server/payments/mercadopago";

const BASE_BACKOFF_MS = 30_000;
const MAX_BACKOFF_MS = 30 * 60_000;
export const DEFAULT_MAX_RETRY_ATTEMPTS = 7;

type DbClient = PrismaClient | Prisma.TransactionClient;

function getDbClient(tx?: Prisma.TransactionClient): DbClient {
  return tx || prisma;
}

export function computeBackoffDelayMs(attempt: number) {
  const safeAttempt = Math.max(1, Math.min(10, attempt));
  const exponential = BASE_BACKOFF_MS * Math.pow(2, safeAttempt - 1);
  const bounded = Math.min(MAX_BACKOFF_MS, exponential);
  const jitter = Math.round(bounded * Math.random() * 0.2);
  return bounded + jitter;
}

export function computeNextRetryAt(attempt: number, now = new Date()) {
  return new Date(now.getTime() + computeBackoffDelayMs(attempt));
}

export async function enqueueReconciliationJob(
  input: {
    tenantId: string;
    paymentId: string;
    orderId?: string | null;
    externalReference?: string | null;
    nextRetryAt?: Date;
  },
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);
  const nextRetryAt = input.nextRetryAt || new Date();

  return db.paymentReconciliationJob.upsert({
    where: {
      tenantId_paymentId: {
        tenantId: input.tenantId,
        paymentId: input.paymentId,
      },
    },
    update: {
      orderId: input.orderId || null,
      externalReference: input.externalReference || null,
      provider: PAYMENT_PROVIDER,
      status: "PENDING",
      nextRetryAt,
      finishedAt: null,
      lastError: null,
      lastProviderStatus: null,
    },
    create: {
      tenantId: input.tenantId,
      paymentId: input.paymentId,
      orderId: input.orderId || null,
      provider: PAYMENT_PROVIDER,
      externalReference: input.externalReference || null,
      status: "PENDING",
      nextRetryAt,
      maxAttempts: DEFAULT_MAX_RETRY_ATTEMPTS,
    },
  });
}

export async function markReconciliationCompleted(
  input: {
    tenantId: string;
    paymentId: string;
    providerStatus?: string | null;
  },
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  await db.paymentReconciliationJob.updateMany({
    where: {
      tenantId: input.tenantId,
      paymentId: input.paymentId,
    },
    data: {
      status: "COMPLETED",
      finishedAt: new Date(),
      nextRetryAt: new Date(),
      lastProviderStatus: input.providerStatus || null,
      lastError: null,
    },
  });
}

export async function scheduleReconciliationRetry(
  input: {
    jobId: string;
    attempt: number;
    maxAttempts: number;
    providerStatus?: string | null;
    errorMessage?: string | null;
  },
  tx?: Prisma.TransactionClient
) {
  const db = getDbClient(tx);

  if (input.attempt >= input.maxAttempts) {
    await db.paymentReconciliationJob.update({
      where: { id: input.jobId },
      data: {
        status: "DEAD",
        finishedAt: new Date(),
        lastProviderStatus: input.providerStatus || null,
        lastError: input.errorMessage || "max attempts reached",
      },
    });

    return {
      status: "DEAD" as const,
    };
  }

  const nextRetryAt = computeNextRetryAt(input.attempt + 1);

  await db.paymentReconciliationJob.update({
    where: { id: input.jobId },
    data: {
      status: "PENDING",
      nextRetryAt,
      lastProviderStatus: input.providerStatus || null,
      lastError: input.errorMessage || null,
    },
  });

  return {
    status: "PENDING" as const,
    nextRetryAt,
  };
}

export async function markReconciliationProcessing(jobId: string) {
  const now = new Date();

  const claimed = await prisma.paymentReconciliationJob.updateMany({
    where: {
      id: jobId,
      status: "PENDING",
      nextRetryAt: {
        lte: now,
      },
    },
    data: {
      status: "PROCESSING",
      attempt: {
        increment: 1,
      },
      lastAttemptAt: now,
    },
  });

  return claimed.count > 0;
}
