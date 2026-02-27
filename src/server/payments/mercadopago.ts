import crypto from "node:crypto";
import { MercadoPagoConfig, Payment, Preference } from "mercadopago";

export const PAYMENT_PROVIDER = "mercadopago";
const MERCADOPAGO_API_BASE_URL = "https://api.mercadopago.com";

export interface PreferenceSnapshotItem {
  title: string;
  quantity: number;
  unitPriceInCents: number;
}

export interface CreatePreferenceInput {
  orderId: string;
  tenantSlug: string;
  currencyCode: string;
  customerEmail: string;
  items: PreferenceSnapshotItem[];
}

export interface CreatePreferenceOutput {
  preferenceId: string;
  checkoutUrl: string | null;
  sandboxCheckoutUrl: string | null;
  rawResponse: unknown;
}

function getMercadoPagoAccessToken() {
  const token =
    process.env.MERCADOPAGO_ACCESS_TOKEN || process.env.MP_ACCESS_TOKEN;

  if (!token) {
    throw new Error("MERCADOPAGO_ACCESS_TOKEN no configurado");
  }

  return token;
}

function getMercadoPagoApiBaseUrl() {
  return process.env.MERCADOPAGO_API_BASE_URL || MERCADOPAGO_API_BASE_URL;
}

function getMercadoPagoBaseUrl() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return baseUrl.replace(/\/+$/, "");
}

function createMercadoPagoClients() {
  const client = new MercadoPagoConfig({ accessToken: getMercadoPagoAccessToken() });

  return {
    paymentClient: new Payment(client),
    preferenceClient: new Preference(client),
  };
}

export async function createMercadoPagoPreference(
  input: CreatePreferenceInput
): Promise<CreatePreferenceOutput> {
  const { preferenceClient } = createMercadoPagoClients();
  const siteUrl = getMercadoPagoBaseUrl();

  const preference = await preferenceClient.create({
    body: {
      items: input.items.map((item, index) => ({
        id: String(index + 1),
        title: item.title,
        quantity: item.quantity,
        unit_price: item.unitPriceInCents / 100,
        currency_id: input.currencyCode,
      })),
      payer: {
        email: input.customerEmail,
      },
      external_reference: input.orderId,
      notification_url: `${siteUrl}/api/payments/webhook`,
      back_urls: {
        success: `${siteUrl}/pago/success?orderId=${encodeURIComponent(input.orderId)}`,
        failure: `${siteUrl}/pago/failure?orderId=${encodeURIComponent(input.orderId)}`,
        pending: `${siteUrl}/pago/pending?orderId=${encodeURIComponent(input.orderId)}`,
      },
      metadata: {
        orderId: input.orderId,
        tenantSlug: input.tenantSlug,
      },
    },
  });

  return {
    preferenceId: String(preference.id),
    checkoutUrl: preference.init_point || null,
    sandboxCheckoutUrl: (preference as { sandbox_init_point?: string | null }).sandbox_init_point || null,
    rawResponse: preference,
  };
}

export async function fetchMercadoPagoPayment(paymentReference: string) {
  const { paymentClient } = createMercadoPagoClients();
  return paymentClient.get({ id: paymentReference as never });
}

export async function searchMercadoPagoPaymentByExternalReference(
  externalReference: string
) {
  const token = getMercadoPagoAccessToken();
  const url = new URL(`${getMercadoPagoApiBaseUrl()}/v1/payments/search`);

  url.searchParams.set("external_reference", externalReference);
  url.searchParams.set("sort", "date_created");
  url.searchParams.set("criteria", "desc");
  url.searchParams.set("limit", "1");

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Mercado Pago payment search failed: ${response.status} ${response.statusText}`
    );
  }

  const payload = (await response.json()) as {
    results?: unknown[];
  };

  if (!Array.isArray(payload.results) || payload.results.length === 0) {
    return null;
  }

  const [first] = payload.results;

  if (!first || typeof first !== "object") {
    return null;
  }

  return first as Record<string, unknown>;
}

function safeCompare(a: string, b: string) {
  const left = Buffer.from(a, "utf8");
  const right = Buffer.from(b, "utf8");

  if (left.length !== right.length) {
    return false;
  }

  return crypto.timingSafeEqual(left, right);
}

function parseMercadoPagoSignature(signatureHeader: string | null) {
  if (!signatureHeader) {
    return null;
  }

  const parts = signatureHeader
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce<Record<string, string>>((acc, current) => {
      const [key, value] = current.split("=");

      if (key && value) {
        acc[key] = value;
      }

      return acc;
    }, {});

  if (!parts.ts || !parts.v1) {
    return null;
  }

  return { ts: parts.ts, v1: parts.v1 };
}

export function verifyMercadoPagoWebhookSignature(input: {
  signatureHeader: string | null;
  requestIdHeader: string | null;
  dataId: string | null;
}): boolean {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;

  if (!secret) {
    return false;
  }

  const parsed = parseMercadoPagoSignature(input.signatureHeader);

  if (!parsed || !input.requestIdHeader || !input.dataId) {
    return false;
  }

  const manifest = `id:${input.dataId};request-id:${input.requestIdHeader};ts:${parsed.ts};`;

  const generated = crypto
    .createHmac("sha256", secret)
    .update(manifest)
    .digest("hex");

  return safeCompare(generated, parsed.v1);
}

export function extractJsonObject(rawBody: string): Record<string, unknown> {
  try {
    const parsed = JSON.parse(rawBody);

    if (parsed && typeof parsed === "object") {
      return parsed as Record<string, unknown>;
    }
  } catch {
    return {};
  }

  return {};
}
