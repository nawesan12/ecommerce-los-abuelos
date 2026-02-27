import { NextResponse } from "next/server";
import { DEFAULT_TENANT_SLUG, getProducts } from "@/src/server/catalog";

function parseTags(tagsParam: string | null) {
  if (!tagsParam) {
    return undefined;
  }

  const tags = tagsParam
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);

  return tags.length ? tags : undefined;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const tenantSlug = searchParams.get("tenantSlug") || DEFAULT_TENANT_SLUG;
  const category = searchParams.get("category") || undefined;
  const brand = searchParams.get("brand") || undefined;
  const query = searchParams.get("q") || undefined;
  const tags = parseTags(searchParams.get("tags"));

  const rawLimit = searchParams.get("limit");
  const limitParam =
    rawLimit && rawLimit.trim() !== "" ? Number(rawLimit) : undefined;
  const limit =
    limitParam !== undefined && Number.isFinite(limitParam)
      ? limitParam
      : undefined;

  const products = await getProducts(tenantSlug, {
    category,
    brand,
    query,
    tags,
    limit,
  });

  return NextResponse.json(products);
}
