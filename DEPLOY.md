# Deploying to Coolify

This app deploys as **two Coolify services** built from this same repo:

- **`server`** — Bun + tRPC (WebSocket) API, built from [`apps/server/Dockerfile`](apps/server/Dockerfile). Runs DB
  migrations on boot and needs a headless Chromium (bundled in the image) for the store-search /
  import-by-URL scraping features.
- **`client`** — the Vite SPA, built from [`apps/client/Dockerfile`](apps/client/Dockerfile) and served as static
  files by nginx (with SPA fallback so client-side routes don't 404 on refresh).

Both Dockerfiles use `COPY . .`, so **the build context for each service must be the repo root**, not
the `apps/*` subfolder — Coolify's "Dockerfile" build pack lets you point at a Dockerfile while keeping
the base directory at `/`.

You also need a **Postgres database** reachable from the server service — either a separate Coolify
Postgres resource, or your own instance.

---

## 0. Prerequisites

- A Coolify project with a server that can pull this Git repo.
- A Postgres 17 instance (Coolify → **+ New Resource → Databases → PostgreSQL** is the easiest route).
- Two domains/subdomains pointed at Coolify, e.g. `app.example.com` (client) and `api.example.com`
  (server) — the server needs to be reachable over WebSocket (`wss://`), so it must sit behind a proxy
  that supports WS upgrades (Coolify's built-in Traefik/Caddy does this automatically).

---

## 1. Database

1. Coolify → **+ New Resource → Databases → PostgreSQL**. Note the resulting **host, port, user,
   password, and database name** — you'll paste these into the server service's env vars below.
2. No manual migration step is needed: the server runs `drizzle` migrations automatically on startup
   (see `loadDb({ runMigrations: true, ... })` in `apps/server/src/index.ts`).

---

## 2. Server service

**+ New Resource → Application → Docker Build (Dockerfile)**, pointing at this Git repo.

| Setting | Value |
|---|---|
| Build Pack | Dockerfile |
| Dockerfile location | `apps/server/Dockerfile` |
| Base directory / build context | `/` (repo root — required, see above) |
| Port | `4000` (must match the `PORT` env var below) |
| Domain | e.g. `api.example.com`, HTTPS enabled |

### Environment variables

Required — the server throws on boot without these:

| Variable | Notes |
|---|---|
| `PORT` | `4000` (or whatever you set as the exposed port) |
| `CLIENT_URL` | The **client's** public URL, e.g. `https://app.example.com`. Used for CORS-origin checks and links in emails. |
| `POSTGRES_HOST` | From step 1 |
| `POSTGRES_PORT` | From step 1 (usually `5432`) |
| `POSTGRES_DB` | From step 1 |
| `POSTGRES_USER` | From step 1 |
| `POSTGRES_PASSWORD` | From step 1 — mark as a Coolify **secret** |
| `JWT_SECRET` | A long random string (`openssl rand -base64 48`). Mark as a **secret**. Rotating this logs everyone out. |

Recommended:

| Variable | Notes |
|---|---|
| `NODE_ENV` | `production` — without it, a missing email config (below) fails *silently* (logs the reset link server-side) instead of throwing loudly. |

Optional — only needed if you use the corresponding feature:

| Variable | Feature |
|---|---|
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | "Login with Google". Configure the OAuth redirect URI in Google Cloud Console as `https://api.example.com/auth/google/callback`. |
| `RESEND_API_KEY` / `EMAIL_FROM` | Password-reset emails. Without these (and with `NODE_ENV=production`), the *forgot password* flow throws instead of silently no-op'ing. |

Use `apps/server/.env.example` as the reference list.

### Notes

- The image installs Chromium + OS deps at build time (`playwright install --with-deps chromium`), so
  the build takes longer and the image is larger (~1GB+) than a typical Bun API image — this is
  expected and required for the scraping features to work.
- No separate migration step or command is needed — it runs automatically on every boot.
- Healthcheck: the app doesn't expose a dedicated `/health` route; a TCP check on the port, or an HTTP
  check on `/trpc` (expect a non-5xx response), both work.

---

## 3. Client service

**+ New Resource → Application → Docker Build (Dockerfile)**, same repo.

| Setting | Value |
|---|---|
| Build Pack | Dockerfile |
| Dockerfile location | `apps/client/Dockerfile` |
| Base directory / build context | `/` (repo root) |
| Port | `80` |
| Domain | e.g. `app.example.com`, HTTPS enabled |

### Build argument (required)

The backend URL is **baked into the JS bundle at build time** — there is no runtime env var for this.
In Coolify, set it under **Build Arguments**:

| Build arg | Value |
|---|---|
| `VITE_API_URL` | The **server's** public URL, e.g. `https://api.example.com` (the client derives its `wss://` WebSocket URL from this — see `apps/client/src/lib/trpc.ts`) |

If you change `VITE_API_URL` later, you must **rebuild** the client (redeploy isn't enough — it's not
read at runtime).

### Notes

- nginx serves the static build with SPA fallback (`try_files ... /index.html`), so client-side routes
  (e.g. `/catalog`) work on direct load and refresh, not just in-app navigation.
- The app is a PWA (`vite-plugin-pwa`); no extra Coolify config needed for that, but note the manifest
  name/branding lives in `apps/client/vite.config.ts` if you rename the app.

---

## 4. Deploy order & verification

1. Deploy the **database**, then the **server** (it needs the DB reachable to boot — migrations run
   automatically). Watch the server logs for `Server started on port <PORT>`.
2. Deploy the **client**, passing `VITE_API_URL` as a build arg pointing at the server's public domain.
3. Open the client URL:
   - Register/login should work end-to-end over WebSocket (check the browser's Network tab for a
     `wss://` connection to `/trpc` succeeding).
   - Refresh a deep route (e.g. `/catalog`) — should load, not 404.
   - Try a store search in the catalog "Add product" flow — this exercises the Chromium scraping path;
     if it errors, check the server logs for a Playwright launch failure.

## 5. Redeploy / updates

- **Server**: redeploying rebuilds and restarts the container; migrations reapply automatically
  (Drizzle skips already-applied ones).
- **Client**: redeploying **without changing `VITE_API_URL`** is safe and just rebuilds the static
  bundle. If the server's domain ever changes, update the build arg and redeploy the client.
