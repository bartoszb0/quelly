# Quelly

**Live order tracking for food stalls - guests scan a QR code and watch their order move through the queue in real time, no app install, no login.**

Quelly is a full-stack web app for small food vendors (festival stalls, food trucks, kebab shops). The owner opens a "shift", takes orders, and taps each one through _queued → ready → collected_. Every order gets a short number; the guest types it in (or scans the stall's QR code) and sees a live status page that updates the moment the kitchen does - powered by WebSockets, not refresh-spamming.

**Live demo**: https://quelly.vercel.app/

---

## Why I built this

I wanted one project that goes past CRUD-tutorial territory: real-time updates, multi-tenant data that must never leak between accounts, a public unauthenticated surface next to a protected one, and state that lives in two places (server + socket) without drifting apart. A queue tracker for food stalls forces all of those at once - and it's a product I can actually demo to a non-technical person in thirty seconds.

**What I learned building it:** designing a REST API around ownership checks instead of trusting the client, JWT auth done with httpOnly cookies (not localStorage), Socket.IO rooms, optimistic UI updates with rollback, cursor- vs offset-based pagination (used both, each where it fits), and why you snapshot data instead of joining live tables when history must stay correct.

---

## Features

- **Guests can track their order live** on their phone - scan a QR code, type the order number, watch their place in the queue update in real time.
- **Owners can sign up and log in securely** (bcrypt-hashed passwords, JWT in an httpOnly cookie, rate-limited auth endpoints).
- **Owners run service in "shifts"** - order numbers stay short (1–99), reset each shift, and recycle safely without colliding with active orders.
- **One-tap order console** - build an order from tappable menu items, then advance it through queued / ready / collected, or cancel it.
- **Menu management with reordering** - add, rename, delete and re-arrange items; the list updates instantly (optimistic UI) and rolls back if the server rejects it.
- **Printable QR flyers** - pick from 15 color themes, preview an A4 flyer, download a print-ready PDF generated fully in the browser.
- **Analytics dashboard** - completion-rate donut, top-sellers chart, and per-shift stats built from real order data.
- **Past shift history** with per-shift order lists (infinite scroll).
- **Fully bilingual** - English and Polish, switchable at runtime.
- **Order history stays truthful** - renaming or deleting a menu item never rewrites what a past order said.

---

## Tech stack

| Layer            | Choice                                            | Why                                                                         |
| ---------------- | ------------------------------------------------- | --------------------------------------------------------------------------- |
| **Frontend**     | React 19 + Vite + TypeScript                      | Fast dev loop                                                               |
| **UI**           | Tailwind CSS v4 + shadcn/ui + Recharts            | Owned, editable components instead of a black-box kit; charts for analytics |
| **Server state** | TanStack Query                                    | Caching, retries, and optimistic updates without hand-rolling a store       |
| **Backend**      | NestJS 11 (Node + TypeScript)                     | Module/DI structure keeps 8 feature domains cleanly separated               |
| **Database**     | PostgreSQL + Prisma 7                             | Typed queries end-to-end; migrations checked into the repo                  |
| **Realtime**     | Socket.IO (server + client)                       | Room-per-shop broadcasts push queue changes to guests instantly             |
| **Auth**         | Passport-JWT, httpOnly cookie, bcrypt             | Token never touchable by JS (XSS-safe by construction); throttled login     |
| **Validation**   | class-validator (API) + Zod (forms)               | Every request body validated at the door on both sides                      |
| **i18n**         | i18next                                           | Full EN/PL translation, browser-language detection                          |
| **Deployment**   | Frontend on Vercel, Backend on Render, DB on Neon | Postgres runs via `docker compose` for local dev                            |

---

## Quick start

Prerequisites: Node 20+, Docker (for Postgres).

```bash
git clone <repo-url> && cd quelly

# 1. Database
cd backend
docker compose up -d          # Postgres 16 on localhost:5433

# 2. Backend (terminal 1)
cp .env.example .env          # see below
npm install
npx prisma migrate dev        # create schema
npm run start:dev             # API on http://localhost:3001

# 3. Frontend (terminal 2)
cd ../frontend
cp .env.example .env          # see below
npm install
npm run dev                   # app on http://localhost:5173
```

**backend/.env**

```
DATABASE_URL="postgresql://admin:password@localhost:5433/db?schema=public"
JWT_SECRET="any-long-random-string"        # app refuses to boot without it
FRONTEND_URL="http://localhost:5173"
```

**frontend/.env**

```
VITE_API_URL="http://localhost:3001"
```

Then open `http://localhost:5173`, register, create a shop, start a shift - and open the shop's guest link in a second (incognito) window to see the live tracking.

---

## Architecture overview

A React SPA talks to a NestJS REST API (axios, cookie-credentialed) and to a Socket.IO gateway on the same server. Postgres sits behind Prisma. The app has two distinct surfaces: an authenticated **owner dashboard**, and a **public guest surface** that is keyed by an unguessable `publicId` - internal database ids never appear in guest-facing URLs or sockets. When an order changes status, the API broadcasts a bare "something changed" event to that shop's socket room; guest pages respond by refetching, so the socket never carries data that would need its own auth.

```
 Owner (browser)                    Guest (phone, no login)
   │  REST + cookie                    │  REST (public, read-only)
   ▼                                   ▼
┌─────────────────── NestJS API ───────────────────┐
│  auth · shops · menu · shifts · orders · analytics│
│  Socket.IO: room per shop ──── "queueChange" ─────┼──▶ guests refetch
└───────────────────────┬───────────────────────────┘
                        ▼  Prisma
                    PostgreSQL
```

Full endpoint list, schema, and design decisions: [docs/TECHNICAL_OVERVIEW.md](docs/TECHNICAL_OVERVIEW.md).

---

## Key challenges I solved

**1. Short order numbers that recycle without colliding.**
Guests type the order number by hand, so it has to stay small (1–99) - but a busy shift can exceed 99 orders. Numbers are unique _per shift_ and get reused once an order is collected or cancelled: allocation starts after the latest number and probes forward, skipping any number still attached to an _active_ order, with a clean "shift is full" error at 99 active. Getting this right meant dropping a naive DB unique constraint (a migration in the repo records that lesson) and reasoning about which orders actually block reuse.

**2. Real-time updates that can't leak private data.**
Each shop has two identifiers: the internal `id` (owner routes, ownership-checked on every query) and a random `publicId` (guest links, socket rooms). Status changes broadcast a _payload-less_ `queueChange` to the `shop:<publicId>` room, and clients refetch through the normal HTTP layer. That one design choice means the socket layer needs no auth model at all - it can never send anything sensitive because it never sends anything but a ping.

**3. Optimistic drag-free menu reordering with rollback.**
Reordering menu items updates the UI instantly by rewriting the TanStack Query cache before the request fires - after first cancelling any in-flight refetch that would clobber the optimistic state, snapshotting the previous order, and restoring it if the server rejects the change. The backend applies the new order as one atomic transaction (`sortOrder = array index`), so a bad request can't half-apply. Ending a shift is likewise transactional: cancelling open orders and closing the shift either both happen or neither does.

---

## Contact

**bartoszb2020@gmail.com**
