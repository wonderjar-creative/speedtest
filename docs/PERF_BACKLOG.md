# Performance Backlog

Running list of performance levers for the headless side (`fast.speedtest.denverheadless.com`). The slow side is intentionally not optimized — it represents a typical small-business WordPress site and the demo's value depends on the gap.

Lighthouse mobile is the canonical measurement; desktop runs to ~95-100 already.

## Current metrics

Last seen on `fast.*` mobile (see `apps/comparison/public/metrics.json` for live values):

| Metric | Last | Target |
|---|---|---|
| Performance | 92 | 95-100 |
| LCP | 3067ms | 500-800ms |
| FCP | 1519ms | 300-500ms |
| TBT | 64ms | 0-80ms |
| CLS | 0 | 0-0.02 |
| SI | 2841ms | — |

## Done

- **Editor-controlled LCP priority on image blocks.** `priority` attribute on `core/cover` / `core/image` / `core/post-featured-image`, registered server-side via `BlockExtensionsFeature.php` and editor-side via `block-extensions.js`. Pre-flagged on home / about / contact covers and single post / single project featured-images. Headless `Cover.tsx`, `Image.tsx`, `PostFeaturedImage.tsx` honor it. Added ~1.5s of headroom on mobile LCP (~4.4s → ~3.1s).
- **Local mirror for `hero.jpg`.** Theme asset shipped at `apps/headless/public/hero.jpg`; `Cover.tsx` rewrites the slow.* URL to `/hero.jpg` so `next/image` reads from disk instead of a public-DNS round-trip back to the slow origin. Sync via `make sync-assets`.

## Open items, ordered by expected impact

### 1. Shrink the hero source — low complexity, medium-high impact
The current `hero.jpg` is 422KB at 1920×1080. On 3G simulation that download alone is hundreds of ms; the transcode also takes longer the heavier the source. Replace with a 1200×675 (or 1600×900) source, ideally AVIF master, at q≈70. Should land most of the remaining LCP gap if image weight is the dominant residual cost.

### 2. Verify preload is actually injected — diagnostic, no code change
Confirm in deployed `fast.*` page source that `<head>` contains `<link rel="preload" as="image" imagesrcset="..." imagesizes="100vw">` for the hero. If it's missing or `imagesrcset` looks wrong, `priority` isn't doing what we think and we have a different bug to chase.

### 3. TTFB / FCP — medium complexity, big potential impact
FCP at ~1.5s mobile suggests baseline server response is ~1s+. That's a hard floor LCP can't go below. Worth profiling the SSR path: are GraphQL fetches blocking render? Could the homepage be statically generated with ISR (`generateStaticParams` + `revalidate`) instead of server-rendered on every hit? That'd collapse TTFB to CDN-edge time.

### 4. Reduce `next/image` quality on the hero — low complexity, low-medium impact
Default is `quality={75}`. The hero has a heavy gray-900 dim overlay so reduced quality is hard to perceive. Try `quality={60}` on the cover image specifically. Smaller payload → faster download → earlier LCP.

### 5. Critical CSS / render-blocking — medium complexity, varies
Inspect Lighthouse's render-blocking-resources audit on `fast.*`. If CSS is blocking past FCP, inline critical CSS or defer non-critical sheets. Tailwind output should be small but check.

### 6. Self-host or eliminate Unsplash images on /about and /contact
Same cross-server-fetch issue as the hero, but for `images.unsplash.com`. Either mirror to `public/` (same approach as hero) or replace with self-hosted alternatives. Lower priority — these aren't the showcase pages.

### 7. JS bundle audit — medium-high complexity, varies
If hydration is delaying LCP measurement, splitting / `next/dynamic`-ing non-critical components could help. Check `next build` output for first-load JS sizes.

### 8. Add `rel="preconnect"` hints for any remaining external image hosts
Only matters for sources we don't mirror (Unsplash, etc.).

## How to update this doc

When a lever ships, move it from "Open" to "Done" with a one-line note on observed impact. When you discover a new lever, add it to "Open" with a sentence describing what it's attacking and rough expected impact. Keep the "Current metrics" table fresh after notable runs — it's the source of truth for "are we still bottlenecked the same way?"
