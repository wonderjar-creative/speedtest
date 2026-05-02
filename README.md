# Denver Headless Speed Test

Marketing demo proving the performance difference between traditional WordPress and headless architecture — same server, same content, same backend, ~5x faster.

## The three sites

| Site | Domain | Stack |
|------|--------|-------|
| **Comparison UI** | speedtest.denverheadless.com | Next.js 16 split-screen iframe view |
| **Traditional WP** | slow-speedtest.denverheadless.com | WordPress + Elevation theme (FSE), monolithic rendering |
| **Headless** | fast-speedtest.denverheadless.com | Next.js 16 + WPGraphQL, fully optimized |

All three run on **one Hetzner CX22**, deployed via **Coolify**, fronted by **Cloudflare**. The traditional and headless sites share the same WordPress instance — only the delivery architecture differs.

**Demo Business:** Elevation Design Studio (fictional Denver architecture & interior design firm)

## Project structure

```
speedtest/
├── README.md
├── CLAUDE.md
├── CHANGELOG.md
├── Makefile                 # Cross-app commands
├── .nvmrc                   # Pins Node 24 for local dev
├── apps/
│   ├── comparison/          # Split-screen comparison UI
│   └── headless/            # Optimized headless frontend
├── wordpress/               # WP docker-compose, theme, seed
├── docs/
│   ├── DEPLOYMENT.md        # How each site deploys
│   └── PROJECT_BRIEF.md     # Original project brief
└── scripts/                 # Sync utilities (theme tokens, templates)
```

## Quick start

Requires Node 24 (use nvm/fnm to auto-pick from `.nvmrc`).

```bash
# Comparison app
cd apps/comparison && npm install && npm run dev

# Headless app (needs WordPress running first)
make up                                  # Start local WP via docker-compose
make seed                                # Seed WP with demo content
cd apps/headless && npm install && npm run dev
```

See `make help` for the full task list.

## Deployment

Coolify on Hetzner. Each site is an independent resource pointed at a subdirectory of this monorepo. Push to `main` triggers a rebuild of whichever app changed.

See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for per-app build packs, env vars, and failure modes.

## Verifying Docker builds locally

You can mirror Coolify's prod build process on your Mac:

```bash
make docker-build-comparison   # Easy, no env required
make docker-build-headless     # Needs WP env vars (source apps/headless/.env.local first)
make docker-build-apps         # Both
```

## More context

- [`CLAUDE.md`](CLAUDE.md) — full architecture, performance targets, ethical-stack rationale
- [`docs/PROJECT_BRIEF.md`](docs/PROJECT_BRIEF.md) — original brief
- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) — deployment runbook
