# PR #1 - Infra de datos + Prisma + seed inicial

## Alcance
- Base de datos v1 para ecommerce (single-tenant preparada para multi-tenant).
- Modelos: `Tenant`, `User`, `Product`, `ProductVariant`, `Order`, `OrderItem`, `Payment`.
- Enums: `UserRole`, `OrderStatus`, `PaymentStatus`.
- Migración inicial SQL versionada.
- Seed inicial con tenant demo `rafa-petshop` + catálogo de 30 productos.

## Cambios incluidos
1. Prisma schema en `prisma/schema.prisma`:
- relaciones y FKs entre los 7 modelos.
- índices por tenant y estado para consultas operativas.
- claves únicas compuestas para evitar colisiones por tenant.

2. Migración inicial:
- `prisma/migrations/202602260001_init/migration.sql`
- `prisma/migrations/migration_lock.toml`

3. Seed:
- `prisma/seed.js`
- usa `src/data/mock-products.ts` como fuente de catálogo.
- crea/actualiza tenant demo `rafa-petshop`.
- crea/actualiza usuario admin demo.
- crea/actualiza productos y variantes de forma idempotente (upsert por claves de negocio).

4. Scripts npm:
- `npm run prisma:generate`
- `npm run prisma:migrate`
- `npm run prisma:seed`

5. Variables de entorno base:
- `.env.example` con `DATABASE_URL`, `MERCADOPAGO_ACCESS_TOKEN`, `NEXT_PUBLIC_SITE_URL`.

## Notas técnicas
- `priceInCents` en `ProductVariant` y `OrderItem` guarda valores en centavos para evitar errores de punto flotante.
- `OrderItem` persiste snapshots (`titleSnapshot`, `variantLabelSnapshot`, `unitPriceInCents`) para trazabilidad aunque cambie el catálogo.
- `Payment` ya contempla campos necesarios para idempotencia y auditoría de webhook (`providerPaymentId`, `providerPreferenceId`, `rawPayload`).
- Seed basado en claves estables (`tenant+externalRef`) para no depender de IDs autogenerados del frontend.
- Si `prisma generate` corre en un entorno sin acceso a npm, Prisma no puede autoinstalar `@prisma/client`; en ese caso ejecutar luego `npm i @prisma/client@6.19.0`.

## Checklist de pruebas (PR #1)
- [ ] `DATABASE_URL` configurado a PostgreSQL (Supabase o local).
- [ ] `npm run prisma:generate` ejecuta sin errores.
- [ ] `npm run prisma:migrate` crea/aplica migración sin errores.
- [ ] `npm run prisma:seed` inserta tenant + catálogo sin errores.
- [ ] Verificar en DB:
  - [ ] Existe tenant `slug = rafa-petshop`.
  - [ ] Existen 30 productos para ese tenant.
  - [ ] Existen variantes asociadas y con precio en centavos.
- [ ] Re-ejecutar seed y validar idempotencia (sin duplicados).
