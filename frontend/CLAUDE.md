# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

React 19 + Vite SPA for Quelly. TanStack Query for server state, react-router-dom v7, react-hook-form + Zod, shadcn/ui + Tailwind v4, Socket.IO client. See the root `CLAUDE.md` for the cross-cutting auth/realtime contract.

## Commands

```bash
npm run dev       # vite dev server
npm run build     # tsc -b && vite build  (type errors fail the build)
npm run lint      # eslint
npm run preview

# typecheck without building:
npx tsc --noEmit -p tsconfig.app.json
```

Env (`.env`): `VITE_API_URL` — base URL of the backend (also used for the Socket.IO connection).

Path alias: `@/` → `src/` (configured in both `vite.config.ts` and tsconfig).

## UI components

shadcn/ui, `radix-nova` style (see `components.json`), Tailwind v4 (`@tailwindcss/vite`, config-less — theme lives in `src/index.css`). Add components with `npx shadcn@latest add <name>`; they land in `src/components/ui/` and are **owned, editable source** — edit them directly. Use the `cn()` helper from `@/lib/utils` for conditional classes. Icons: `lucide-react`. Toasts: `sonner` (`<Toaster>` is mounted in `main.tsx`).

## Architecture

### Two surfaces, one app (`App.tsx`)
- **Owner dashboard** — `/dashboard`, wrapped in `<ProtectedRoute>`. Requires auth.
- **Guest pages** — `/s/:shopPublicId` and `/s/:shopPublicId/:orderNumber`. No auth; identified by the shop's `publicId` + order number. These poll order state and live-update over a socket.
- Plus `/`, `/login`, `/register`, and a `*` not-found.

### Server state is TanStack Query; there is no other store
All remote data flows through `useQuery`/`queryClient`. The API layer is thin typed `axios` wrappers in `src/api/` (`client.ts` = the configured instance with `baseURL: VITE_API_URL` and `withCredentials: true`; `auth.ts`, `public.ts` = endpoint functions returning typed promises). Components call those functions from query/mutation functions — don't call `axios` directly in components.

The shared `QueryClient` (`main.tsx`) has a deliberate retry policy: **never retry 4xx** (any `AxiosError` with status < 500), retry others up to twice. So an expected 401/409 fails fast.

### Auth flow — the cache *is* the session state
There is no auth context/provider. `ProtectedRoute` runs the `["me"]` query (`getMe()` → `GET /auth/me`); `isPending` → spinner, `isError` (401) → `<Navigate to="/login">`, success → render. The cookie itself is the source of truth (set/cleared server-side, httpOnly).

Keeping the UI and that cookie in sync is manual and load-bearing:
- **On login/register success**, prime the cache so the dashboard renders with no flash and no extra request: `queryClient.setQueryData(["me"], user)`. This works because `signIn`/`signUp` and `getMe` all return the same `Me` shape — `setQueryData` also clears any cached 401 from a prior unauthenticated visit, so the post-login redirect doesn't bounce.
- **On logout**, `queryClient.clear()` (wipe everything, not just `["me"]`) before navigating, so no stale authed data lingers across users.

When adding mutations that change auth state, update the `["me"]` cache the same way.

### API error handling — `toastApiError` (`src/lib/toastApiError.ts`)
Standard catch-block handler. It owns messages for statuses whose meaning is the same everywhere (400/403/404/429/500 + network errors) and a generic fallback that also `console.error`s the *unexpected* cases only. Pass an override map for **context-specific** statuses — typically 401 and 409, whose copy depends on the endpoint:

```ts
catch (e) { toastApiError(e, { 401: "Invalid email or password" }); }   // login
catch (e) { toastApiError(e, { 409: "That email is already registered" }); } // register
```

Rule of thumb: if you can word the message without knowing which endpoint failed, it belongs in the helper's defaults; otherwise pass it per call.

### Forms — react-hook-form + Zod
Zod schemas in `src/schemas/` are the single source of validation; field-level errors render inline under inputs, transient/server errors go to toasts (not inline). Wire with `useForm({ resolver: zodResolver(schema) })` and spread `{...register("field")}` onto the shadcn `Input` (works because React 19 forwards `ref` through the prop spread). The submit `<Button>` can live outside its `<form>` (e.g. in a `CardFooter`) by linking them with matching `form="<id>"` / `<form id="<id>">`.

### Realtime (`src/hooks/useOrderSocket.ts`)
Guest order page opens a Socket.IO connection, emits `joinShop` for the shop's room, and on the bare `queueChange` event invalidates the relevant query to refetch. The event carries no data — it's a refetch trigger. Keep the `onChange` callback referentially stable (or stash it in a ref) so the effect doesn't reconnect the socket on every render.
