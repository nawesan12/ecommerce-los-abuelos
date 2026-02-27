import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import {
  fetchMercadoPagoPayment,
  searchMercadoPagoPaymentByExternalReference,
} from "@/src/server/payments/mercadopago";
import {
  markReconciliationProcessing,
  scheduleReconciliationRetry,
} from "@/src/server/payments/reconciliation-jobs";
import { syncMercadoPagoPaymentState } from "@/src/server/payments/sync-service";

const MAX_BATCH_SIZE = 100;

type ReconciliationJobWithRelations = Prisma.PaymentReconciliationJobGetPayload<{
  include: {
    tenant: {
      select: {
        id: true;
        slug: true;
      };
    };
    payment: {
      select: {
        id: true;
        providerPaymentId: true;
        externalReference: true;
      };
    };
    order: {
      select: {
        id: true;
      };
    };
  };
}>;

export type ReconciliationBatchResult = {
  scanned: number;
  processed: number;
  completed: number;
  retried: number;
  dead: number;
  skipped: number;
  errors: number;
};

function toSafeErrorMessage(error: unknown) {
  if (!error) {
    return "unknown error";
  }

  if (error instanceof Error) {
    return error.message.slice(0, 300);
  }

  return String(error).slice(0, 300);
}

function normalizeBatchLimit(input?: number) {
  if (!input || !Number.isFinite(input)) {
    return 10;
  }

  return Math.max(1, Math.min(MAX_BATCH_SIZE, Math.trunc(input)));
}

async function loadProviderPaymentForJob(job: ReconciliationJobWithRelations) {
  if (job.payment.providerPaymentId) {
    return (await fetchMercadoPagoPayment(
      job.payment.providerPaymentId
    )) as unknown as Record<string, unknown>;
  }

  const externalReference =
    job.externalReference || job.payment.externalReference || job.orderId;

  if (!externalReference) {
    return null;
  }

  return searchMercadoPagoPaymentByExternalReference(externalReference);
}

async function getDueReconciliationJobs(input: {
  tenantSlug?: string;
  limit: number;
}) {
  const where: Prisma.PaymentReconciliationJobWhereInput = {
    status: "PENDING",
    nextRetryAt: {
      lte: new Date(),
    },
  };

  if (input.tenantSlug?.trim()) {
    where.tenant = {
      slug: input.tenantSlug.trim(),
    };
  }

  return prisma.paymentReconciliationJob.findMany({
    where,
    include: {
      tenant: {
        select: {
          id: true,
          slug: true,
        },
      },
      payment: {
        select: {
          id: true,
          providerPaymentId: true,
          externalReference: true,
        },
      },
      order: {
        select: {
          id: true,
        },
      },
    },
    orderBy: [{ nextRetryAt: "asc" }, { createdAt: "asc" }],
    take: input.limit,
  });
}

export async function runPaymentsReconciliationBatch(input?: {
  tenantSlug?: string;
  limit?: number;
}) {
  const limit = normalizeBatchLimit(input?.limit);
  const dueJobs = await getDueReconciliationJobs({
    tenantSlug: input?.tenantSlug,
    limit,
  });

  const summary: ReconciliationBatchResult = {
    scanned: dueJobs.length,
    processed: 0,
    completed: 0,
    retried: 0,
    dead: 0,
    skipped: 0,
    errors: 0,
  };

  for (const job of dueJobs) {
    const claimed = await markReconciliationProcessing(job.id);

    if (!claimed) {
      summary.skipped += 1;
      continue;
    }

    const fresh = await prisma.paymentReconciliationJob.findUnique({
      where: {
        id: job.id,
      },
      include: {
        tenant: {
          select: {
            id: true,
            slug: true,
          },
        },
        payment: {
          select: {
            id: true,
            providerPaymentId: true,
            externalReference: true,
          },
        },
        order: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!fresh) {
      summary.skipped += 1;
      continue;
    }

    try {
      const providerPayment = await loadProviderPaymentForJob(fresh);

      if (!providerPayment) {
        const scheduled = await scheduleReconciliationRetry({
          jobId: fresh.id,
          attempt: fresh.attempt,
          maxAttempts: fresh.maxAttempts,
          errorMessage: "provider payment not found",
        });

        summary.processed += 1;

        if (scheduled.status === "DEAD") {
          summary.dead += 1;
        } else {
          summary.retried += 1;
        }

        continue;
      }

      const syncResult = await syncMercadoPagoPaymentState({
        tenantId: fresh.tenantId,
        providerPayment,
        source: "reconciliation",
      });

      summary.processed += 1;

      if (syncResult.ignored) {
        const scheduled = await scheduleReconciliationRetry({
          jobId: fresh.id,
          attempt: fresh.attempt,
          maxAttempts: fresh.maxAttempts,
          providerStatus: syncResult.resolution.normalizedStatus,
          errorMessage: "sync ignored due to missing local payment/order",
        });

        if (scheduled.status === "DEAD") {
          summary.dead += 1;
        } else {
          summary.retried += 1;
        }

        continue;
      }

      if (syncResult.resolution.terminal) {
        summary.completed += 1;
      } else {
        const scheduled = await scheduleReconciliationRetry({
          jobId: fresh.id,
          attempt: fresh.attempt,
          maxAttempts: fresh.maxAttempts,
          providerStatus: syncResult.resolution.normalizedStatus,
        });

        if (scheduled.status === "DEAD") {
          summary.dead += 1;
        } else {
          summary.retried += 1;
        }
      }

      if (syncResult.paymentTransition?.kind === "invalid") {
        console.warn("[payments:reconcile:payment-transition-invalid]", {
          jobId: fresh.id,
          paymentId: syncResult.paymentId,
          reason: syncResult.paymentTransition.reason,
          providerStatus: syncResult.resolution.normalizedStatus,
        });
      }

      if (syncResult.orderTransition?.kind === "invalid") {
        console.warn("[payments:reconcile:order-transition-invalid]", {
          jobId: fresh.id,
          orderId: syncResult.orderId,
          reason: syncResult.orderTransition.reason,
          providerStatus: syncResult.resolution.normalizedStatus,
        });
      }
    } catch (error) {
      const message = toSafeErrorMessage(error);
      const scheduled = await scheduleReconciliationRetry({
        jobId: fresh.id,
        attempt: fresh.attempt,
        maxAttempts: fresh.maxAttempts,
        errorMessage: message,
      });

      summary.processed += 1;
      summary.errors += 1;

      if (scheduled.status === "DEAD") {
        summary.dead += 1;
      } else {
        summary.retried += 1;
      }

      console.error("[payments:reconcile:error]", {
        jobId: fresh.id,
        tenantId: fresh.tenantId,
        error: message,
      });
    }
  }

  return summary;
}
