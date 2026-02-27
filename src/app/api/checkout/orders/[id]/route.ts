import { NextResponse } from "next/server";

import { getCheckoutOrderStatus } from "@/src/server/checkout/service";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (!id?.trim()) {
    return NextResponse.json(
      {
        error: "INVALID_ORDER_ID",
        message: "orderId inválido",
      },
      { status: 400 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);

    const result = await getCheckoutOrderStatus({
      orderId: id,
      tenantSlug: searchParams.get("tenantSlug") || undefined,
    });

    if (!result) {
      return NextResponse.json(
        {
          error: "ORDER_NOT_FOUND",
          message: "Orden no encontrada",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("[checkout:order-status]", error);
    return NextResponse.json(
      {
        error: "ORDER_STATUS_FAILED",
        message: "No se pudo consultar el estado de la orden",
      },
      { status: 500 }
    );
  }
}
