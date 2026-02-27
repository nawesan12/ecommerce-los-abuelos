import type { Product } from "@/src/types/product";

const DEFAULT_TENANT_SLUG = "rafa-petshop";

interface GetProductsFilters {
  category?: string;
  brand?: string;
  query?: string;
  tags?: string[];
  limit?: number;
}

function buildQuery(params: Record<string, string | number | undefined>) {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === "") {
      continue;
    }

    search.set(key, String(value));
  }

  return search.toString();
}

async function getJson<T>(url: string, fallback: T): Promise<T> {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
      return fallback;
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error("[catalog:client]", error);
    return fallback;
  }
}

export async function getProducts(
  tenantSlug = DEFAULT_TENANT_SLUG,
  filters: GetProductsFilters = {}
) {
  const query = buildQuery({
    tenantSlug,
    category: filters.category,
    brand: filters.brand,
    q: filters.query,
    limit: filters.limit,
    tags: filters.tags?.join(","),
  });

  return getJson<Product[]>(`/api/catalog/products${query ? `?${query}` : ""}`, []);
}

export async function getProductById(
  id: string,
  tenantSlug = DEFAULT_TENANT_SLUG
) {
  const query = buildQuery({ tenantSlug });

  return getJson<Product | null>(
    `/api/catalog/products/${encodeURIComponent(id)}${query ? `?${query}` : ""}`,
    null
  );
}

export async function searchProducts(
  query: string,
  tenantSlug = DEFAULT_TENANT_SLUG
) {
  const normalized = query.trim();

  if (!normalized) {
    return [];
  }

  const params = buildQuery({ tenantSlug, q: normalized });
  return getJson<Product[]>(`/api/catalog/search?${params}`, []);
}

export async function getProductsByCategory(
  category: "perro" | "gato",
  tenantSlug = DEFAULT_TENANT_SLUG
) {
  return getProducts(tenantSlug, { category });
}

export async function getProductsByBrand(
  brand: string,
  tenantSlug = DEFAULT_TENANT_SLUG
) {
  return getProducts(tenantSlug, { brand });
}
