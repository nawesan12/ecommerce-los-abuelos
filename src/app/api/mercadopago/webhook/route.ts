import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";

const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN!;

const mp = new MercadoPagoConfig({ accessToken });
const paymentClient = new Payment(mp);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const paymentId = body?.data?.id || body?.id;

    if (!paymentId) {
      return NextResponse.json({ ok: true });
    }

    // 🔍 Consultamos el pago real
    const payment = await paymentClient.get({ id: paymentId });

    const status = payment.status;

    console.log("WEBHOOK PAGO:", {
      id: payment.id,
      status,
      amount: payment.transaction_amount,
    });

    // ⚠️ Acá todavía NO guardamos orden (siguiente paso)
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}