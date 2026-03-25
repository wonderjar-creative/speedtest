# Comparison App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the split-screen comparison app at speedtest.denverheadless.com that demonstrates the performance difference between traditional WordPress and headless architecture.

**Architecture:** Single-page Next.js 16 app with dark chrome wrapper containing two iframes (traditional WP and headless), synced navigation via postMessage, a race feature with live timers, and hardcoded Lighthouse metrics. All components are client-side — no server actions or API routes needed.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind v4. No additional dependencies.

**Spec:** `docs/superpowers/specs/2026-03-20-comparison-app-design.md`

---

## File Structure

```
apps/comparison/src/
├── app/
│   ├── layout.tsx              # Root layout — dark theme, metadata, fonts
│   ├── page.tsx                # Single page composing all sections
│   └── globals.css             # Tailwind v4, dark theme CSS variables
├── components/
│   ├── Header.tsx              # Fixed nav bar, page links, star badges, race button
│   ├── Hero.tsx                # Intro tagline and scroll prompt
│   ├── ComparisonView.tsx      # Iframes, labels, race overlay, timers
│   ├── MetricsPanel.tsx        # Hardcoded Lighthouse/CWV metrics display
│   ├── CTA.tsx                 # Closing section with contact link
│   └── Footer.tsx              # "Built by Wonderjar Creative" credit
├── hooks/
│   └── useRace.ts              # Race state machine, timers, iframe load detection
└── config/
    └── constants.ts            # Page definitions, metrics data, URLs
```

Additionally modified outside the comparison app:
- `apps/headless/src/components/PostMessageBroadcaster.tsx` — client component for iframe nav sync
- `apps/headless/src/app/layout.tsx` — mount the broadcaster
- `wordpress/theme/functions.php` — enqueue postMessage script for WP theme
- `wordpress/theme/assets/js/parent-notify.js` — postMessage script for WP

---

### Task 1: Foundation — Config, Constants, and Theme

**Files:**
- Modify: `apps/comparison/next.config.ts`
- Modify: `apps/comparison/src/app/globals.css`
- Modify: `apps/comparison/src/app/layout.tsx`
- Create: `apps/comparison/src/config/constants.ts`

- [ ] **Step 1: Add standalone output and env config to next.config.ts**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
};

export default nextConfig;
```

- [ ] **Step 1b: Verify tsconfig.json has `@/*` path alias and postcss.config.mjs has `@tailwindcss/postcss`**

Read `apps/comparison/tsconfig.json` and confirm it has `"@/*": ["./src/*"]` in `paths`. Read `apps/comparison/postcss.config.mjs` and confirm it includes `@tailwindcss/postcss`. Both should already be set up by `create-next-app` but verify before proceeding.

- [ ] **Step 2: Create `src/config/` directory and constants.ts with page definitions and metrics data**

```ts
export const PAGES = [
  { name: "Home", path: "/", starred: true },
  { name: "About", path: "/about", starred: false },
  { name: "Services", path: "/services", starred: true },
  { name: "Portfolio", path: "/portfolio", starred: true },
  { name: "Blog", path: "/blog", starred: false },
  { name: "Contact", path: "/contact", starred: false },
] as const;

export const METRICS = {
  traditional: {
    lighthouse: 48,
    lcp: "4.2s",
    fcp: "2.1s",
    tbt: "750ms",
    cls: "0.18",
  },
  headless: {
    lighthouse: 97,
    lcp: "0.6s",
    fcp: "0.3s",
    tbt: "40ms",
    cls: "0.01",
  },
} as const;

export const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_SLOW_SITE_URL ?? "https://slow.speedtest.denverheadless.com",
  process.env.NEXT_PUBLIC_FAST_SITE_URL ?? "https://fast.speedtest.denverheadless.com",
];
```

- [ ] **Step 3: Replace globals.css with dark theme variables**

Replace the entire file. Dark background, teal accent, red/green metric colors. Use Tailwind v4 `@theme inline` for custom properties:

```css
@import "tailwindcss";

:root {
  --background: #0f172a;
  --foreground: #f8fafc;
  --surface: #1e293b;
  --surface-alt: #334155;
  --teal: #5eead4;
  --teal-dark: #14b8a6;
  --red: #ef4444;
  --red-muted: #fca5a5;
  --green: #22c55e;
  --green-muted: #86efac;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-surface: var(--surface);
  --color-surface-alt: var(--surface-alt);
  --color-teal: var(--teal);
  --color-teal-dark: var(--teal-dark);
  --color-red: var(--red);
  --color-red-muted: var(--red-muted);
  --color-green: var(--green);
  --color-green-muted: var(--green-muted);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

body {
  background: var(--background);
  color: var(--foreground);
}
```

- [ ] **Step 4: Update layout.tsx with dark theme and metadata**

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Speed Test — Denver Headless",
  description:
    "Same server. Same content. Same backend. 5x faster. See the difference headless architecture makes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Verify the app builds**

Run: `cd apps/comparison && npm run build`
Expected: Successful build with no errors.

- [ ] **Step 6: Commit**

```bash
git add apps/comparison/next.config.ts apps/comparison/src/app/globals.css apps/comparison/src/app/layout.tsx apps/comparison/src/config/constants.ts
git commit -m "feat(comparison): add foundation config, constants, and dark theme"
```

---

### Task 2: Header Component

**Files:**
- Create: `apps/comparison/src/components/Header.tsx`

The Header is a client component (needs state for active page, hamburger toggle). It receives `activePage` and callbacks as props.

- [ ] **Step 1: Create Header.tsx**

```tsx
"use client";

import { useState } from "react";
import { PAGES } from "@/config/constants";

interface HeaderProps {
  activePage: string;
  onNavigate: (path: string) => void;
  onRace: () => void;
  raceDisabled: boolean;
}

export default function Header({
  activePage,
  onNavigate,
  onRace,
  raceDisabled,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-b border-surface-alt">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        {/* Wordmark */}
        <span className="text-teal font-semibold text-lg whitespace-nowrap">
          Denver Headless
        </span>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {PAGES.map((page) => (
            <button
              key={page.path}
              onClick={() => onNavigate(page.path)}
              className={`relative px-3 py-1.5 text-sm rounded transition-colors ${
                activePage === page.path
                  ? "text-teal"
                  : "text-foreground/70 hover:text-foreground"
              }`}
            >
              {page.name}
              {page.starred && (
                <span className="ml-1 text-yellow-400 text-xs">★</span>
              )}
              {activePage === page.path && (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-teal rounded-full" />
              )}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* Race button */}
          <button
            onClick={onRace}
            disabled={raceDisabled}
            className="bg-teal text-background font-bold text-sm px-4 py-1.5 rounded transition-opacity disabled:opacity-40 disabled:cursor-not-allowed hover:bg-teal-dark"
          >
            Race!
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-foreground/70 p-1"
            aria-label="Toggle menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {menuOpen ? (
                <path d="M6 6l12 12M6 18L18 6" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="md:hidden border-t border-surface-alt bg-background/95 backdrop-blur">
          {PAGES.map((page) => (
            <button
              key={page.path}
              onClick={() => {
                onNavigate(page.path);
                setMenuOpen(false);
              }}
              className={`block w-full text-left px-4 py-3 text-sm border-b border-surface-alt/50 ${
                activePage === page.path
                  ? "text-teal bg-surface/50"
                  : "text-foreground/70"
              }`}
            >
              {page.name}
              {page.starred && (
                <span className="ml-1 text-yellow-400 text-xs">★</span>
              )}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}
```

- [ ] **Step 2: Verify it renders by temporarily mounting in page.tsx**

Replace `page.tsx` content with:

```tsx
"use client";

import { useState } from "react";
import Header from "@/components/Header";

export default function Home() {
  const [activePage, setActivePage] = useState("/");

  return (
    <div>
      <Header
        activePage={activePage}
        onNavigate={setActivePage}
        onRace={() => alert("Race!")}
        raceDisabled={false}
      />
      <div className="pt-14 p-8">
        <p>Active page: {activePage}</p>
      </div>
    </div>
  );
}
```

Run: `cd apps/comparison && npm run dev`
Expected: Dark header with nav links, teal Race button, hamburger on mobile. Clicking nav items updates active state.

- [ ] **Step 3: Commit**

```bash
git add apps/comparison/src/components/Header.tsx apps/comparison/src/app/page.tsx
git commit -m "feat(comparison): add Header component with nav and race button"
```

---

### Task 3: Hero, CTA, and Footer Components

**Files:**
- Create: `apps/comparison/src/components/Hero.tsx`
- Create: `apps/comparison/src/components/CTA.tsx`
- Create: `apps/comparison/src/components/Footer.tsx`

These are simple presentational components with no state.

- [ ] **Step 1: Create Hero.tsx**

```tsx
export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center text-center px-4 py-20 md:py-28">
      <h1 className="text-3xl md:text-5xl font-bold tracking-tight max-w-2xl">
        Same server. Same content. Same backend.{" "}
        <span className="text-teal">5x faster.</span>
      </h1>
      <p className="mt-4 text-foreground/60 text-lg max-w-xl">
        See the difference headless architecture makes — a real WordPress site,
        rendered two ways, on the same server.
      </p>
      <a
        href="#comparison"
        className="mt-8 text-teal text-sm font-medium hover:text-teal-dark transition-colors"
      >
        See it live ↓
      </a>
    </section>
  );
}
```

- [ ] **Step 2: Create CTA.tsx**

```tsx
export default function CTA() {
  return (
    <section className="py-16 px-4 text-center border-t border-surface-alt">
      <h2 className="text-2xl md:text-3xl font-bold">
        Ready to make your site this fast?
      </h2>
      <p className="mt-3 text-foreground/60 max-w-md mx-auto">
        Denver Headless builds blazing-fast headless WordPress sites on ethical
        infrastructure. Same backend your team already knows, dramatically better
        performance.
      </p>
      <a
        href="https://denverheadless.com"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-6 bg-teal text-background font-semibold px-6 py-2.5 rounded hover:bg-teal-dark transition-colors"
      >
        Learn More
      </a>
    </section>
  );
}
```

- [ ] **Step 3: Create Footer.tsx**

```tsx
export default function Footer() {
  return (
    <footer className="py-6 px-4 text-center text-foreground/40 text-sm border-t border-surface-alt">
      Built by{" "}
      <a
        href="https://wonderjarcreative.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-foreground/60 hover:text-foreground transition-colors"
      >
        Wonderjar Creative
      </a>
    </footer>
  );
}
```

- [ ] **Step 4: Verify by mounting all in page.tsx**

Update `page.tsx` to import and render Hero, CTA, and Footer below the Header placeholder content. Run `npm run dev` and check they render correctly with dark theme.

- [ ] **Step 5: Commit**

```bash
git add apps/comparison/src/components/Hero.tsx apps/comparison/src/components/CTA.tsx apps/comparison/src/components/Footer.tsx apps/comparison/src/app/page.tsx
git commit -m "feat(comparison): add Hero, CTA, and Footer components"
```

---

### Task 4: MetricsPanel Component

**Files:**
- Create: `apps/comparison/src/components/MetricsPanel.tsx`

- [ ] **Step 1: Create MetricsPanel.tsx**

Displays hardcoded metrics side-by-side. Uses the `METRICS` constant from `config/constants.ts`.

```tsx
import { METRICS } from "@/config/constants";

function MetricValue({
  label,
  value,
  color,
  large,
}: {
  label: string;
  value: string | number;
  color: "red" | "green";
  large?: boolean;
}) {
  const colorClass = color === "red" ? "text-red" : "text-green";
  return (
    <div className="text-center">
      <div
        className={`${colorClass} font-bold ${large ? "text-3xl md:text-4xl" : "text-lg md:text-xl"} font-mono`}
      >
        {value}
      </div>
      <div className="text-foreground/40 text-xs mt-0.5 uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}

export default function MetricsPanel() {
  return (
    <section className="bg-surface border-y border-surface-alt py-6 px-4">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-2 gap-4 md:gap-8 divide-x divide-surface-alt">
          {/* Traditional side */}
          <div className="space-y-3">
            <div className="text-center text-sm font-medium text-red-muted uppercase tracking-wider">
              Traditional WordPress
            </div>
            <div className="flex items-end justify-center gap-4 md:gap-6">
              <MetricValue
                label="Lighthouse"
                value={METRICS.traditional.lighthouse}
                color="red"
                large
              />
              <MetricValue
                label="LCP"
                value={METRICS.traditional.lcp}
                color="red"
              />
              <MetricValue
                label="FCP"
                value={METRICS.traditional.fcp}
                color="red"
              />
              <MetricValue
                label="TBT"
                value={METRICS.traditional.tbt}
                color="red"
              />
              <MetricValue
                label="CLS"
                value={METRICS.traditional.cls}
                color="red"
              />
            </div>
          </div>

          {/* Headless side */}
          <div className="space-y-3">
            <div className="text-center text-sm font-medium text-green-muted uppercase tracking-wider">
              Headless
            </div>
            <div className="flex items-end justify-center gap-4 md:gap-6">
              <MetricValue
                label="Lighthouse"
                value={METRICS.headless.lighthouse}
                color="green"
                large
              />
              <MetricValue
                label="LCP"
                value={METRICS.headless.lcp}
                color="green"
              />
              <MetricValue
                label="FCP"
                value={METRICS.headless.fcp}
                color="green"
              />
              <MetricValue
                label="TBT"
                value={METRICS.headless.tbt}
                color="green"
              />
              <MetricValue
                label="CLS"
                value={METRICS.headless.cls}
                color="green"
              />
            </div>
          </div>
        </div>

        <p className="text-center text-foreground/30 text-xs mt-4">
          Based on Lighthouse audit, March 2026
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Mount in page.tsx and verify**

Add MetricsPanel below the comparison area placeholder. Run `npm run dev` and verify metrics render with correct colors and layout.

- [ ] **Step 3: Commit**

```bash
git add apps/comparison/src/components/MetricsPanel.tsx apps/comparison/src/app/page.tsx
git commit -m "feat(comparison): add MetricsPanel with hardcoded Lighthouse metrics"
```

---

### Task 5: useRace Hook — Race State Machine and Timers

**Files:**
- Create: `apps/comparison/src/hooks/useRace.ts`

This is the core logic for the race feature. It manages the state machine (idle → countdown → racing → complete), runs timers via `requestAnimationFrame`, and listens for iframe `load` events.

- [ ] **Step 1: Create useRace.ts**

```ts
"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export type RaceStatus = "idle" | "countdown" | "racing" | "complete";

interface UseRaceReturn {
  raceStatus: RaceStatus;
  countdownText: string | null;
  fastTime: number | null;
  slowTime: number | null;
  fastDone: boolean;
  slowDone: boolean;
  startRace: () => void;
  slowIframeRef: React.RefObject<HTMLIFrameElement | null>;
  fastIframeRef: React.RefObject<HTMLIFrameElement | null>;
}

export function useRace(): UseRaceReturn {
  const [raceStatus, setRaceStatus] = useState<RaceStatus>("idle");
  const [countdownText, setCountdownText] = useState<string | null>(null);
  const [fastTime, setFastTime] = useState<number | null>(null);
  const [slowTime, setSlowTime] = useState<number | null>(null);
  const [fastDone, setFastDone] = useState(false);
  const [slowDone, setSlowDone] = useState(false);

  const slowIframeRef = useRef<HTMLIFrameElement | null>(null);
  const fastIframeRef = useRef<HTMLIFrameElement | null>(null);
  const startTimeRef = useRef<number>(0);
  const rafRef = useRef<number>(0);
  const fastDoneRef = useRef(false);
  const slowDoneRef = useRef(false);
  const safetyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Timer loop
  const tick = useCallback(() => {
    const elapsed = (performance.now() - startTimeRef.current) / 1000;

    if (!fastDoneRef.current) {
      setFastTime(parseFloat(elapsed.toFixed(1)));
    }
    if (!slowDoneRef.current) {
      setSlowTime(parseFloat(elapsed.toFixed(1)));
    }

    if (!fastDoneRef.current || !slowDoneRef.current) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      setRaceStatus("complete");
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
    };
  }, []);

  const startRace = useCallback(() => {
    // Cancel any lingering animation frame or safety timeout from a previous race
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);

    // Reset
    setFastTime(null);
    setSlowTime(null);
    setFastDone(false);
    setSlowDone(false);
    fastDoneRef.current = false;
    slowDoneRef.current = false;
    setRaceStatus("countdown");
    setCountdownText("Ready...");

    // Countdown sequence: "Ready..." 700ms, "Go!" 300ms, then race
    setTimeout(() => {
      setCountdownText("Go!");
      setTimeout(() => {
        setCountdownText(null);
        setRaceStatus("racing");
        setFastTime(0);
        setSlowTime(0);
        startTimeRef.current = performance.now();

        // Set up load handlers before reloading
        const onFastLoad = () => {
          if (!fastDoneRef.current) {
            fastDoneRef.current = true;
            setFastDone(true);
            const elapsed =
              (performance.now() - startTimeRef.current) / 1000;
            setFastTime(parseFloat(elapsed.toFixed(1)));
          }
          fastIframeRef.current?.removeEventListener("load", onFastLoad);
        };

        const onSlowLoad = () => {
          if (!slowDoneRef.current) {
            slowDoneRef.current = true;
            setSlowDone(true);
            const elapsed =
              (performance.now() - startTimeRef.current) / 1000;
            setSlowTime(parseFloat(elapsed.toFixed(1)));
          }
          slowIframeRef.current?.removeEventListener("load", onSlowLoad);
        };

        fastIframeRef.current?.addEventListener("load", onFastLoad);
        slowIframeRef.current?.addEventListener("load", onSlowLoad);

        // Reload both iframes by re-assigning src
        const slowSrc = slowIframeRef.current?.src;
        const fastSrc = fastIframeRef.current?.src;
        if (slowIframeRef.current && slowSrc)
          slowIframeRef.current.src = slowSrc;
        if (fastIframeRef.current && fastSrc)
          fastIframeRef.current.src = fastSrc;

        // Start timer loop
        rafRef.current = requestAnimationFrame(tick);

        // Safety timeout — auto-complete after 30s if iframe never loads
        safetyTimeoutRef.current = setTimeout(() => {
          const elapsed =
            (performance.now() - startTimeRef.current) / 1000;
          if (!fastDoneRef.current) {
            fastDoneRef.current = true;
            setFastDone(true);
            setFastTime(parseFloat(elapsed.toFixed(1)));
          }
          if (!slowDoneRef.current) {
            slowDoneRef.current = true;
            setSlowDone(true);
            setSlowTime(parseFloat(elapsed.toFixed(1)));
          }
        }, 30000);
      }, 300);
    }, 700);
  }, [tick]);

  return {
    raceStatus,
    countdownText,
    fastTime,
    slowTime,
    fastDone,
    slowDone,
    startRace,
    slowIframeRef,
    fastIframeRef,
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/comparison/src/hooks/useRace.ts
git commit -m "feat(comparison): add useRace hook with state machine and timers"
```

---

### Task 6: ComparisonView Component — Iframes, Labels, and Race Overlay

**Files:**
- Create: `apps/comparison/src/components/ComparisonView.tsx`

This component renders the two iframes, their labels, the race overlay with countdown/timers, and error fallbacks.

- [ ] **Step 1: Create ComparisonView.tsx**

```tsx
"use client";

import { useState, useEffect } from "react";
import type { RaceStatus } from "@/hooks/useRace";

interface ComparisonViewProps {
  activePage: string;
  slowUrl: string;
  fastUrl: string;
  raceStatus: RaceStatus;
  countdownText: string | null;
  fastTime: number | null;
  slowTime: number | null;
  fastDone: boolean;
  slowDone: boolean;
  slowIframeRef: React.RefObject<HTMLIFrameElement | null>;
  fastIframeRef: React.RefObject<HTMLIFrameElement | null>;
}

function IframeError() {
  return (
    <div className="flex items-center justify-center h-full bg-surface text-foreground/40 text-sm">
      Site unavailable
    </div>
  );
}

function RaceOverlay({
  side,
  raceStatus,
  countdownText,
  time,
  done,
  hidden,
}: {
  side: "slow" | "fast";
  raceStatus: RaceStatus;
  countdownText: string | null;
  time: number | null;
  done: boolean;
  hidden: boolean;
}) {
  if (raceStatus === "idle" || hidden) return null;

  if (raceStatus === "countdown") {
    return (
      <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
        <span className="text-3xl font-bold text-foreground animate-pulse">
          {countdownText}
        </span>
      </div>
    );
  }

  if (raceStatus === "racing" || raceStatus === "complete") {
    const colorClass = done
      ? side === "fast"
        ? "text-green"
        : "text-red"
      : "text-foreground/70";

    return (
      <div className="absolute top-3 left-3 z-10 px-3 py-1.5 rounded bg-background/80 backdrop-blur font-mono text-sm flex items-center gap-2">
        <span className={`font-bold ${colorClass}`}>
          {time !== null ? `${time.toFixed(1)}s` : "0.0s"}
        </span>
        {done && <span className="text-green text-base">✓</span>}
      </div>
    );
  }

  return null;
}

export default function ComparisonView({
  activePage,
  slowUrl,
  fastUrl,
  raceStatus,
  countdownText,
  fastTime,
  slowTime,
  fastDone,
  slowDone,
  slowIframeRef,
  fastIframeRef,
}: ComparisonViewProps) {
  const [slowError, setSlowError] = useState(false);
  const [fastError, setFastError] = useState(false);
  const [overlayHidden, setOverlayHidden] = useState(false);

  // Auto-fade race timers 5 seconds after race completes
  useEffect(() => {
    if (raceStatus === "complete") {
      const timer = setTimeout(() => setOverlayHidden(true), 5000);
      return () => clearTimeout(timer);
    }
    setOverlayHidden(false);
  }, [raceStatus]);

  const slowSrc = `${slowUrl}${activePage}`;
  const fastSrc = `${fastUrl}${activePage}`;

  return (
    <section id="comparison" className="px-4 pb-2">
      <div className="mx-auto max-w-7xl">
        {/* Labels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
          <div className="text-center">
            <span className="inline-block bg-red/20 text-red text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
              Traditional WordPress
            </span>
          </div>
          <div className="text-center">
            <span className="inline-block bg-green/20 text-green text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
              Headless
            </span>
          </div>
        </div>

        {/* Iframes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Traditional WP iframe */}
          <div className="relative rounded-lg overflow-hidden border border-surface-alt bg-surface h-[40vh] md:h-[65vh]">
            <RaceOverlay
              side="slow"
              raceStatus={raceStatus}
              countdownText={countdownText}
              time={slowTime}
              done={slowDone}
              hidden={overlayHidden}
            />
            {slowError ? (
              <IframeError />
            ) : (
              <iframe
                ref={slowIframeRef}
                src={slowSrc}
                className="w-full h-full border-0"
                title="Traditional WordPress site"
                onError={() => setSlowError(true)}
              />
            )}
          </div>

          {/* Headless iframe */}
          <div className="relative rounded-lg overflow-hidden border border-surface-alt bg-surface h-[40vh] md:h-[65vh]">
            <RaceOverlay
              side="fast"
              raceStatus={raceStatus}
              countdownText={countdownText}
              time={fastTime}
              done={fastDone}
              hidden={overlayHidden}
            />
            {fastError ? (
              <IframeError />
            ) : (
              <iframe
                ref={fastIframeRef}
                src={fastSrc}
                className="w-full h-full border-0"
                title="Headless site"
                onError={() => setFastError(true)}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
```

**Note on iframe error detection:** The `onError` handler on `<iframe>` elements rarely fires for common failure modes (DNS, HTTP errors). For v1, the "Site unavailable" fallback is best-effort. The safety timeout in `useRace` handles the race case. If more robust detection is needed later, a timeout-based approach can be added.

- [ ] **Step 2: Commit**

```bash
git add apps/comparison/src/components/ComparisonView.tsx
git commit -m "feat(comparison): add ComparisonView with iframes, labels, and race overlay"
```

---

### Task 7: Compose Page — Wire Everything Together

**Files:**
- Modify: `apps/comparison/src/app/page.tsx`

- [ ] **Step 1: Compose all components in page.tsx**

```tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ComparisonView from "@/components/ComparisonView";
import MetricsPanel from "@/components/MetricsPanel";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import { useRace } from "@/hooks/useRace";
import { ALLOWED_ORIGINS, PAGES } from "@/config/constants";

const SLOW_URL =
  process.env.NEXT_PUBLIC_SLOW_SITE_URL ??
  "https://slow.speedtest.denverheadless.com";
const FAST_URL =
  process.env.NEXT_PUBLIC_FAST_SITE_URL ??
  "https://fast.speedtest.denverheadless.com";

export default function Home() {
  const [activePage, setActivePage] = useState("/");
  const {
    raceStatus,
    countdownText,
    fastTime,
    slowTime,
    fastDone,
    slowDone,
    startRace,
    slowIframeRef,
    fastIframeRef,
  } = useRace();

  const handleNavigate = useCallback(
    (path: string) => {
      setActivePage(path);

      // Update both iframes
      if (slowIframeRef.current) {
        slowIframeRef.current.src = `${SLOW_URL}${path}`;
      }
      if (fastIframeRef.current) {
        fastIframeRef.current.src = `${FAST_URL}${path}`;
      }
    },
    [slowIframeRef, fastIframeRef],
  );

  // Listen for postMessage navigation events from iframes
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (!ALLOWED_ORIGINS.includes(event.origin)) return;
      if (event.data?.type !== "navigation") return;

      const path = event.data.path as string;
      if (!path) return;

      // Update active page
      const matchedPage = PAGES.find((p) => p.path === path);
      if (matchedPage) {
        setActivePage(path);
      }

      // Sync the other iframe
      if (event.origin === SLOW_URL && fastIframeRef.current) {
        fastIframeRef.current.src = `${FAST_URL}${path}`;
      } else if (event.origin === FAST_URL && slowIframeRef.current) {
        slowIframeRef.current.src = `${SLOW_URL}${path}`;
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [fastIframeRef, slowIframeRef]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        activePage={activePage}
        onNavigate={handleNavigate}
        onRace={startRace}
        raceDisabled={raceStatus !== "idle" && raceStatus !== "complete"}
      />

      <main className="flex-1 pt-14">
        <Hero />

        <ComparisonView
          activePage={activePage}
          slowUrl={SLOW_URL}
          fastUrl={FAST_URL}
          raceStatus={raceStatus}
          countdownText={countdownText}
          fastTime={fastTime}
          slowTime={slowTime}
          fastDone={fastDone}
          slowDone={slowDone}
          slowIframeRef={slowIframeRef}
          fastIframeRef={fastIframeRef}
        />

        <MetricsPanel />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}
```

- [ ] **Step 2: Create .env.local for local development**

Copy `.env.example` to `.env.local`. For local testing without the actual subdomains, you can point to localhost URLs or the deployed subdomains.

```bash
cp apps/comparison/.env.example apps/comparison/.env.local
```

- [ ] **Step 3: Run dev server and verify full page**

Run: `cd apps/comparison && npm run dev`
Expected: Full page renders — header, hero, comparison area (iframes may fail locally without the subdomains but the layout should be visible), metrics panel, CTA, footer. Race button triggers countdown overlay.

- [ ] **Step 4: Build check**

Run: `cd apps/comparison && npm run build`
Expected: Successful build with no TypeScript or lint errors.

- [ ] **Step 5: Commit**

```bash
git add apps/comparison/src/app/page.tsx
git commit -m "feat(comparison): compose full page with all components and navigation sync"
```

---

### Task 8: postMessage Broadcaster — Headless App

**Files:**
- Create: `apps/headless/src/components/PostMessageBroadcaster.tsx`
- Modify: `apps/headless/src/app/layout.tsx`

Add a client component to the headless app that broadcasts pathname changes to the parent window via `postMessage`.

- [ ] **Step 1: Check headless app layout.tsx**

Read `apps/headless/src/app/layout.tsx` to understand the current structure before modifying.

- [ ] **Step 2: Create PostMessageBroadcaster.tsx**

```tsx
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function PostMessageBroadcaster() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.parent !== window) {
      window.parent.postMessage(
        { type: "navigation", path: pathname },
        "https://speedtest.denverheadless.com",
      );
    }
  }, [pathname]);

  return null;
}
```

- [ ] **Step 3: Mount PostMessageBroadcaster in headless layout.tsx**

Add `<PostMessageBroadcaster />` inside the `<body>` of the headless app's root layout, alongside existing children. Import it at the top of the file.

- [ ] **Step 4: Build check**

Run: `cd apps/headless && npm run build`
Expected: Successful build.

- [ ] **Step 5: Commit**

```bash
git add apps/headless/src/components/PostMessageBroadcaster.tsx apps/headless/src/app/layout.tsx
git commit -m "feat(headless): add postMessage broadcaster for iframe nav sync"
```

---

### Task 9: postMessage Script — WordPress Theme

**Files:**
- Create: `wordpress/theme/assets/js/parent-notify.js`
- Modify: `wordpress/theme/functions.php`

Add a script to the WordPress theme that notifies the parent comparison app on page load.

- [ ] **Step 1: Check WordPress theme structure**

Read `wordpress/theme/functions.php` to understand existing enqueue patterns.

- [ ] **Step 2: Create parent-notify.js**

```js
// Notify parent comparison app of page navigation
(function () {
  if (window.parent !== window) {
    window.parent.postMessage(
      { type: "navigation", path: window.location.pathname },
      "https://speedtest.denverheadless.com"
    );
  }
})();
```

- [ ] **Step 3: Enqueue script in functions.php**

The theme may use a class-based loader pattern (`Theme::get_instance()->run()`). Check the existing architecture first. If class-based, add the enqueue to the existing Feature system or Loader. If using standalone `add_action` calls, add:

```php
function elevation_enqueue_parent_notify() {
    wp_enqueue_script(
        'parent-notify',
        get_template_directory_uri() . '/assets/js/parent-notify.js',
        array(),
        '1.0.0',
        true
    );
}
add_action('wp_enqueue_scripts', 'elevation_enqueue_parent_notify');
```

Follow whichever pattern the existing `functions.php` uses.

- [ ] **Step 4: Commit**

```bash
git add wordpress/theme/assets/js/parent-notify.js wordpress/theme/functions.php
git commit -m "feat(wordpress): add postMessage script for iframe nav sync"
```

---

### Task 10: Final Build Verification

**Files:**
- Any components needing adjustment based on build/lint results

- [ ] **Step 1: Run full build of comparison app**

Run: `cd apps/comparison && npm run build`
Expected: Successful build, no errors.

- [ ] **Step 2: Run lint**

Run: `cd apps/comparison && npm run lint`
Expected: No lint errors. Fix any issues found.

- [ ] **Step 3: Dev server smoke test**

Run: `cd apps/comparison && npm run dev`
Expected: Full page renders — header, hero, comparison area (iframes may show "Site unavailable" locally without the subdomains), metrics panel, CTA, footer. Race button triggers countdown overlay and timers.

- [ ] **Step 4: Commit any fixes**

```bash
git add -u
git commit -m "fix(comparison): resolve build and lint issues"
```

**Note:** Dockerfile creation is handled separately via the ops/deployment workflow. The `output: 'standalone'` config in `next.config.ts` (Task 1) prepares for Docker builds with `node:22-alpine`.
