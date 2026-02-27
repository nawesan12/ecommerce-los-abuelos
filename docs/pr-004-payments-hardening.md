# PR #4 - Robustez de pagos MP, concurrencia y reconciliacion

## Objetivo
Endurecer la capa de pagos para produccion con:
- state machine formal y centralizada,
- reconciliacion asincronica con backoff,
- control de concurrencia fuerte,
- tests de idempotencia y carreras webhook/reconciliador.

## Cambios implementados

### 1) State machine centralizada
Archivo principal:
- `src/server/payments/state-machine.ts`

Incluye mapeo central de estados MP y reglas de transicion internas:
- `resolveMercadoPagoStatus(rawStatus)`
- `transitionPaymentStatus(current, resolution)`
- `transitionOrderStatus(current, resolution)`

#### Matriz MP -> interno
| MP status | lifecycle | Payment target | retryable | terminal |
|---|---|---|---|---|
| approved | success | APPROVED | no | si |
| authorized | pending | PENDING | si | no |
| in_process | pending | PENDING | si | no |
| pending | pending | PENDING | si | no |
| rejected | failure | REJECTED | no | si |
| cancelled | cancelled | CANCELLED | no | si |
| refunded | cancelled | CANCELLED | no | si |
| charged_back | cancelled | CANCELLED | no | si |

#### Politica de transiciones de orden
- `PENDING_PAYMENT`:
  - approved -> `PAID`
  - rejected -> `FAILED`
  - cancelled/refunded/charged_back -> `CANCELLED`
  - pending/authorized/in_process -> no-op
- `FAILED`:
  - approved -> `PAID`
  - cancelled/refunded/charged_back -> `CANCELLED`
  - rejected/pending -> no-op
- `PAID`:
  - approved -> no-op
  - cancelled/refunded/charged_back -> `CANCELLED`
  - rejected -> invalida (no-op + log)
- `PREPARING/READY_FOR_DELIVERY/DELIVERED`:
  - approved -> no-op
  - cancelled/refunded/charged_back/rejected -> invalida (no-op + log)
- `CANCELLED`:
  - cualquier evento -> invalida/no-op (terminal)

### 2) Concurrencia fuerte
Archivos:
- `src/server/payments/locking.ts`
- `src/server/payments/sync-service.ts`

Estrategia:
- lock transaccional por clave de pago/orden usando `pg_advisory_xact_lock(hashtext(...))`.
- webhook y reconciliador pasan por el mismo servicio de sincronizacion (`syncMercadoPagoPaymentState`) para evitar divergencia.

Resultado:
- webhooks duplicados/fuera de orden/simultaneos no degradan estado final.

### 3) Reconciliacion asincronica con backoff
Archivos:
- `src/server/payments/reconciliation-jobs.ts`
- `src/server/payments/reconciliation.ts`
- `src/app/api/payments/reconcile/route.ts`

Se agrega cola de reconciliacion por pago:
- estado del job: `PENDING`, `PROCESSING`, `COMPLETED`, `DEAD`
- metadata: `attempt`, `maxAttempts`, `nextRetryAt`, `lastError`, `lastProviderStatus`

Backoff:
- exponencial con jitter:
  - base: 30s
  - `delay = min(30m, 30s * 2^(attempt-1)) + jitter(0..20%)`
- tope por defecto: `maxAttempts = 7`
- al superar tope: job `DEAD`

### 4) Webhook robustecido
Archivo:
- `src/server/payments/webhook-service.ts`

Flujo:
1. dedupe por `PaymentEvent` (unique `tenant+provider+rawEventId`)
2. fetch server-to-server del pago en MP
3. sincronizacion por state machine + lock transaccional
4. actualizacion idempotente de `Payment`/`Order`
5. auditoria en `PaymentEvent`

### 5) Checkout y reconciliacion
Archivo:
- `src/server/checkout/service.ts`

Al crear/intentar checkout con pago pendiente:
- encola `PaymentReconciliationJob` para asegurar seguimiento aunque webhook falle.

## Migracion Prisma
Nueva migracion:
- `prisma/migrations/20260227173640_pr004_payments_hardening/migration.sql`

Incluye:
- enum `ReconciliationStatus`
- tabla `PaymentReconciliationJob`
- unique `(tenantId, paymentId)`
- indices por estado/reintento

## Variables de entorno
Agregar:
- `PAYMENTS_RECONCILE_SECRET` (protege `POST /api/payments/reconcile`)

Relacionadas:
- `MERCADOPAGO_ACCESS_TOKEN`
- `MERCADOPAGO_WEBHOOK_SECRET`
- `NEXT_PUBLIC_SITE_URL`
- `DATABASE_URL`
- `DIRECT_URL`

## Endpoints
- `POST /api/payments/webhook`
- `POST /api/payments/reconcile`
- `POST /api/checkout`
- `GET /api/checkout/orders/[id]`

Alias legacy mantenidos:
- `/api/mercadopago/create-preference`
- `/api/mercadopago/webhook`

## Tests agregados
- `src/server/checkout/checkout-idempotency.test.ts`
- `src/server/payments/webhook-idempotency.test.ts`
- `src/server/payments/state-machine.test.ts`

Cobertura funcional:
- checkout duplicado mismo idempotency key + mismo payload
- checkout mismo key + payload distinto => conflicto
- webhook duplicado
- webhook paralelo (simultaneo)
- carrera webhook/reconciliador (convergencia de estado final)
- mapeo completo de estados MP

## Checklist de validacion
- [x] `npx prisma migrate dev` OK
- [x] `npm test` OK
- [x] `npm run build` OK
- [x] mapping de estados centralizado
- [x] lock transaccional en sincronizacion de pagos
- [x] reconciliacion con retry/backoff y limite
- [x] sin cambios visuales en UI

## Notas tecnicas
- Se mantiene log estructurado sin payload sensible completo.
- Reconciliacion y webhook comparten el mismo core de sincronizacion para consistencia.
- Los cambios de estado fuera de la state machine se tratan como invalid/no-op con warning.
