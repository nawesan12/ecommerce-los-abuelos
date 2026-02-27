import { OrderStatus, PaymentStatus } from "@prisma/client";

export type PublicCheckoutStatus = "pending" | "paid" | "failed" | "cancelled";

export function toPublicOrderStatus(status: OrderStatus): PublicCheckoutStatus {
  switch (status) {
    case "PAID":
    case "PREPARING":
    case "READY_FOR_DELIVERY":
    case "DELIVERED":
      return "paid";
    case "FAILED":
      return "failed";
    case "CANCELLED":
      return "cancelled";
    default:
      return "pending";
  }
}

export function toPublicPaymentStatus(status: PaymentStatus): PublicCheckoutStatus {
  switch (status) {
    case "APPROVED":
      return "paid";
    case "REJECTED":
      return "failed";
    case "CANCELLED":
      return "cancelled";
    default:
      return "pending";
  }
}
