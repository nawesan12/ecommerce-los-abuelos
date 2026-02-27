-- CreateEnum
CREATE TYPE "ReconciliationStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'DEAD');

-- CreateTable
CREATE TABLE "PaymentReconciliationJob" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "orderId" TEXT,
    "paymentId" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'mercadopago',
    "externalReference" TEXT,
    "status" "ReconciliationStatus" NOT NULL DEFAULT 'PENDING',
    "attempt" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 7,
    "nextRetryAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastAttemptAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "lastProviderStatus" TEXT,
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentReconciliationJob_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PaymentReconciliationJob_tenantId_status_nextRetryAt_idx" ON "PaymentReconciliationJob"("tenantId", "status", "nextRetryAt");

-- CreateIndex
CREATE INDEX "PaymentReconciliationJob_orderId_idx" ON "PaymentReconciliationJob"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentReconciliationJob_tenantId_paymentId_key" ON "PaymentReconciliationJob"("tenantId", "paymentId");

-- AddForeignKey
ALTER TABLE "PaymentReconciliationJob" ADD CONSTRAINT "PaymentReconciliationJob_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentReconciliationJob" ADD CONSTRAINT "PaymentReconciliationJob_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentReconciliationJob" ADD CONSTRAINT "PaymentReconciliationJob_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
