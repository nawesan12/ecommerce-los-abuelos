import { NextResponse } from "next/server";
import { DEFAULT_TENANT_SLUG, getProductById } from "@/src/server/catalog";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const { searchParams } = new URL(request.url);

  const tenantSlug = searchParams.get("tenantSlug") || DEFAULT_TENANT_SLUG;
  const product = await getProductById(tenantSlug, id);

  return NextResponse.json(product);
}
