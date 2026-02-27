# PR #2 - Catálogo desde DB (sin tocar UI)

## Objetivo
Reemplazar la dependencia de `mock-products` por consultas reales a PostgreSQL (Supabase) vía Prisma, manteniendo el mismo shape de datos que consume la UI actual.

## Tenant por defecto
- `slug`: `rafa-petshop`
- Se definió como constante en capa server: `DEFAULT_TENANT_SLUG`.

## Archivos tocados
- `lib/prisma.ts`
- `src/server/catalog.ts`
- `src/app/api/catalog/products/route.ts`
- `src/app/api/catalog/products/[id]/route.ts`
- `src/app/api/catalog/search/route.ts`
- `lib/products.ts`
- `src/app/producto/[id]/page.tsx`
- `src/app/carrito/page.tsx`
- `src/app/layout.tsx`
- `src/app/producto/listados/page.tsx`
- `src/app/pago/success/page.tsx`
- `docs/pr-002-catalog-db.md`

## Decisiones técnicas
1. **Capa server-side dedicada**
- Se creó `src/server/catalog.ts` con:
  - `getProducts(tenantSlug, filters?)`
  - `getProductById(tenantSlug, productId)`
  - `searchProducts(tenantSlug, query)`
- Todas las consultas filtran por tenant y productos/variantes activas.

2. **Compatibilidad total de shape para UI**
- Mapeo DB -> UI:
  - `id` de producto: `externalRef` (fallback `id`)
  - `image`: `imageUrl`
  - `variants[].id`: `externalRef` (fallback `id`)
  - `variants[].weight`: `label`
  - `variants[].price`: `priceInCents / 100`
- Se conserva la estructura esperada por componentes existentes (`ProductCard`, `ProductView`, listados, search dropdown).

3. **Consumo en cliente vía API interna**
- `lib/products.ts` ahora llama a:
  - `GET /api/catalog/products`
  - `GET /api/catalog/products/[id]`
  - `GET /api/catalog/search`
- Manejo de errores con fallback seguro (`[]` o `null`) para no romper UI.

4. **Detalle de producto en server component**
- `src/app/producto/[id]/page.tsx` pasó a usar `src/server/catalog.ts` directamente.
- Evita fetch relativo en runtime server y mantiene render estable.

5. **Remoción de dependencia mock en carrito (recomendados)**
- `src/app/carrito/page.tsx` dejó de usar `mock-products` y carga recomendados desde DB con fallback vacío.

6. **Ajustes mínimos de build (sin impacto visual)**
- Se agregaron boundaries de `Suspense` en páginas/layout que usan `useSearchParams`, para cumplir la validación de Next 16 en build estático.

## Checklist de pruebas
- [ ] Home renderiza productos desde DB.
- [ ] `/producto/listados` funciona con y sin query (`q`).
- [ ] Buscador del header muestra sugerencias reales desde DB.
- [ ] `/producto/[id]` muestra detalle y similares desde DB.
- [ ] `/carrito` muestra recomendados desde DB (sin mocks).
- [ ] Si API de catálogo falla, pantallas no crashean (fallback vacío/null).
- [x] `npm run build` finaliza sin errores.

## Nota
- `src/data/mock-products.ts` se mantiene para seed y respaldo de desarrollo, pero ya no es fuente de verdad para catálogo en UI.
