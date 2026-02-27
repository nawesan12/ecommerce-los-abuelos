import type { Prisma } from "@prisma/client";

function normalizeLockKey(lockKey: string) {
  return lockKey.trim() || "payments:default";
}

export async function acquirePaymentStateLock(
  tx: Prisma.TransactionClient,
  lockKey: string
) {
  const normalized = normalizeLockKey(lockKey);

  await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${normalized}))`;
}

export function buildPaymentLockKey(input: {
  tenantId: string;
  orderId?: string | null;
  providerPaymentId?: string | null;
  providerPreferenceId?: string | null;
}) {
  const token =
    input.providerPaymentId || input.providerPreferenceId || input.orderId || "unknown";

  return `payments:${input.tenantId}:${token}`;
}
