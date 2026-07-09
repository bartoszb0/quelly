# Quelly — Technical Overview

Deeper documentation for technical readers. For the product-level summary, see the [README](../README.md).

- [Repository layout](#repository-layout)
- [Database schema](#database-schema)
- [API endpoints](#api-endpoints)
- [Design decisions](#design-decisions)
- [Frontend architecture](#frontend-architecture)
- [Known limitations / next steps](#known-limitations--next-steps)

---

## Repository layout

Two independent packages, no root `package.json` — each has its own install/build/test:

```
quelly/
├── backend/                  # NestJS 11 REST API + Socket.IO gateway
│   ├── prisma/
│   │   ├── schema.prisma     # source of truth for the data model
│   │   └── migrations/       # checked-in migration history
│   ├── src/
│   │   ├── auth/             # register/login/logout/me, JWT strategy, cookie config
│   │   ├── shops/            # shop CRUD; ShopsService.findOne = the tenancy gate
│   │   ├── menu-items/       # menu CRUD + reorder endpoint
│   │   ├── shifts/           # start/end shift, shift history (paginated)
│   │   ├── orders/           # create + status transitions, number allocation
│   │   ├── analytics/        # aggregated per-shop stats
│   │   ├── public/           # unauthenticated guest endpoints (read-only)
│   │   ├── realtime/         # Socket.IO gateway (rooms + broadcast)
│   │   ├── prisma/           # PrismaService (driver adapter over pg Pool)
│   │   └── common/           # guards, decorators, Prisma exception filter
│   └── docker-compose.yml    # Postgres 16 for local dev (port 5433)
│
└── frontend/                 # React 19 + Vite SPA
    └── src/
        ├── api/              # typed axios wrappers, one file per resource
        ├── components/       # ui/ (shadcn, owned source) + common/ (spinner, errors…)
        ├── constants/        # e.g. dashboard sub-page registry (icons, routes, i18n keys)
        ├── hooks/            # useOrderSocket, useShopIdParam, useReorderMenuItems…
        ├── i18n/             # i18next setup + en/ & pl/ locale JSON per namespace
        ├── pages/
        │   ├── dashboard/    # owner surface: shop, menu, shifts, qr, analytics
        │   ├── guest-shop/   # /s/:shopPublicId — enter order number
        │   └── guest-order/  # /s/:shopPublicId/:orderNumber — live tracking
        ├── schemas/          # Zod schemas shared by forms
        └── types/            # API response types
```

Pages follow a feature-colocation pattern: each route folder owns its `components/` (and hooks where they're feature-specific).

---

## Database schema

Five models (Prisma / PostgreSQL). Ownership flows down from `User`:

```
User ─┬─▶ Shop ─┬─▶ MenuItem            (name, sortOrder)
      │         ├─▶ Shift               (startedAt, endedAt: null = active)
      │         └─▶ Order ──▶ OrderItem (nameSnapshot, quantity, menuItemId?)
```

| Model | Notable fields / rules |
|---|---|
| `User` | `email` unique, bcrypt-hashed `password` |
| `Shop` | `publicId` (random UUID, `@unique`) for all guest-facing access; `id` stays internal. Cascade-deletes children |
| `MenuItem` | `sortOrder Int @default(0)` — display order, rewritten contiguously on reorder |
| `Shift` | `endedAt IS NULL` marks the single active shift per shop (enforced in service, not schema) |
| `Order` | `number` (guest-typed, 1–99, unique among *active* orders per shift — see below), `status` enum `QUEUED→READY→COLLECTED` + `CANCELLED`, `readyAt`/`collectedAt` timestamps feed analytics. `shopId` is denormalized (also reachable via shift) so every query filters tenants uniformly |
| `OrderItem` | `nameSnapshot` copies the menu item name at order time; `menuItemId` is nullable with `onDelete: SetNull` — history survives renames and deletes |

**Why no unique constraint on `(shiftId, number)`:** numbers *recycle* within a shift — a collected order's number can be reissued. An early migration added that constraint; a later one (`remove_unique_numbers_on_orders`) removed it once recycling made it wrong. Uniqueness among *active* orders is enforced by the allocation logic instead.

---

## API endpoints

All owner routes require the JWT cookie (`@UseGuards(JwtGuard)`) and are tenancy-scoped in the service layer. Global rate limit: 100 req/60s per client; auth endpoints additionally 5 req/60s.

### Auth — `/auth`
| Method | Route | Notes |
|---|---|---|
| POST | `/auth/register` | bcrypt hash, sets `access_token` httpOnly cookie |
| POST | `/auth/login` | same cookie; throttled 5/min |
| POST | `/auth/logout` | clears cookie |
| GET | `/auth/me` | session probe used by the SPA's route guard |

### Shops — `/shops`
CRUD: `POST /`, `GET /`, `GET /:id`, `PATCH /:id`, `DELETE /:id` (cascade).

### Menu — `/shops/:shopId/menu-items`
| Method | Route | Notes |
|---|---|---|
| POST | `/` | new item appended (`sortOrder = max + 1`) |
| GET | `/` | ordered by `sortOrder`, `createdAt` tiebreak |
| PATCH | `/reorder` | body `{ ids: string[] }` → `sortOrder = index`, one transaction, all-or-nothing (declared before `:id` so it isn't captured as a param) |
| PATCH / DELETE | `/:id` | rename / delete |

### Shifts — `/shops/:shopId/shifts`
| Method | Route | Notes |
|---|---|---|
| POST | `/start` | 409 if a shift is already active |
| POST | `/end` | transaction: bulk-cancel open orders **and** set `endedAt`; then broadcasts to guests |
| GET | `/active` | current shift or `null` |
| GET | `/?page=n` | **offset** pagination (page/total UI) |
| GET | `/:id?cursor=` | shift detail; orders use **cursor** pagination (infinite scroll) with `meta: { pageSize, total, nextCursor, hasNextPage }` |

### Orders — `/shops/:shopId/orders`
| Method | Route | Notes |
|---|---|---|
| POST | `/` | validates items belong to the shop, snapshots names, allocates number |
| POST | `/:id/ready` | only from `QUEUED` |
| POST | `/:id/collected` | only from `READY` |
| POST | `/:id/cancelled` | rejected once `COLLECTED`/`CANCELLED` |

Every transition broadcasts `queueChange` to the shop's socket room.

### Analytics — `/shops/:shopId/analytics`
Single summary endpoint. One `groupBy` yields all status counts; top sellers, shift count, and items-sold aggregate run alongside via `Promise.all`. Returns counts, completion/cancellation rates, per-shift averages, and top-5 sellers by `nameSnapshot` (excluding cancelled orders).

### Public (no auth) — `/public/shops`
| Method | Route | Notes |
|---|---|---|
| GET | `/:shopPublicId` | shop name + whether a shift is open |
| GET | `/:shopPublicId/orders/:number` | order status + items + `ordersInQueue` (count of lower-numbered QUEUED orders, only while QUEUED). Hand-picked `select` — no internal ids in responses |

### WebSocket
Client emits `joinShop { shopPublicId }` → joins room `shop:<publicId>`. Server emits `queueChange` (no payload) to the room on any status change; clients refetch over HTTP. CORS on both HTTP and WS is locked to `FRONTEND_URL` with credentials.

---

## Design decisions

**Multi-tenancy lives in the service layer, not middleware.** Every service method takes `userId` and scopes its Prisma query; the canonical gate is `ShopsService.findOne(id, userId)` → `findFirst({ where: { id, ownerId } })`, throwing 404 (not 403 — no existence oracle) when it misses. Higher features chain through it (`ShiftsService` → `shopsService.findOne`; `OrdersService` → `shiftsService.getActiveOrThrow`), so an unauthorized request dies before touching feature tables.

**Two identifiers per shop.** Internal `id` for owner routes; random `publicId` for guest URLs and socket rooms. Internal ids never cross the public boundary.

**Payload-less realtime.** The socket event is a bare ping; data always flows through the HTTP layer where auth/shaping already exist. The gateway stays ~20 lines and needs no auth model.

**Snapshot, don't join.** `OrderItem.nameSnapshot` + nullable `menuItemId` keep historical orders truthful after menu edits — the same reasoning that would later apply to a `priceSnapshot` if prices are added.

**Order-number allocation.** Start from `latest.number % 99 + 1`, probe forward past numbers held by active (`QUEUED`/`READY`) orders, 409 when 99 active orders exist. Trade-off: allocation is read-then-write, so two *concurrent* creates in the same shift could theoretically collide — acceptable for a single owner tapping one console; the fix (per-shift advisory lock) was designed but deliberately deferred.

**Transactions where writes must be atomic, `Promise.all` where reads are independent.** `shifts.end` (cancel orders + close shift) and `menu-items.reorder` (N sortOrder updates) are `$transaction`s; paginated list+count reads run concurrently with `Promise.all` — they need no atomicity.

**Both pagination styles, deliberately.** Shift history is offset-paginated (page numbers fit a bounded archive UI); orders within a shift are cursor-paginated (`createdAt+id` compound sort, `take: pageSize + 1` look-ahead) feeding `useInfiniteQuery` on the client.

**Validation at both doors.** `ValidationPipe({ whitelist: true, transform: true })` + class-validator DTOs server-side (unknown fields stripped); Zod + react-hook-form client-side. A global exception filter maps known Prisma errors to proper HTTP codes.

**Auth hardening details.** `JWT_SECRET` missing → boot failure (fail-fast, no default secret). Cookie: `httpOnly`, `secure` + `sameSite: 'none'` in production, `lax` in dev, `maxAge` 24h matching the JWT's `expiresIn: '1d'`.

---

## Frontend architecture

**Server state is TanStack Query; there is no other store.** Thin typed axios wrappers in `src/api/` (base client sets `withCredentials: true`); components never call axios directly. The shared `QueryClient` never retries 4xx (expected 401/409 fail fast) and retries other errors up to twice.

**The query cache *is* the session.** No auth context. `ProtectedRoute` runs the `["me"]` query; 401 redirects to login. Login/register prime `["me"]` via `setQueryData` (no post-login flash), logout does `queryClient.clear()` so nothing leaks across users.

**Optimistic updates with rollback** (menu reorder, `useReorderMenuItems`): `cancelQueries` → snapshot → `setQueryData` (reordered) → mutate; `onError` restores the snapshot; `onSettled` invalidates. The interesting subtlety: cancelling in-flight refetches *first*, so a stale response can't overwrite the optimistic cache.

**Realtime hook** (`useOrderSocket`): connects to `VITE_API_URL`, joins the shop room, and calls a caller-supplied `onChange` (which invalidates the relevant query) on every `queueChange`. Cleanup disconnects on unmount.

**Client-side PDF generation.** The QR flyer feature composes `qrcode` (QR → data URL) with `pdf-lib` (A4 layout, 15 validated color themes) entirely in the browser — no server round-trip, nothing to store.

**i18n:** i18next with per-feature namespaces (`shop`, `menu`, `shifts`, `qr`, `analytics`, …), full EN + PL including Polish plural forms (`_one/_few/_many`), persisted language choice, `document.lang`/title sync.

**Analytics UI:** shadcn/ui chart wrapper over Recharts — an outcomes donut (status colors, completion % as the center label) and a top-sellers horizontal bar chart, plus KPI stat tiles.

---

## Known limitations / next steps

Honest list — these are known and mostly deliberate scope cuts, not oversights:

- **No prices yet.** `MenuItem` has no price field, so analytics are quantity-based; revenue metrics need `price` + a `priceSnapshot` on `OrderItem` (same snapshot pattern as names).
- **Test coverage is thin.** Spec files exist but are largely Nest scaffolding stubs; the service layer (tenancy chain, number allocation, status machine) is the obvious place to invest first.
- **Two low-probability races are documented but deferred:** concurrent order creation in one shift (number collision) and concurrent shift-start (double active shift). Both have known fixes (advisory lock / partial unique index on `endedAt IS NULL`).
- **Recharts ships in the main bundle** (~570 KB gz total); lazy-loading the analytics route would cut the initial load meaningfully.
- **No CI / deployment config yet.** Local dev is fully reproducible (docker-compose Postgres + two `npm run dev`s); pipeline and hosting are the next infrastructure step.
