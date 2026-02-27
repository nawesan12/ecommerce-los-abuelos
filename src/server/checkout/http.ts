import { NextResponse } from "next/server";

import { checkoutRequestSchema } from "@/src/server/checkout/schema";
import {
  CheckoutServiceError,
  createCheckoutIntent,
} from "@/src/server/checkout/service";
import { consumeRateLimit, getRequestIp } from "@/src/server/rate-limit";

const IDEMPOTENCY_KEY_REGEX = /^[a-zA-Z0-9._:-]{1,128}$/;

function sanitizeIdempotencyKey(value: string | null) {
  if (!value) {
    return undefined;
  }

  const key = value.trim();

  if (!key) {
    return undefined;
  }

  if (!IDEMPOTENCY_KEY_REGEX.test(key)) {
    throw new CheckoutServiceError(
      400,
      "INVALID_IDEMPOTENCY_KEY",
      "Idempotency-Key inválida"
    );
  }

  return key;
}

function formatZodErrors(errors: string[]) {
  return errors.filter(Boolean).slice(0, 5);
}

export async function handleCheckoutPost(request: Request) {
  const requestIp = getRequestIp(request);

  if (!consumeRateLimit(`checkout:${requestIp}`, 30, 60_000)) {
    return NextResponse.json(
      {
        error: "RATE_LIMITED",
        message: "Demasiados intentos. Reintentá en unos segundos.",
      },
      { status: 429 }
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        error: "INVALID_JSON",
        message: "Body JSON inválido",
      },
      { status: 400 }
    );
  }

  const parsed = checkoutRequestSchema.safeParse(body);

  if (!parsed.success) {
    const errors = parsed.error.issues.map((issue) => issue.message);

    return NextResponse.json(
      {
        error: "VALIDATION_ERROR",
        message: "Datos de checkout inválidos",
        details: formatZodErrors(errors),
      },
      { status: 400 }
    );
  }

  try {
    const idempotencyKey = sanitizeIdempotencyKey(
      request.headers.get("idempotency-key")
    );

    const result = await createCheckoutIntent({
      payload: parsed.data,
      idempotencyKey,
    });

    return NextResponse.json(result, {
      status: result.idempotencyReused ? 200 : 201,
    });
  } catch (error) {
    if (error instanceof CheckoutServiceError) {
      return NextResponse.json(
        {
          error: error.code,
          message: error.message,
        },
        { status: error.status }
      );
    }

    console.error("[checkout:create]", error);

    return NextResponse.json(
      {
        error: "CHECKOUT_FAILED",
        message: "No se pudo iniciar el checkout",
      },
      { status: 500 }
    );
  }
}
