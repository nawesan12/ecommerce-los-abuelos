import "server-only";

import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { Product } from "@/src/types/product";

export const DEFAULT_TENANT_SLUG = "rafa-petshop";

export interface CatalogFilters {
  category?: string;
  brand?: string;
  query?: string;
  tags?: string[];
  limit?: number;
}

const productSelect = {
  id: true,
  externalRef: true,
  title: true,
  imageUrl: true,
  brand: true,
  description: true,
  tags: true,
  category: true,
  variants: {
    where: { isActive: true },
    select: {
      id: true,
      externalRef: true,
      label: true,
      priceInCents: true,
    },
    orderBy: [{ priceInCents: "asc" }],
  },
} satisfies Prisma.ProductSelect;

type ProductRecord = Prisma.ProductGetPayload<{ select: typeof productSelect }>;

function normalizeTenantSlug(tenantSlug?: string) {
  return tenantSlug?.trim() || DEFAULT_TENANT_SLUG;
}

function normalizeLimit(limit?: number) {
  if (typeof limit !== "number" || !Number.isFinite(limit)) {
    return undefined;
  }

  return Math.min(Math.max(Math.trunc(limit), 1), 100);
}

function mapProductToUiShape(product: ProductRecord): Product {
  return {
    id: product.externalRef || product.id,
    title: product.title,
    image: product.imageUrl || "/img/11.png",
    brand: product.brand,
    description: product.description,
    tags: product.tags,
    category: product.category,
    variants: product.variants.map((variant) => ({
      id: variant.externalRef || variant.id,
      weight: variant.label,
      price: variant.priceInCents / 100,
    })),
  };
}

function buildSearchWhere(query: string): Prisma.ProductWhereInput[] {
  const tokens = query
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return tokens.map((token) => ({
    OR: [
      { title: { contains: token, mode: "insensitive" } },
      { brand: { contains: token, mode: "insensitive" } },
      { description: { contains: token, mode: "insensitive" } },
      { tags: { has: token } },
      {
        variants: {
          some: {
            isActive: true,
            label: { contains: token, mode: "insensitive" },
          },
        },
      },
    ],
  }));
}

export async function getProducts(
  tenantSlug: string,
  filters: CatalogFilters = {}
): Promise<Product[]> {
  try {
    const where: Prisma.ProductWhereInput = {
      tenant: { slug: normalizeTenantSlug(tenantSlug) },
      isActive: true,
      variants: { some: { isActive: true } },
    };

    if (filters.category) {
      where.category = filters.category;
    }

    if (filters.brand) {
      where.brand = { equals: filters.brand, mode: "insensitive" };
    }

    if (filters.tags?.length) {
      where.tags = {
        hasSome: filters.tags.map((tag) => tag.toLowerCase()),
      };
    }

    if (filters.query?.trim()) {
      where.AND = buildSearchWhere(filters.query);
    }

    const products = await prisma.product.findMany({
      where,
      select: productSelect,
      orderBy: [{ createdAt: "asc" }],
      take: normalizeLimit(filters.limit),
    });

    return products.map(mapProductToUiShape);
  } catch (error) {
    console.error("[catalog:getProducts]", error);
    return [];
  }
}

export async function getProductById(
  tenantSlug: string,
  productId: string
): Promise<Product | null> {
  if (!productId) {
    return null;
  }

  try {
    const product = await prisma.product.findFirst({
      where: {
        tenant: { slug: normalizeTenantSlug(tenantSlug) },
        isActive: true,
        variants: { some: { isActive: true } },
        OR: [{ externalRef: productId }, { id: productId }],
      },
      select: productSelect,
    });

    return product ? mapProductToUiShape(product) : null;
  } catch (error) {
    console.error("[catalog:getProductById]", error);
    return null;
  }
}

export async function searchProducts(
  tenantSlug: string,
  query: string
): Promise<Product[]> {
  if (!query.trim()) {
    return [];
  }

  return getProducts(tenantSlug, { query, limit: 50 });
}
