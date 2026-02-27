import { NextResponse } from "next/server";

import { runPaymentsReconciliationBatch } from "@/src/server/payments/reconciliation";

function isAuthorized(request: Request) {
  const configuredSecret = process.env.PAYMENTS_RECONCILE_SECRET;

  if (!configuredSecret) {
    return false;
  }

  const provided = request.headers.get("x-reconcile-secret")?.trim();

  if (!provided) {
    return false;
  }

  return provided === configuredSecret;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      {
        error: "UNAUTHORIZED",
        message: "Missing or invalid reconcile secret",
      },
      { status: 401 }
    );
  }

  let payload: unknown = {};

  try {
    payload = await request.json();
  } catch {
    payload = {};
  }

  const body = (payload && typeof payload === "object" ? payload : {}) as {
    limit?: number;
    tenantSlug?: string;
  };

  try {
    const result = await runPaymentsReconciliationBatch({
      limit: body.limit,
      tenantSlug: body.tenantSlug,
    });

    return NextResponse.json({
      ok: true,
      ...result,
    });
  } catch (error) {
    console.error("[payments:reconcile:route]", error);

    return NextResponse.json(
      {
        error: "RECONCILIATION_FAILED",
        message: "No se pudo ejecutar la reconciliación",
      },
      { status: 500 }
    );
  }
}
