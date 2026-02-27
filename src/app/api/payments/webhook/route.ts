import { handlePaymentsWebhook } from "@/src/server/payments/webhook-http";

export async function POST(request: Request) {
  return handlePaymentsWebhook(request);
}
