# Deployment

How the three speedtest sites deploy to Hetzner via Coolify.

## Overview

All three sites share **one Hetzner CX22** (~€4.50/mo) running **Coolify** as a self-hosted PaaS. Cloudflare sits in front for CDN + DNS. Each site is an independent Coolify resource pointed at a subdirectory of this monorepo.

```
                  ┌──────────────────────────┐
                  │  Cloudflare (CDN/DNS/SSL)│
                  └──────────────┬───────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
        ▼                        ▼                        ▼
speedtest.*              fast.speedtest.*         slow.speedtest.*
(comparison)             (headless)               (traditional WP)
        │                        │                        │
        └────────────────────────┼────────────────────────┘
                                 │
                       ┌─────────▼──────────┐
                       │  Hetzner CX22      │
                       │  + Coolify         │
                       │  + WordPress       │
                       └────────────────────┘
```

## Domains → Coolify Resources

| Domain | App | Coolify base directory | Build pack |
|---|---|---|---|
| `speedtest.denverheadless.com` | Comparison | `apps/comparison/` | Dockerfile |
| `fast-speedtest.denverheadless.com` | Headless | `apps/headless/` | Dockerfile |
| `slow-speedtest.denverheadless.com` | Traditional WP | `wordpress/` | Docker Compose |

## Trigger model

- **Push to `main`** → Coolify webhook fires → rebuild + redeploy.
- Each app is configured with its own webhook + base directory, so changes to `apps/headless/` only rebuild headless, not comparison.
- **WordPress** is built once and stays running — content lives in MariaDB, persisted to a Hetzner volume.

## App-by-app deployment details

### Comparison (`speedtest.denverheadless.com`)

| Setting | Value |
|---|---|
| Coolify base dir | `apps/comparison/` |
| Build pack | Dockerfile |
| Dockerfile | `apps/comparison/Dockerfile` |
| Port | 3000 |
| Build-time env | none |
| Runtime env | none required |
| Build duration | ~1-2 min |

Simple Next.js app. No GraphQL codegen, no auth, no network calls at build time. Builds identically anywhere.

### Headless (`fast-speedtest.denverheadless.com`)

| Setting | Value |
|---|---|
| Coolify base dir | `apps/headless/` |
| Build pack | Dockerfile |
| Dockerfile | `apps/headless/Dockerfile` |
| Port | 3000 |
| Build duration | ~3-5 min |

**Build-time env (set in Coolify UI as build args):**

| Var | Production value | Notes |
|---|---|---|
| `NEXT_PUBLIC_BASE_URL` | `https://fast-speedtest.denverheadless.com` | The headless site's own canonical URL |
| `NEXT_PUBLIC_WORDPRESS_API_URL` | `https://slow-speedtest.denverheadless.com` | Used in 7 places for GraphQL, REST, preview, RankMath, navigation |
| `NEXT_PUBLIC_WORDPRESS_API_HOSTNAME` | (currently `localhost`) | **Dead code** — declared in Dockerfile but no source reads it. Safe to remove. |
| `HEADLESS_SECRET` | (secret) | Shared secret for ISR revalidation webhooks |
| `WP_USER` | (WP app username) | Application Password user for codegen |
| `WP_APP_PASS` | (secret) | Application Password for codegen |
| `WP_THEME` | `elevation-theme` | Tells codegen which theme's data to pull |
| `TEMPLATE_PART_REVALIDATE` | `300` | Cache TTL for template parts (seconds) |

**Why so many?** `npm run build` runs GraphQL codegen which authenticates to WordPress and downloads the schema. All build args must be set or codegen fails.

**WordPress must be accessible during build.** Coolify's build runs on the Hetzner box; the API URL above goes Cloudflare → Hetzner → WP. Works, but optimization opportunity: since headless and WP run on the same box, a Docker network or `localhost` URL would skip the round trip. Not urgent.

### Traditional WordPress (`slow-speedtest.denverheadless.com`)

| Setting | Value |
|---|---|
| Coolify base dir | `wordpress/` |
| Build pack | Docker Compose |
| Compose file | `wordpress/docker-compose.yml` |
| Services | `wordpress` (php-fpm + apache), `mariadb`, `wpcli` |

Serves both the traditional/monolithic frontend AND the WPGraphQL API consumed by headless. `slow.*` URLs render via the Elevation theme's PHP templates; the `/graphql` endpoint serves the headless app.

Persistent volumes:
- MariaDB data (so the seed survives container rebuilds)
- WP uploads

Update the seed by running `make seed` locally → `make seed-dump` → commit `wordpress/seed-dump.sql` → push → run `make seed-import` against prod.

## Verifying builds locally

You can mirror Coolify's build process on your Mac to catch lockfile or build issues before pushing.

```bash
make docker-build-comparison   # Easy — no env needed
make docker-build-headless     # Source apps/headless/.env.local first, see Makefile
make docker-build-apps         # Both
```

**Caveats:**
- Builds are arm64 on Apple Silicon, not amd64 like Hetzner. They run fine locally but aren't deployable to prod as-is. (Add `--platform linux/amd64` to the docker build commands if you need a deployable image — slower due to emulation.)
- Headless needs WP accessible. Run `make up` first to start the local WP instance, or point env vars at production.
- Caching is local — a successful build on your Mac doesn't speed up Coolify's next build.

To run a local image afterwards:
```bash
docker run -p 3000:3000 comparison-local
docker run -p 3000:3000 headless-local
```

## DNS

Cloudflare manages DNS for `denverheadless.com`. Three A records (or CNAMEs to a Hetzner address) point at the CX22's public IP. Cloudflare proxies, terminates SSL with its own cert, and forwards to Coolify's reverse proxy on port 80/443. Coolify routes by hostname to the correct container.

## Failure modes & where to look

| Symptom | Likely cause | Where to check |
|---|---|---|
| Coolify build fails on `npm ci` | `package-lock.json` out of sync with `package.json` | Run `npm install` locally, commit lockfile |
| Headless build fails during codegen | WP not reachable, or WP_USER/WP_APP_PASS wrong | Coolify env vars; WP container status |
| Container builds but won't start | `next.config.ts` missing `output: 'standalone'` | Check the file |
| Site loads but is slow/broken | Cloudflare cache | Purge in Cloudflare dashboard |
| WP changes don't show on `fast.*` | Headless ISR cache | Hit `/api/revalidate` with `HEADLESS_SECRET` |

## Future optimizations

### Skip the Cloudflare round-trip on internal WP fetches

Today, headless's `NEXT_PUBLIC_WORDPRESS_API_URL` is `https://slow-speedtest.denverheadless.com`. Every server-side fetch from headless to WP traces:

```
[headless container on Hetzner] → Cloudflare → [WP container on Hetzner]
```

Both containers are on the same Hetzner box. The round-trip adds ~30-80ms latency per request, plus Cloudflare egress. Affects: build-time codegen, ISR refreshes, server-side renders on cache miss. Doesn't affect users hitting pre-rendered HTML (the common case).

**Why we haven't done this yet:**
- Latency is small; users mostly don't pay it (most pages are pre-rendered/ISR).
- The marketing demo's "fast vs slow" gap is huge regardless — this won't change which side wins.
- Implementing it correctly requires Coolify network configuration we haven't tackled.

**Why `localhost:8080` won't work** (the obvious-looking solution):
- `localhost` *inside* the headless container = the container itself, not Hetzner's localhost.
- WordPress in production isn't published on host port 8080 — Coolify uses Traefik to route by hostname; the host-port mapping only exists in local `docker-compose.override.yml`.

**Real options when we revisit:**

| Option | Approach | Tradeoffs |
|---|---|---|
| Shared Docker network | Put headless + WP in the same Coolify project; reference WP by container name (`http://wordpress` or whatever Coolify names it) | Cleanest. Coolify-native. Requires UI config + identifying the right hostname. |
| `host.docker.internal` | Add `--add-host=host.docker.internal:host-gateway` to headless; expose WP on a host port | Works, but couples to host-port exposure. |

The build step also needs WP reachable, so whichever option we pick has to work at build time too — which means WP must be running on the same network *before* a headless build kicks off.

Reference: [Coolify docs on connecting resources](https://coolify.io/docs/).
