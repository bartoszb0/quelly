# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

NestJS 11 API for Quelly. Prisma 7 + PostgreSQL, JWT-cookie auth, Socket.IO for realtime. See the root `CLAUDE.md` for the cross-cutting auth/realtime contract.

## Commands

```bash
npm run start:dev          # watch-mode dev server (default port 3001)
npm run build              # nest build → dist/
npm run start:prod         # node dist/main

npm run lint               # eslint --fix over src/test
npm run format             # prettier --write

npm test                   # all unit specs (*.spec.ts under src/)
npm test -- shops.service  # single file / pattern (jest passes the arg as a path regex)
npm run test:watch
npm run test:e2e           # uses test/jest-e2e.json

npx prisma migrate dev --name <change>   # create + apply a migration in dev
npx prisma generate                       # regenerate the client (see gotcha below)
npx prisma studio
```

Env (`.env`): `DATABASE_URL`, `JWT_SECRET` (**required — app throws on boot if unset**), `FRONTEND_URL` (CORS + socket origin), `PORT` (default 3001).

## Critical gotcha: the Prisma client is generated to a custom path

`schema.prisma` sets `output = "../generated/prisma"`, so the client is **not** `@prisma/client`. Import from the generated path instead:

```ts
import { PrismaClient, Prisma } from '../../generated/prisma/client';
```

`generated/` is build output — after any schema change run `npx prisma generate` or types go stale. `PrismaService` connects through a **driver adapter** (`PrismaPg` over a `pg` Pool), not the default engine.

## Architecture

### Module layout
Feature modules under `src/<feature>/` follow Nest's controller → service → Prisma layering. `PrismaModule` and `AuthModule`'s `JwtModule` are global; everything else is imported explicitly in `app.module.ts`.

### Domain model (`prisma/schema.prisma`)
`User` (owner) → `Shop` → { `MenuItem`, `Shift`, `Order` } → `OrderItem`. Read the inline comments in the schema — they encode real rules:
- **`Shift`** is a service session. Order **numbers are sequential within a shift and unique per shift** (`@@unique([shiftId, number])`), so they reset cleanly each shift and get reused across shifts. New numbers come from `OrdersService.getNextNumber` (max+1 within the active shift).
- **`OrderItem.nameSnapshot`** copies the menu item's name at order time, and `menuItemId` is nullable (`onDelete: SetNull`). A past order stays correct even after the menu item is renamed or deleted — never resolve item names by joining live `MenuItem` for historical orders.
- **`Order.shopId`** is denormalized (also reachable via shift) so the tenant filter is uniform across queries.

### Multi-tenancy is enforced in services, not by middleware
Every owner-facing controller is `@UseGuards(JwtGuard)` and passes `@CurrentUser() user` into the service; **services take `userId` and scope every Prisma query by ownership**. The canonical pattern is `ShopsService.findOne(id, userId)` doing `findFirst({ where: { id, ownerId: userId } })` and throwing `NotFoundException` when missing. Higher layers reuse it: `ShiftsService` calls `shopsService.findOne` to authorize before touching shifts; `OrdersService` calls `shiftsService.getActiveOrThrow`. When adding a resource, follow this chain — there is no global tenancy guard that will catch a missing `userId` filter for you.

### Order status state machine (`OrdersService`)
`QUEUED → READY → COLLECTED`, with `CANCELLED` as the void/undo state. Transitions are validated in the service (`markReady` requires `QUEUED`, `markCollected` requires `READY`, `markCancelled` is rejected once `COLLECTED`/`CANCELLED`). Ending a shift (`ShiftsService.end`) bulk-cancels all still-open (`QUEUED`/`READY`) orders. **Every transition calls `realtimeGateway.notifyQueueChange(shop.publicId)`** — keep that call when adding new status changes or guests won't see updates.

### Public (guest) surface
`src/public/` exposes unauthenticated, read-only endpoints keyed by `shopPublicId` (the shop's `publicId`, not `id`) + order `number`: `GET /public/shops/:shopPublicId` and `GET /public/shops/:shopPublicId/orders/:number`. `PublicOrdersService` resolves the shop's currently-active shift and computes `ordersInQueue` (count of lower-numbered QUEUED orders) only when the order is still QUEUED. Public responses are hand-picked `select`s — keep owner-only fields out.

### Realtime (`RealtimeGateway`)
Socket.IO gateway. Guests `emit('joinShop', { shopPublicId })` to join room `shop:<publicId>`; status changes broadcast a bare `queueChange` to that room. The gateway is injected into `OrdersService` — domain services trigger broadcasts, the gateway only knows about rooms.

### Cross-cutting wiring (`main.ts` + `app.module.ts`)
- Global `ValidationPipe({ transform: true, whitelist: true })` — DTOs with `class-validator` decorators are the validation layer; unknown body fields are stripped.
- Global `PrismaExceptionFilter` maps Prisma error codes to HTTP: `P2002→409`, `P2025→404`, `P2003→400`. Lean on it instead of manually catching unique/FK violations.
- Global `ThrottlerGuard` at 100 req/60s; auth endpoints tighten to 5/60s via `@Throttle`.
- Auth cookie options live in `auth.constants.ts` (`getCookieOptions`): `secure`/`sameSite: 'none'` in production, `lax` in dev.
