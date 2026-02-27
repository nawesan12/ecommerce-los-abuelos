# PR #3 - Checkout server-side seguro

## Objetivo
Mover la lógica crítica de checkout al backend para asegurar que precios/totales se calculen en servidor, con idempotencia y webhook confiable.

## Resumen de arquitectura
- `POST /api/checkout`:
  - valida payload con Zod,
  - recalcula precios desde DB,
  - crea `Order` + `OrderItem` + `Payment` en transacción,
  - usa `Idempotency-Key` para evitar duplicados,
  - crea preferencia de Mercado Pago con `external_reference = orderId`.
- `POST /api/payments/webhook`:
  - verifica firma `x-signature` (HMAC SHA256 + secret),
  - registra evento en `PaymentEvent`,
  - evita doble procesamiento (unique `tenant+provider+rawEventId`),
  - sincroniza estado `Payment`/`Order` de forma idempotente.
- `GET /api/checkout/orders/[id]`:
  - devuelve estado mínimo para frontend (order/payment/totales).

## Endpoints

### 1) POST `/api/checkout`
Headers:
- `Content-Type: application/json`
- `Idempotency-Key: <string>` (opcional pero recomendado)

Body:
```json
{
  "customer": {
    "email": "test_user@test.com",
    "name": "Juan",
    "phone": "+54911..."
  },
  "items": [
    { "productId": "7", "variantId": "7-3", "quantity": 1 }
  ],
  "notes": "sin sal"
}
```

Respuesta:
```json
{
  "orderId": "...",
  "status": "pending",
  "totals": { "subtotal": 13000, "total": 13000, "currencyCode": "ARS" },
  "payment": {
    "provider": "mercadopago",
    "status": "pending",
    "preferenceId": "...",
    "paymentReference": null,
    "checkoutUrl": "https://www.mercadopago.com.ar/..."
  },
  "idempotencyReused": false
}
```

### 2) POST `/api/payments/webhook`
- Verifica firma MP:
  - `x-signature: ts=<ts>,v1=<hmac>`
  - `x-request-id: <request-id>`
- Requiere `MERCADOPAGO_WEBHOOK_SECRET`.

Respuesta estándar:
```json
{ "received": true, "duplicate": false }
```

### 3) GET `/api/checkout/orders/[id]`
Respuesta:
```json
{
  "orderId": "...",
  "status": "pending",
  "totals": { "subtotal": 13000, "total": 13000, "currencyCode": "ARS" },
  "payment": {
    "provider": "mercadopago",
    "status": "pending",
    "preferenceId": "...",
    "paymentReference": null
  },
  "createdAt": "...",
  "updatedAt": "..."
}
```

## Modelos y migraciones Prisma
Migración creada:
- `prisma/migrations/20260227154130_pr003_checkout_server_secure/migration.sql`

Cambios:
- `OrderStatus`: agregado `FAILED`.
- `Order`: agregado `failedAt`.
- Nuevo `IdempotencyKey`:
  - unique (`tenantId`, `key`)
  - `requestHash`, `orderId`, `responseStatus`, `responseBody`.
- Nuevo `PaymentEvent`:
  - unique (`tenantId`, `provider`, `rawEventId`)
  - auditoría de payload y estado de procesamiento.

## Decisiones técnicas
1. No se confía en frontend para precio/título/total.
2. Snapshot de precio y labels en `OrderItem` al crear orden.
3. Idempotencia por hash de payload canonical + `Idempotency-Key`.
4. Webhook idempotente por `rawEventId` único.
5. Transiciones de orden controladas por servidor (nunca desde frontend).
6. Alias legacy mantenido:
   - `/api/mercadopago/create-preference` -> usa el nuevo handler de checkout.
   - `/api/mercadopago/webhook` -> usa el nuevo handler seguro.

## Variables de entorno requeridas
- `DATABASE_URL`
- `DIRECT_URL`
- `MERCADOPAGO_ACCESS_TOKEN`
- `MERCADOPAGO_WEBHOOK_SECRET`
- `NEXT_PUBLIC_SITE_URL`

## Cómo testear localmente

1. Prisma
```bash
npx prisma generate
npx prisma migrate dev
```

2. Build
```bash
npm run build
```

3. Caso feliz checkout
```bash
curl -X POST http://localhost:3000/api/checkout \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: test-key-001' \
  -d '{
    "customer": {"email":"test_user@test.com"},
    "items":[{"productId":"7","variantId":"7-3","quantity":1}]
  }'
```

4. Idempotencia (mismo key + mismo payload)
- repetir el mismo curl,
- debe devolver misma orden (`idempotencyReused: true`) y no crear nueva orden.

5. Idempotencia conflicto (mismo key + payload distinto)
- cambiar `quantity` con la misma key,
- debe devolver `409 IDEMPOTENCY_CONFLICT`.

6. Producto inválido/inactivo
- usar `productId` inexistente,
- debe devolver `422 PRODUCT_UNAVAILABLE`.

7. Webhook firma inválida
```bash
curl -X POST 'http://localhost:3000/api/payments/webhook?data.id=abc' \
  -H 'x-request-id: req-001' \
  -H 'x-signature: ts=1700000000,v1=invalid' \
  -H 'Content-Type: application/json' \
  -d '{"type":"test-event"}'
```
- debe devolver `401 invalid signature`.

8. Webhook idempotente (firma válida)
- enviar dos veces el mismo evento firmado,
- primer request: `duplicate=false`, segundo: `duplicate=true`.

## Archivos principales
- `prisma/schema.prisma`
- `prisma/migrations/20260227154130_pr003_checkout_server_secure/migration.sql`
- `src/server/checkout/schema.ts`
- `src/server/checkout/status.ts`
- `src/server/checkout/service.ts`
- `src/server/checkout/http.ts`
- `src/server/payments/mercadopago.ts`
- `src/server/payments/webhook-service.ts`
- `src/server/payments/webhook-http.ts`
- `src/server/rate-limit.ts`
- `src/app/api/checkout/route.ts`
- `src/app/api/checkout/orders/[id]/route.ts`
- `src/app/api/payments/webhook/route.ts`
- `src/app/api/mercadopago/create-preference/route.ts`
- `src/app/api/mercadopago/webhook/route.ts`
- `src/app/carrito/page.tsx`
