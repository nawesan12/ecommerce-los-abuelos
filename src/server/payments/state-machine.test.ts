import { describe, expect, it } from "vitest";

import {
  resolveMercadoPagoStatus,
  transitionOrderStatus,
  transitionPaymentStatus,
} from "@/src/server/payments/state-machine";

function applyProviderStatuses(
  statuses: string[],
  initial: {
    order: "PENDING_PAYMENT" | "PAID" | "PREPARING" | "READY_FOR_DELIVERY" | "DELIVERED" | "FAILED" | "CANCELLED";
    payment: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
  }
) {
  let order = initial.order;
  let payment = initial.payment;

  for (const status of statuses) {
    const resolution = resolveMercadoPagoStatus(status);
    const paymentDecision = transitionPaymentStatus(payment, resolution);
    const orderDecision = transitionOrderStatus(order, resolution);

    if (paymentDecision.kind === "apply") {
      payment = paymentDecision.next;
    }

    if (orderDecision.kind === "apply") {
      order = orderDecision.next;
    }
  }

  return { order, payment };
}

describe("Mercado Pago state machine", () => {
  it("maps every required MP status", () => {
    const requiredStatuses = [
      "approved",
      "authorized",
      "in_process",
      "pending",
      "rejected",
      "cancelled",
      "refunded",
      "charged_back",
    ] as const;

    const mapped = requiredStatuses.map((status) =>
      resolveMercadoPagoStatus(status)
    );

    expect(mapped.map((item) => item.normalizedStatus)).toEqual(requiredStatuses);
    expect(mapped[0].paymentTargetStatus).toBe("APPROVED");
    expect(mapped[1].paymentTargetStatus).toBe("PENDING");
    expect(mapped[4].paymentTargetStatus).toBe("REJECTED");
    expect(mapped[5].paymentTargetStatus).toBe("CANCELLED");
    expect(mapped[6].paymentTargetStatus).toBe("CANCELLED");
    expect(mapped[7].paymentTargetStatus).toBe("CANCELLED");
  });

  it("allows valid order transitions and blocks invalid ones", () => {
    const approved = resolveMercadoPagoStatus("approved");
    const rejected = resolveMercadoPagoStatus("rejected");
    const refunded = resolveMercadoPagoStatus("refunded");

    expect(transitionOrderStatus("PENDING_PAYMENT", approved)).toMatchObject({
      kind: "apply",
      next: "PAID",
    });

    expect(transitionOrderStatus("PAID", rejected)).toMatchObject({
      kind: "invalid",
      next: "PAID",
    });

    expect(transitionOrderStatus("PREPARING", refunded)).toMatchObject({
      kind: "invalid",
      next: "PREPARING",
    });
  });

  it("does not downgrade approved payment on out-of-order pending webhook", () => {
    const pending = resolveMercadoPagoStatus("pending");

    expect(transitionPaymentStatus("APPROVED", pending)).toMatchObject({
      kind: "invalid",
      next: "APPROVED",
    });
  });

  it("converges to same final state for webhook/reconciler race (pending vs approved)", () => {
    const initial = {
      order: "PENDING_PAYMENT" as const,
      payment: "PENDING" as const,
    };

    const sequenceA = applyProviderStatuses(["pending", "approved"], initial);
    const sequenceB = applyProviderStatuses(["approved", "pending"], initial);

    expect(sequenceA).toEqual({ order: "PAID", payment: "APPROVED" });
    expect(sequenceB).toEqual({ order: "PAID", payment: "APPROVED" });
  });
});
