# Performance Backlog

Running list of performance levers for the headless side (`fast-speedtest.denverheadless.com`). The slow side is intentionally not optimized — it represents a typical small-business WordPress site and the demo's value depends on the gap.

Lighthouse mobile is the canonical measurement; desktop runs to ~95-100 already.

## Current metrics

Stable readings on `fast-speedtest.*` mobile across multiple consecutive runs (see `apps/comparison/public/metrics.json` for live values):

| Metric | Last | Target |
|---|---|---|
| Performance | 93 | 95-100 |
| LCP | ~2990ms | 500-800ms |
| FCP | ~1400ms | 300-500ms |
| TBT | ~40ms | 0-80ms |
| CLS | 0 | 0-0.02 |
| SI | ~2900ms | — |

Slow side mobile, for comparison: ~LCP 4850-5800ms, performance ~76-80. Architectural gap is consistently ~1.6-2× faster on fast.

## Done

- **Editor-controlled LCP priority on image blocks.** `priority` attribute on `core/cover` / `core/image` / `core/post-featured-image`, registered server-side via `BlockExtensionsFeature.php` and editor-side via `block-extensions.js`. Pre-flagged on home / about / contact covers and single post / single project featured-images. Headless `Cover.tsx`, `Image.tsx`, `PostFeaturedImage.tsx` honor it. Biggest single LCP win — ~1.3s drop (~4400ms → ~3100ms).

- **Local mirror for `hero.jpg`.** Theme asset shipped at `apps/headless/public/hero.jpg`; `Cover.tsx` rewrites the slow-served URL to `/hero.jpg` so `next/image` reads from disk instead of a public-DNS round-trip. Sync via `make sync-assets`. Modest impact in isolation; closes the cross-server fetch on cache miss.

- **Hero source shrink** to 1600×900 / q=70 (216KB from 422KB). Reduced cold-transcode time and source decode cost, didn't directly change served-variant size since output is bounded by output dimensions + quality.

- **`next/image` quality dropped to 70 on priority-flagged images.** Cover.tsx, Image.tsx, PostFeaturedImage.tsx pass `quality={70}` when `attributes.priority === true`. Saved ~10-15% on served variant size, ~200ms LCP.
  - **Footgun discovered:** Next.js 16 silently ignores `quality` values not allow-listed in `next.config.ts`'s `images.qualities`. Falls back to default 75. Required `qualities: [70, 75]` to actually apply.

- **Typography parity (theme.json clamps).** `slow-speedtest.*` and `fast-speedtest.*` now read identical `clamp()` font-size values from `theme.json` — set `fluid: false` and baked explicit clamps into each preset (matching the `spacingSizes` pattern). Eliminated visual drift on hero H1, body, and site-title sizing. Sync script reads root padding from `theme.json` instead of hardcoding.

- **Cloudflare CDN experiment** — proxied both hosts through Cloudflare with cache rules, then reverted. Findings documented for posterity:
  - Cloudflare's free Universal SSL doesn't cover 2-level subdomains. Required renaming `slow.speedtest.*` → `slow-speedtest.*` (now 1-level under apex).
  - Synthetic Lighthouse runs from a single GitHub Actions runner don't benefit from CDN edge cache the way distributed real users would. The 5-min TTL plus single-runner traffic meant most runs hit cold cache.
  - Net impact in this setup: +1000-2000ms LCP variance on fast.* with no offsetting win. Reverted to grey-cloud (DNS only, traffic direct to Hetzner).
  - Hostname rename retained — cleaner naming and SSL-ready if proxying ever makes sense for real distributed traffic.

## Open items, ordered by expected impact

### 1. TTFB / FCP — biggest remaining lever
FCP at ~1400ms means baseline server response is ~600ms+. With LCP at 2990ms and FCP at 1400ms, ~1500ms is the post-FCP image-paint window. Levers:
- Profile the SSG path: are GraphQL fetches at build time / ISR-revalidate time fully parallel? Sequential fetches add up.
- Audit the RSC hydration payload — 60% of the 115KB HTML is `self.__next_f.push` data for client components. Reducing client components or making their props leaner shrinks the HTML.
- Audit Effects (`ScrollReveal`, `AnimatedBorder`, `CounterAnimation`, `JumpingText`, `BlastOffImage`) — wrapping server-rendered content in client components serializes the whole tree into the RSC stream. Move to CSS-only / IntersectionObserver-with-empty-children where possible.

### 2. Self-host or eliminate Unsplash images on /about and /contact
Same cross-server-fetch issue as the hero, but for `images.unsplash.com`. Either mirror to `public/` (same approach as hero) or replace with self-hosted alternatives. Lower priority — these aren't the showcase pages.

### 3. Drop `next/image` quality further (q=60–65) on priority covers
The 60% black overlay hides everything. Risk: faint banding at full screen. Add the lower value to `images.qualities` first or it'll silently revert to 75 again.

### 4. Shrink hero source further
Current: 1600×900 q70 / 216KB. Could try 1200×675 q70 / ~120KB — most mobile devices won't render larger than 1200px even at DPR 2. Smaller source → smaller transcoded variants on mobile. ~50–150ms expected.

### 5. Critical CSS / render-blocking
Inspect Lighthouse's render-blocking-resources audit on `fast-speedtest.*`. Two stylesheets load in `<head>`. If they're blocking past FCP, inline critical CSS or defer non-critical sheets.

### 6. JS bundle audit
If hydration is delaying LCP measurement, splitting / `next/dynamic`-ing non-critical components could help. Check `next build` output for first-load JS sizes.

### 7. Edge deployment for real users
Skipped Cloudflare for the synthetic test (see Done section). For real production traffic from distributed users, a CDN in front would help — but that's beyond demo scope. Revisit if the demo finds a real audience and we want to show "production headless deploy" rather than "raw architectural advantage."

## How to update this doc

When a lever ships, move it from "Open" to "Done" with a one-line note on observed impact. When you discover a new lever, add it to "Open" with a sentence describing what it's attacking and rough expected impact. Keep the "Current metrics" table fresh after notable runs — it's the source of truth for "are we still bottlenecked the same way?"
