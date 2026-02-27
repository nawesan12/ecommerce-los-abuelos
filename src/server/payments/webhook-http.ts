import { NextResponse } from "next/server";

import {
  extractJsonObject,
  verifyMercadoPagoWebhookSignature,
} from "@/src/server/payments/mercadopago";
import { processPaymentWebhook } from "@/src/server/payments/webhook-service";

function extractDataId(payload: Record<string, unknown>, url: URL) {
  const bodyData = payload.data;

  if (bodyData && typeof bodyData === "object" && !Array.isArray(bodyData)) {
    const idValue = (bodyData as Record<string, unknown>).id;

    if (typeof idValue === "string" || typeof idValue === "number") {
      return String(idValue);
    }
  }

  const queryDataId = url.searchParams.get("data.id");

  if (queryDataId?.trim()) {
    return queryDataId.trim();
  }

  return null;
}

export async function handlePaymentsWebhook(request: Request) {
  const url = new URL(request.url);
  const rawBody = await request.text();
  const payload = extractJsonObject(rawBody);

  const signatureValid = verifyMercadoPagoWebhookSignature({
    signatureHeader: request.headers.get("x-signature"),
    requestIdHeader: request.headers.get("x-request-id"),
    dataId: extractDataId(payload, url),
  });

  if (!signatureValid) {
    console.warn("[payments:webhook] invalid signature");
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  try {
    const result = await processPaymentWebhook({
      payload,
      rawBody,
      signatureValid,
      tenantSlug: url.searchParams.get("tenantSlug") || undefined,
    });

    console.log("[payments:webhook]", {
      rawEventId: result.rawEventId,
      duplicate: result.duplicate,
      ignored: result.ignored,
      orderId: result.orderId,
      paymentId: result.paymentId,
    });

    return NextResponse.json({ received: true, duplicate: result.duplicate });
  } catch (error) {
    console.error("[payments:webhook:error]", error);
    return NextResponse.json({ error: "webhook processing failed" }, { status: 500 });
  }
}
