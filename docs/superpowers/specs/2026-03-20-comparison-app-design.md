# Comparison App Design Spec

**Date:** 2026-03-20
**Status:** Approved
**Domain:** speedtest.denverheadless.com

## Purpose

Marketing demo for Denver Headless that shows the performance difference between traditional WordPress and headless architecture. Serves both non-technical prospective clients (visceral speed impression) and technical decision-makers (credible metrics).

## Architecture

Single-page Next.js 16 app with TypeScript and Tailwind v4. No additional dependencies beyond the existing scaffold. Deployed via Docker/Coolify on Hetzner alongside the headless frontend and WordPress backend.

Two iframes embed the real sites:
- `slow.speedtest.denverheadless.com` — traditional WordPress (monolithic rendering)
- `fast.speedtest.denverheadless.com` — headless Next.js frontend

Both sites run on the same Hetzner CX22 server. The speed difference is purely architectural.

## Page Structure

Single page, top to bottom:

### 1. Header (fixed)
- "Denver Headless" wordmark, left-aligned
- Page navigation, centered: Home, About, Services, Portfolio, Blog, Contact
- Star badges on recommended demo pages (Home, Portfolio, Services)
- "Race!" button, right-aligned, teal accent
- Background: `slate-900`
- Active nav item: teal underline/highlight

### 2. Intro Hero
- Tagline: "Same server. Same content. Same backend. 5x faster."
- Context line: "See the difference headless architecture makes — a real WordPress site, rendered two ways, on the same server."
- Scroll prompt / anchor link to comparison section
- Dark background continuous with header

### 3. Comparison Area (~65-70vh)
- Two iframes side-by-side, equal width
- Labels above each iframe:
  - Left: "Traditional WordPress" — red badge
  - Right: "Headless" — green badge
- Iframes load the corresponding subdomain at the current page path
- **Error state:** If an iframe fails to load (site down, DNS not configured), show a "Site unavailable" placeholder matching the iframe dimensions

### 4. Metrics Panel
- Compact horizontal bar below iframes
- Divided into two halves (Traditional | Headless) with center divider
- Lighthouse score displayed largest on each side
- Core Web Vitals (LCP, FCP, TBT, CLS) smaller in a row
- Traditional values: red/orange tones
- Headless values: green tones
- All values hardcoded for v1
- Footnote: "Based on Lighthouse audit, March 2026"

**Hardcoded values:**

| Metric | Traditional | Headless |
|--------|------------|----------|
| Lighthouse | 48 | 97 |
| LCP | 4.2s | 0.6s |
| FCP | 2.1s | 0.3s |
| TBT | 750ms | 40ms |
| CLS | 0.18 | 0.01 |

### 5. CTA Section
- Heading: "Ready to make your site this fast?"
- Brief line about Denver Headless offering
- Link to denverheadless.com and/or contact email
- Dark background consistent with rest of app

### 6. Footer
- "Built by Wonderjar Creative" with link
- Minimal, dark

## Navigation Sync

### Nav Bar
- Clicking a nav item updates both iframes to the corresponding path
- Example: clicking "Portfolio" sets left iframe to `slow.speedtest.../portfolio` and right to `fast.speedtest.../portfolio`
- Active nav item updates to reflect current page

### In-Iframe Link Interception (postMessage)
- A small script (~20 lines) is added to both the headless app and the WordPress theme
- On route change, the script broadcasts `{ type: 'navigation', path: '/portfolio' }` to `window.parent` via `postMessage`
- The comparison app listens for these messages and updates the other iframe's `src` to the matching path
- Nav bar active state updates to match

## Race Interaction

Triggered by clicking the "Race!" button in the header.

### Sequence
1. **Race button disables** (prevents spamming)
2. **Overlay appears** on both iframes — semi-transparent dark overlay. Shows "Ready..." for 700ms, then "Go!" for 300ms.
3. **Both iframes reload simultaneously** — overlays clear, live timer appears in the top corner of each iframe overlay, counting up from 0.0s
4. **Headless side finishes first** — timer stops, turns green, subtle checkmark appears. Iframe content fully visible.
5. **Traditional side keeps loading** — timer continues counting in red. The growing gap is the persuasive moment.
6. **Traditional side finishes** — timer stops. Both times remain visible for a few seconds, then fade out.
7. **Race button re-enables**

### Technical Details
- Timer uses `requestAnimationFrame` loop, displays to 0.1s precision
- "Finished" detection via iframe `load` event (approximation — fires on document + sub-resources loaded, not hydration-complete. Acceptable for v1; a future version could use a custom `postMessage` signal for more accurate timing)
- Overlay and timers are DOM elements positioned over iframes (not inside them)
- No confetti, no explosions — the numbers do the talking

## Responsive Behavior

### Mobile (< 768px)
- Iframes stack vertically, each ~40vh
- Metrics panel stacks into two columns (Traditional left, Headless right)
- Hero and CTA remain full-width
- Nav collapses to a hamburger menu
- Race button accessible from header

### Desktop (>= 768px)
- Side-by-side iframes as described above
- Single-row metrics panel

## Visual Identity

- Dark minimal chrome: `slate-900` / `zinc-800` backgrounds
- Teal accents on interactive elements (race button, active nav, metric highlights)
- "Denver Headless" wordmark in header, "by Wonderjar Creative" in footer
- No strong branding — wrapper recedes, iframes are the star
- Red/orange for traditional metrics, green for headless metrics

## Component Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout, dark theme, fonts
│   ├── page.tsx            # Single page composing all sections
│   └── globals.css         # Tailwind v4, dark theme variables
├── components/
│   ├── Header.tsx          # Fixed nav, page links, star badges, race button
│   ├── Hero.tsx            # Intro tagline and scroll prompt
│   ├── ComparisonView.tsx  # Iframes, labels, race overlay, timers
│   ├── MetricsPanel.tsx    # Hardcoded metrics display
│   ├── CTA.tsx             # Closing section with contact link
│   └── Footer.tsx          # Credit line
├── hooks/
│   └── useRace.ts          # Race state machine, timers, iframe load detection
```

## State Management

React state only (useState/useReducer). No external state library.

**State shape:**
- `activePage: string` — current page path (e.g., `/portfolio`)
- `raceStatus: 'idle' | 'countdown' | 'racing' | 'complete'`
- `fastTime: number | null` — headless timer value when stopped
- `slowTime: number | null` — traditional timer value when stopped

## Cross-Site Script (postMessage)

Added to both the headless Next.js app and the WordPress theme:

```js
// Broadcast navigation changes to parent comparison app
if (window.parent !== window) {
  // On route change, post the new path
  window.parent.postMessage({
    type: 'navigation',
    path: window.location.pathname
  }, 'https://speedtest.denverheadless.com');
}
```

The headless app uses a client component with `usePathname()` and a `useEffect` that posts the message on pathname change (App Router does not expose `router.events`). The WordPress theme adds it as a script that fires on page load.

**Security:** The comparison app's `message` event listener must validate `event.origin` against an allowlist of `https://slow.speedtest.denverheadless.com` and `https://fast.speedtest.denverheadless.com` before acting on messages.

## Deployment

- Next.js standalone output mode (must be added to `next.config.ts`: `output: 'standalone'`)
- Docker container: `node:22-alpine`, `npm ci`, `npm run build`, copy `.next/standalone`
- Deployed via Coolify on same Hetzner CX22
- Domain: `speedtest.denverheadless.com` via Cloudflare DNS
- SSL: Let's Encrypt via Coolify

## Out of Scope (v1)

- Live Lighthouse audits (hardcoded values only)
- Per-page metrics (same values shown regardless of page)
- Analytics integration (Plausible can be added later)
- A/B testing or variant comparisons
- Video recording of races
- Share/embed functionality

## Success Criteria

- Both iframes load and display real sites correctly
- Page navigation syncs both sides via nav bar and in-iframe clicks
- Race interaction works reliably with visible timer difference
- Metrics panel displays hardcoded values clearly
- Works on desktop and mobile (stacked)
- Total load time of comparison app itself under 1 second
- Deployable via Coolify on Hetzner
