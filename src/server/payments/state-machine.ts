import { OrderStatus, PaymentStatus } from "@prisma/client";

export type MercadoPagoKnownStatus =
  | "approved"
  | "authorized"
  | "in_process"
  | "pending"
  | "rejected"
  | "cancelled"
  | "refunded"
  | "charged_back";

export type MercadoPagoStatus = MercadoPagoKnownStatus | "unknown";
export type PaymentLifecycle = "success" | "pending" | "failure" | "cancelled" | "unknown";
export type TransitionKind = "apply" | "noop" | "invalid";

export type TransitionDecision<T extends string> = {
  kind: TransitionKind;
  current: T;
  next: T;
  reason: string;
};

export type ProviderStatusResolution = {
  rawStatus: string | null;
  normalizedStatus: MercadoPagoStatus;
  lifecycle: PaymentLifecycle;
  paymentTargetStatus: PaymentStatus;
  retryable: boolean;
  terminal: boolean;
};

const KNOWN_MP_STATUSES = new Set<MercadoPagoKnownStatus>([
  "approved",
  "authorized",
  "in_process",
  "pending",
  "rejected",
  "cancelled",
  "refunded",
  "charged_back",
]);

export function normalizeMercadoPagoStatus(rawStatus: string | null | undefined): MercadoPagoStatus {
  const normalized = (rawStatus || "").trim().toLowerCase();

  if (!normalized) {
    return "unknown";
  }

  if (KNOWN_MP_STATUSES.has(normalized as MercadoPagoKnownStatus)) {
    return normalized as MercadoPagoKnownStatus;
  }

  return "unknown";
}

export function resolveMercadoPagoStatus(rawStatus: string | null | undefined): ProviderStatusResolution {
  const normalizedStatus = normalizeMercadoPagoStatus(rawStatus);

  switch (normalizedStatus) {
    case "approved":
      return {
        rawStatus: rawStatus || null,
        normalizedStatus,
        lifecycle: "success",
        paymentTargetStatus: "APPROVED",
        retryable: false,
        terminal: true,
      };
    case "authorized":
    case "in_process":
    case "pending":
      return {
        rawStatus: rawStatus || null,
        normalizedStatus,
        lifecycle: "pending",
        paymentTargetStatus: "PENDING",
        retryable: true,
        terminal: false,
      };
    case "rejected":
      return {
        rawStatus: rawStatus || null,
        normalizedStatus,
        lifecycle: "failure",
        paymentTargetStatus: "REJECTED",
        retryable: false,
        terminal: true,
      };
    case "cancelled":
    case "refunded":
    case "charged_back":
      return {
        rawStatus: rawStatus || null,
        normalizedStatus,
        lifecycle: "cancelled",
        paymentTargetStatus: "CANCELLED",
        retryable: false,
        terminal: true,
      };
    default:
      return {
        rawStatus: rawStatus || null,
        normalizedStatus: "unknown",
        lifecycle: "unknown",
        paymentTargetStatus: "PENDING",
        retryable: true,
        terminal: false,
      };
  }
}

function makeDecision<T extends string>(
  kind: TransitionKind,
  current: T,
  next: T,
  reason: string
): TransitionDecision<T> {
  return {
    kind,
    current,
    next,
    reason,
  };
}

export function transitionPaymentStatus(
  current: PaymentStatus,
  resolution: ProviderStatusResolution
): TransitionDecision<PaymentStatus> {
  const target = resolution.paymentTargetStatus;

  if (current === target) {
    return makeDecision("noop", current, current, "already_in_target_state");
  }

  if (current === "PENDING") {
    return makeDecision("apply", current, target, "pending_to_provider_target");
  }

  if (current === "REJECTED") {
    if (target === "APPROVED" || target === "CANCELLED") {
      return makeDecision("apply", current, target, "rejected_recovered_or_finalized");
    }

    return makeDecision("invalid", current, current, "rejected_cannot_downgrade_to_pending");
  }

  if (current === "APPROVED") {
    if (target === "CANCELLED" && resolution.lifecycle === "cancelled") {
      return makeDecision("apply", current, target, "approved_reversed_by_provider");
    }

    return makeDecision("invalid", current, current, "approved_is_terminal_except_reversal");
  }

  if (current === "CANCELLED") {
    return makeDecision("invalid", current, current, "cancelled_is_terminal");
  }

  return makeDecision("invalid", current, current, "unhandled_payment_transition");
}

export function transitionOrderStatus(
  current: OrderStatus,
  resolution: ProviderStatusResolution
): TransitionDecision<OrderStatus> {
  if (resolution.lifecycle === "pending" || resolution.lifecycle === "unknown") {
    return makeDecision("noop", current, current, "pending_or_unknown_event_noop");
  }

  if (resolution.lifecycle === "success") {
    if (current === "PENDING_PAYMENT" || current === "FAILED") {
      return makeDecision("apply", current, "PAID", "payment_approved");
    }

    if (
      current === "PAID" ||
      current === "PREPARING" ||
      current === "READY_FOR_DELIVERY" ||
      current === "DELIVERED"
    ) {
      return makeDecision("noop", current, current, "already_paid_or_fulfillment_started");
    }

    return makeDecision("invalid", current, current, "cancelled_order_cannot_return_to_paid");
  }

  if (resolution.lifecycle === "failure") {
    if (current === "PENDING_PAYMENT") {
      return makeDecision("apply", current, "FAILED", "payment_rejected");
    }

    if (current === "FAILED") {
      return makeDecision("noop", current, current, "already_failed");
    }

    return makeDecision("invalid", current, current, "rejection_after_paid_or_cancelled_is_ignored");
  }

  if (resolution.lifecycle === "cancelled") {
    if (current === "PENDING_PAYMENT" || current === "FAILED" || current === "PAID") {
      return makeDecision("apply", current, "CANCELLED", "payment_cancelled_or_reversed");
    }

    if (current === "CANCELLED") {
      return makeDecision("noop", current, current, "already_cancelled");
    }

    return makeDecision("invalid", current, current, "cannot_cancel_order_in_fulfillment_or_delivered");
  }

  return makeDecision("noop", current, current, "fallback_noop");
}

export function isRetryableResolution(resolution: ProviderStatusResolution) {
  return resolution.retryable && !resolution.terminal;
}

export function isTerminalResolution(resolution: ProviderStatusResolution) {
  return resolution.terminal;
}
