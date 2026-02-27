import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMocks = vi.hoisted(() => ({
  tenantFindUnique: vi.fn(),
  paymentEventCreate: vi.fn(),
  paymentEventUpdate: vi.fn(),
}));

const providerMocks = vi.hoisted(() => ({
  fetchMercadoPagoPayment: vi.fn(),
  searchMercadoPagoPaymentByExternalReference: vi.fn(),
  syncMercadoPagoPaymentState: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    tenant: {
      findUnique: prismaMocks.tenantFindUnique,
    },
    paymentEvent: {
      create: prismaMocks.paymentEventCreate,
      update: prismaMocks.paymentEventUpdate,
    },
  },
}));

vi.mock("@/src/server/payments/mercadopago", () => ({
  PAYMENT_PROVIDER: "mercadopago",
  fetchMercadoPagoPayment: providerMocks.fetchMercadoPagoPayment,
  searchMercadoPagoPaymentByExternalReference:
    providerMocks.searchMercadoPagoPaymentByExternalReference,
}));

vi.mock("@/src/server/payments/sync-service", () => ({
  syncMercadoPagoPaymentState: providerMocks.syncMercadoPagoPaymentState,
}));

import { processPaymentWebhook } from "@/src/server/payments/webhook-service";

describe("webhook idempotency", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    prismaMocks.tenantFindUnique.mockResolvedValue({
      id: "tenant-1",
      slug: "rafa-petshop",
    });

    providerMocks.fetchMercadoPagoPayment.mockResolvedValue({
      id: "mp-payment-1",
      external_reference: "order-1",
      status: "approved",
    });

    providerMocks.searchMercadoPagoPaymentByExternalReference.mockResolvedValue(
      null
    );

    providerMocks.syncMercadoPagoPaymentState.mockResolvedValue({
      ignored: false,
      orderId: "order-1",
      paymentId: "payment-1",
      resolution: {
        normalizedStatus: "approved",
      },
      paymentTransition: { kind: "apply", reason: "ok" },
      orderTransition: { kind: "apply", reason: "ok" },
    });
  });

  it("returns duplicate=true on repeated webhook with same rawEventId", async () => {
    const seen = new Set<string>();

    prismaMocks.paymentEventCreate.mockImplementation(
      async ({ data }: { data: { rawEventId: string } }) => {
        if (seen.has(data.rawEventId)) {
          throw { code: "P2002" };
        }

        seen.add(data.rawEventId);

        return {
          id: `evt-${data.rawEventId}`,
        };
      }
    );

    const payload = {
      id: "event-001",
      data: {
        id: "mp-payment-1",
      },
      type: "payment",
    };

    const first = await processPaymentWebhook({
      payload,
      rawBody: JSON.stringify(payload),
      signatureValid: true,
    });

    const second = await processPaymentWebhook({
      payload,
      rawBody: JSON.stringify(payload),
      signatureValid: true,
    });

    expect(first.duplicate).toBe(false);
    expect(second.duplicate).toBe(true);
    expect(providerMocks.syncMercadoPagoPaymentState).toHaveBeenCalledTimes(1);
  });

  it("is idempotent under parallel duplicate webhook deliveries", async () => {
    const seen = new Set<string>();

    prismaMocks.paymentEventCreate.mockImplementation(
      async ({ data }: { data: { rawEventId: string } }) => {
        if (seen.has(data.rawEventId)) {
          throw { code: "P2002" };
        }

        seen.add(data.rawEventId);
        await new Promise((resolve) => setTimeout(resolve, 5));

        return {
          id: `evt-${data.rawEventId}`,
        };
      }
    );

    const payload = {
      id: "event-002",
      data: {
        id: "mp-payment-1",
      },
      type: "payment",
    };

    const [a, b] = await Promise.all([
      processPaymentWebhook({
        payload,
        rawBody: JSON.stringify(payload),
        signatureValid: true,
      }),
      processPaymentWebhook({
        payload,
        rawBody: JSON.stringify(payload),
        signatureValid: true,
      }),
    ]);

    const duplicates = [a.duplicate, b.duplicate].filter(Boolean).length;
    const nonDuplicates = [a.duplicate, b.duplicate].filter((item) => !item).length;

    expect(duplicates).toBe(1);
    expect(nonDuplicates).toBe(1);
    expect(providerMocks.syncMercadoPagoPaymentState).toHaveBeenCalledTimes(1);
  });
});
