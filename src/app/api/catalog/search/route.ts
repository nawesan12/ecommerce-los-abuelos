import { NextResponse } from "next/server";
import { DEFAULT_TENANT_SLUG, searchProducts } from "@/src/server/catalog";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const tenantSlug = searchParams.get("tenantSlug") || DEFAULT_TENANT_SLUG;
  const query = searchParams.get("q") || "";

  if (!query.trim()) {
    return NextResponse.json([]);
  }

  const products = await searchProducts(tenantSlug, query);
  return NextResponse.json(products);
}
