# CLAUDE.md - Speed Test POC

Marketing demo for Denver Headless showing performance difference between traditional WordPress and headless architecture.

## Project Context

**Purpose:** Sales/marketing tool to prove headless value proposition
**Timeline:** 1-2 weeks
**Type:** Internal POC, not client work
**Domain:** speedtest.denverheadless.com
**Pitch:** "Same content. Same backend. 5x faster. See it live."

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
| **Trad WP Host** | Cheap shared hosting | Intentionally slow for comparison |

**Key insight:** Next.js is just a Node.js app. `next build && next start` behind Caddy on Hetzner is fast, simple, sufficient. Vercel isn't required.

## Architecture

Three separate deployments sharing content from one WordPress backend:

1. **Comparison Interface** (speedtest.denverheadless.com)
   - Next.js app with split-screen layout
   - Displays both sites in iframes
   - Shows performance metrics (hardcoded for v1)
   - Page navigation syncs both sides

2. **Traditional WordPress** (slow.speedtest.denverheadless.com)
   - WordPress on cheap shared hosting (intentionally slow)
   - Standard theme (Astra, GeneratePress, or Kadence)
   - Typical plugins (Yoast, Contact Form 7, caching, slider)
   - NOT optimized - represents typical small business site

3. **Headless Frontend** (fast.speedtest.denverheadless.com)
   - Next.js 14+ deployed via Coolify on Hetzner
   - Connects to same WordPress via WPGraphQL
   - Fully optimized (ISR, next/image, standalone Docker output)
   - GraphQL requests over localhost (zero network latency)

4. **WordPress Backend** (Hetzner CX22)
   - Headless CMS only, no frontend theme
   - WPGraphQL + ACF for structured content
   - Same server as headless frontend

## Demo Business: Peak Performance Consulting

Fictional Denver consulting firm (typical $10-25k project client).

| Field | Value |
|-------|-------|
| **Industry** | Business consulting |
| **Tagline** | "Elevating Business Through Strategic Growth" |
| **Services** | Strategy, leadership coaching, process optimization, team development |
| **Aesthetic** | Professional, modern, navy/blue primary, trust-focused |

**Pages:**
- Homepage (hero, services overview, testimonials, stats, CTA)
- About (story, mission, team members)
- Services (4 service areas with details)
- Blog (listing + individual posts)
- Contact (form, info, Mapbox map)

## Tech Stack

| Component | Stack |
|-----------|-------|
| Comparison | Next.js 14+, TypeScript, Tailwind, shadcn/ui |
| Headless | Next.js 14+, TypeScript, Tailwind, WPGraphQL, Apollo/graphql-request |
| WordPress | WP 6.4+, WPGraphQL, ACF + WPGraphQL for ACF |
| Deployment | Docker (standalone output), Coolify, Cloudflare CDN |

## Key Files

| Path | Purpose |
|------|---------|
| `comparison/` | Split-screen comparison app |
| `headless/` | Optimized Next.js frontend |
| `wordpress/` | WP setup notes, headless theme, content seeds |
| `traditional/` | Theme/plugin notes for slow WP site |

## Commands

```bash
# Comparison interface
cd comparison && pnpm dev

# Headless frontend
cd headless && pnpm dev

# Local WordPress
docker-compose up
```

## Performance Targets

**Traditional WP (intentionally modest):**
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
