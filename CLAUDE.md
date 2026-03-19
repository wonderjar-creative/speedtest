# CLAUDE.md - Speed Test POC

Marketing demo for Denver Headless showing performance difference between traditional WordPress and headless architecture.

## Project Context

**Purpose:** Sales/marketing tool to prove headless value proposition
**Timeline:** 1-2 weeks
**Type:** Internal POC, not client work
**Domain:** speedtest.denverheadless.com
**Pitch:** "Same server. Same content. Same backend. 5x faster. See it live."

## Ethical Stack

We intentionally avoid AWS, Vercel, Google, and Big Tech infrastructure. This is a conscious business decision.

| Service | Provider | Why |
|---------|----------|-----|
| **Hosting** | Hetzner Cloud (CX22, ~€4.50/mo) | German, family-owned, sustainable datacenters |
| **Deployment** | Coolify (self-hosted PaaS) | Open-source Vercel alternative, runs on Hetzner |
| **CDN** | Cloudflare (free tier) | Owns its network, not on AWS/GCP |
| **SSL** | Let's Encrypt | Automated via Coolify |
| **Analytics** | Plausible | Open source, no cookies, not surveillance |
| **Maps** | Mapbox | Not Google Maps |
| **Trad WP** | Same Hetzner WP instance | Monolithic rendering, same server as headless |

**Key insight:** Next.js is just a Node.js app. `next build && next start` behind Caddy on Hetzner is fast, simple, sufficient. Vercel isn't required. Both traditional and headless run on the same Hetzner box — the speed difference is purely architectural, not infrastructure.

## Architecture

Three interfaces sharing one WordPress backend on one server:

1. **Comparison Interface** (speedtest.denverheadless.com)
   - Next.js app with split-screen layout
   - Displays both sites in iframes
   - Shows performance metrics (hardcoded for v1)
   - Page navigation syncs both sides

2. **Traditional WordPress** (slow.speedtest.denverheadless.com)
   - Same WordPress instance on Hetzner, rendered monolithically
   - Elevation Design Studio theme (FSE block theme)
   - Typical plugins (Rank Math, Contact Form 7, Smart Slider 3, WPGraphQL)
   - NOT aggressively optimized — represents typical small business site
   - Same server, same content — only the delivery architecture differs

3. **Headless Frontend** (fast.speedtest.denverheadless.com)
   - Next.js 14+ deployed via Coolify on Hetzner
   - Connects to same WordPress via WPGraphQL
   - Fully optimized (ISR, next/image, standalone Docker output)
   - GraphQL requests over localhost (zero network latency)
   - Same server, same content — only the delivery architecture differs

4. **WordPress Backend** (Hetzner CX22)
   - Serves both traditional theme AND headless API
   - WPGraphQL + registered post meta for structured content
   - Same server as headless frontend
   - Elevation theme renders monolithically for slow.*, WPGraphQL serves fast.*

## Demo Business: Elevation Design Studio

Fictional Denver architecture & interior design firm (typical $10-25k project client).

| Field | Value |
|-------|-------|
| **Industry** | Architecture & interior design |
| **Tagline** | "Creating spaces that inspire since 2010" |
| **Services** | Residential design, commercial spaces, design consultation, renovation & remodeling |
| **Aesthetic** | Warm professional, clean layouts, natural materials, Colorado-rooted |

**Pages:**
- Homepage (hero, client logos, services grid, stats, portfolio preview, about preview, testimonials, CTA)
- About (story, approach, values, team grid, awards/recognition)
- Services (4 service areas with images and details)
- Portfolio (project grid querying the projects CPT)
- Blog (listing + individual posts)
- Contact (form, office info, Mapbox map)

**Custom Post Types:**
- Projects (6 portfolio items with location, type, sq footage, year)
- Team Members (4 staff with position, bio, display order)
- Testimonials (3 client reviews with author name, role, rating)

## Tech Stack

| Component | Stack |
|-----------|-------|
| Comparison | Next.js 16, TypeScript, Tailwind v4 (not yet implemented) |
| Headless | Next.js 15, TypeScript, Tailwind v4, WPGraphQL, graphql-request |
| WordPress | WP 6.7, WPGraphQL, registered post meta (no ACF dependency) |
| Deployment | Docker (standalone output), Coolify, Cloudflare CDN |

## Project Structure

| Path | Purpose |
|------|---------|
| `apps/comparison/` | Split-screen comparison app (speedtest.denverheadless.com) |
| `apps/headless/` | Optimized Next.js frontend (fast.denverheadless.com) |
| `wordpress/` | Docker compose, theme, seed script, content docs |
| `wordpress/theme/` | Elevation Design Studio FSE block theme |
| `wordpress/seed.sh` | Reproducible WP-CLI content seed |
| `scripts/` | Sync utilities (theme tokens, template structure) |

## Commands

```bash
# Docker
make up              # Start all services
make down            # Stop all services
make build           # Build docker images
make logs            # Tail logs

# WordPress
make seed            # Seed WordPress with demo content
make seed-reset      # Delete all seeded content (destructive!)

# Local development
make dev-comparison  # Run comparison app
make dev-headless    # Run headless app (syncs tokens + templates first)
make sync-tokens     # Sync design tokens from theme.json → headless CSS
make sync-templates  # Sync WP template/pattern structure → headless data/
```

## Performance Targets

**Traditional WP (same server, monolithic rendering):**
- Lighthouse: 45-55
- LCP: 3.5-5.0s
- FCP: 1.8-2.5s
- TBT: 600-900ms
- CLS: 0.15-0.25

**Headless (optimized):**
- Lighthouse: 95-100
- LCP: 0.5-0.8s
- FCP: 0.3-0.5s
- TBT: 0-80ms
- CLS: 0-0.02

## Deployment Notes

- Use Next.js standalone output mode for Docker
- Dockerfile: `node:20-alpine`, `npm ci`, `npm run build`, copy `.next/standalone`
- Configure `next.config.ts` with `output: 'standalone'` and remote image patterns
- Coolify handles git deploy, SSL via Let's Encrypt, env vars
