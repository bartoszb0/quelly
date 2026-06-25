# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Quelly is a queue/order-tracking app for food stalls. A shop owner runs a service **shift**, takes **orders** (each gets a number the guest types), and walks them through a status flow (QUEUED → READY → COLLECTED). Guests watch their order's position live, with no login, via a per-shop public link.

This is a two-package monorepo with **no root `package.json`** — run all commands inside `backend/` or `frontend/`:

- **`backend/`** — NestJS 11 + Prisma 7 + PostgreSQL REST API and Socket.IO gateway. See `backend/CLAUDE.md`.
- **`frontend/`** — React 19 + Vite + TanStack Query SPA. See `frontend/CLAUDE.md`.

## How the two halves connect

- **Auth is a JWT in an httpOnly cookie** (`access_token`). The frontend never reads it; every `axios` call sends it via `withCredentials`, and the backend reads it off the cookie in `JwtStrategy`. The two clocks (`signOptions.expiresIn: '1d'` and cookie `maxAge: 24h`) are kept in sync intentionally.
- **CORS is credential-scoped**: backend `enableCors({ origin: FRONTEND_URL, credentials: true })`; frontend points at the API via `VITE_API_URL`.
- **Realtime queue updates**: when an order's status changes, the backend emits `queueChange` to a Socket.IO room `shop:<publicId>`. Guest pages join that room (`joinShop`) and refetch — there is no payload, the event is just a "something changed, refetch" signal.
- **Two identifiers per shop**: the internal `id` (owner-facing, guarded routes) and a separate unguessable `publicId` (guest links, socket rooms). Never expose `id` on public surfaces.
