#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const TENANT = {
  id: "tenant_rafa_petshop",
  slug: "rafa-petshop",
  name: "Rafa Petshop",
};

const ADMIN_USER = {
  id: "user_admin_rafa_petshop",
  email: "admin@rafa-petshop.local",
  fullName: "Admin Rafa Petshop",
};

function toSqlString(value) {
  return `'${String(value).replace(/'/g, "''")}'`;
}

function toSqlTextArray(values) {
  if (!Array.isArray(values) || values.length === 0) {
    return "ARRAY[]::TEXT[]";
  }

  return `ARRAY[${values.map(toSqlString).join(", ")}]::TEXT[]`;
}

function slugify(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function toStableId(prefix, source) {
  const normalized = String(source)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return `${prefix}_${normalized}`;
}

function loadMockProducts() {
  const mockPath = path.join(process.cwd(), "src", "data", "mock-products.ts");
  const source = fs.readFileSync(mockPath, "utf8");
  const match = source.match(/export\s+const\s+mockProducts\s*=\s*(\[[\s\S]*\])\s*;?/);

  if (!match) {
    throw new Error("No se pudo leer mockProducts desde src/data/mock-products.ts");
  }

  const parsed = Function(`"use strict"; return (${match[1]});`)();

  if (!Array.isArray(parsed)) {
    throw new Error("mockProducts no es un array válido");
  }

  return parsed;
}

function buildSql(products) {
  const statements = [];

  statements.push("BEGIN;");

  statements.push(`
INSERT INTO "Tenant" ("id", "name", "slug", "currencyCode", "timezone", "isActive", "updatedAt")
VALUES (${toSqlString(TENANT.id)}, ${toSqlString(TENANT.name)}, ${toSqlString(TENANT.slug)}, 'ARS', 'America/Argentina/Buenos_Aires', TRUE, CURRENT_TIMESTAMP)
ON CONFLICT ("slug") DO UPDATE
SET "id" = EXCLUDED."id",
    "name" = EXCLUDED."name",
    "currencyCode" = EXCLUDED."currencyCode",
    "timezone" = EXCLUDED."timezone",
    "isActive" = EXCLUDED."isActive",
    "updatedAt" = CURRENT_TIMESTAMP;
`.trim());

  statements.push(`
INSERT INTO "User" ("id", "tenantId", "email", "fullName", "role", "updatedAt")
VALUES (
  ${toSqlString(ADMIN_USER.id)},
  ${toSqlString(TENANT.id)},
  ${toSqlString(ADMIN_USER.email)},
  ${toSqlString(ADMIN_USER.fullName)},
  'ADMIN',
  CURRENT_TIMESTAMP
)
ON CONFLICT ("tenantId", "email") DO UPDATE
SET "id" = EXCLUDED."id",
    "fullName" = EXCLUDED."fullName",
    "role" = EXCLUDED."role",
    "updatedAt" = CURRENT_TIMESTAMP;
`.trim());

  for (const product of products) {
    const productId = toStableId("product", product.id);
    const productSlug = slugify(product.title);
    const productCategory = product.category ? toSqlString(product.category) : "NULL";

    statements.push(`
INSERT INTO "Product" (
  "id",
  "tenantId",
  "externalRef",
  "slug",
  "title",
  "description",
  "brand",
  "imageUrl",
  "category",
  "tags",
  "isActive",
  "updatedAt"
)
VALUES (
  ${toSqlString(productId)},
  ${toSqlString(TENANT.id)},
  ${toSqlString(product.id)},
  ${toSqlString(productSlug)},
  ${toSqlString(product.title)},
  ${toSqlString(product.description)},
  ${toSqlString(product.brand)},
  ${toSqlString(product.image)},
  ${productCategory},
  ${toSqlTextArray(product.tags)},
  TRUE,
  CURRENT_TIMESTAMP
)
ON CONFLICT ("tenantId", "externalRef") DO UPDATE
SET "id" = EXCLUDED."id",
    "slug" = EXCLUDED."slug",
    "title" = EXCLUDED."title",
    "description" = EXCLUDED."description",
    "brand" = EXCLUDED."brand",
    "imageUrl" = EXCLUDED."imageUrl",
    "category" = EXCLUDED."category",
    "tags" = EXCLUDED."tags",
    "isActive" = EXCLUDED."isActive",
    "updatedAt" = CURRENT_TIMESTAMP;
`.trim());

    for (const variant of product.variants) {
      const variantId = toStableId("variant", variant.id);
      const sku = toStableId("sku", variant.id);
      const priceInCents = Number(variant.price) * 100;

      statements.push(`
INSERT INTO "ProductVariant" (
  "id",
  "productId",
  "externalRef",
  "sku",
  "label",
  "priceInCents",
  "stock",
  "isActive",
  "updatedAt"
)
VALUES (
  ${toSqlString(variantId)},
  ${toSqlString(productId)},
  ${toSqlString(variant.id)},
  ${toSqlString(sku)},
  ${toSqlString(variant.weight)},
  ${priceInCents},
  0,
  TRUE,
  CURRENT_TIMESTAMP
)
ON CONFLICT ("productId", "externalRef") DO UPDATE
SET "id" = EXCLUDED."id",
    "sku" = EXCLUDED."sku",
    "label" = EXCLUDED."label",
    "priceInCents" = EXCLUDED."priceInCents",
    "stock" = EXCLUDED."stock",
    "isActive" = EXCLUDED."isActive",
    "updatedAt" = CURRENT_TIMESTAMP;
`.trim());
    }
  }

  statements.push("COMMIT;");
  return statements.join("\n\n");
}

function run() {
  if (!process.env.DATABASE_URL) {
    throw new Error("Falta DATABASE_URL para ejecutar el seed");
  }

  const products = loadMockProducts();
  const sql = buildSql(products);

  const npxCommand = process.platform === "win32" ? "npx.cmd" : "npx";

  const result = spawnSync(
    npxCommand,
    ["prisma", "db", "execute", "--stdin", "--schema", "prisma/schema.prisma"],
    {
      input: sql,
      stdio: ["pipe", "inherit", "inherit"],
      env: process.env,
    }
  );

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    process.exit(result.status || 1);
  }

  const variantsCount = products.reduce((sum, product) => sum + product.variants.length, 0);
  console.log(`Seed OK: tenant=${TENANT.slug}, products=${products.length}, variants=${variantsCount}`);
}

run();
