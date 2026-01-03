# CLAUDE.md - Speed Test POC

Marketing demo for Denver Headless showing performance difference between traditional WordPress and headless architecture.

## Project Context

**Purpose:** Sales/marketing tool to prove headless value proposition
**Timeline:** 1-2 weeks
**Type:** Internal POC, not client work

## Architecture

Three separate deployments:

1. **Comparison Interface** (speedtest.denverheadless.com)
   - Next.js app with split-screen layout
   - Displays both sites in iframes
   - Shows performance metrics
   - Page navigation syncs both sides

2. **Traditional WordPress** (slow.speedtest.denverheadless.com)
   - WordPress on AWS Lightsail nano ($5/mo)
   - Standard theme (Astra or GeneratePress)
   - Typical plugins (Yoast, Contact Form 7, caching)
   - NOT optimized - represents typical small business site

3. **Headless Frontend** (fast.speedtest.denverheadless.com)
   - Next.js 14+ on Vercel
   - Connects to same WordPress via WPGraphQL
   - Fully optimized (ISR, next/image, etc.)
   - Shows what's possible with modern architecture

## Demo Business: Elevation Design Studio

Fake architecture & interior design firm for demo content.

**Pages:**
- Homepage (hero, services, portfolio preview, testimonials)
- About (story, team, values)
- Services (residential, commercial, consultation)
- Portfolio (project gallery)
- Contact (form, info, map)

## Tech Stack

| Component | Stack |
|-----------|-------|
| Comparison | Next.js 14, TypeScript, Tailwind |
| Headless | Next.js 14, TypeScript, Tailwind, WPGraphQL |
| WordPress | WP 6.4+, Astra theme, WPGraphQL plugin |

## Key Files

| Path | Purpose |
|------|---------|
| `comparison/` | Split-screen comparison app |
| `frontend/` | Optimized Next.js frontend |
| `wordpress/` | WP config notes, theme |

## Commands

```bash
# Comparison interface
cd comparison && pnpm dev

# Frontend
cd frontend && pnpm dev
```

## Performance Targets

**Traditional WP (intentionally modest):**
- Lighthouse: 45-60
- LCP: 3.5-5.0s
- FCP: 1.8-2.5s

**Headless (optimized):**
- Lighthouse: 95-100
- LCP: 0.6-1.0s
- FCP: 0.3-0.5s
