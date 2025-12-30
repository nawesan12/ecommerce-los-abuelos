import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";

const accessToken =
  process.env.MERCADOPAGO_ACCESS_TOKEN || process.env.MP_ACCESS_TOKEN;

if (!accessToken) {
  throw new Error("Falta MERCADOPAGO_ACCESS_TOKEN en .env.local");
}

const mpClient = new MercadoPagoConfig({ accessToken });
const preferenceClient = new Preference(mpClient);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body?.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: "Body inválido: items debe ser un array con al menos 1 item" },
        { status: 400 }
      );
    }

    const preferenceBody = {
  items: body.items.map((item: any) => ({
    title: String(item.title),
    unit_price: Number(item.price),
    quantity: Number(item.quantity),
    currency_id: "ARS",
  })),

  payer: {
    email: String(body?.payer?.email ?? "test_user@test.com"),
  },

  back_urls: {
    success: "http://localhost:3000/pago/success",
    failure: "http://localhost:3000/pago/failure",
    pending: "http://localhost:3000/pago/pending",
  },

  
};

    const result = await preferenceClient.create({ body: preferenceBody });

    return NextResponse.json({
      id: result.id,
      init_point: result.init_point,
      sandbox_init_point: (result as any).sandbox_init_point,
    });
  } catch (error: any) {
    console.error("MercadoPago error:", error);

    // Si MP devuelve detalle, lo devolvemos para debug en Thunder
    const mpMessage =
      error?.message ||
      error?.cause?.[0]?.description ||
      error?.response?.data ||
      null;

    return NextResponse.json(
      { error: "Error creando preferencia", detail: mpMessage },
      { status: 500 }
    );
  }
}