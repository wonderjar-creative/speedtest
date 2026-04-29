"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
  // Mirrors activePage for synchronous reads inside the postMessage handler,
  // which fires from a load event and would otherwise capture stale state.
  const activePageRef = useRef("/");
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
      activePageRef.current = path;
      setActivePage(path);

      // WP has no client-side router — full reload is its real behavior.
      if (slowIframeRef.current) {
        slowIframeRef.current.src = `${SLOW_URL}${path}`;
      }
      // Headless gets a soft router.push via postMessage — instant nav,
      // which is the whole point of the headless architecture.
      fastIframeRef.current?.contentWindow?.postMessage(
        { type: "navigate", path },
        FAST_URL,
      );
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

      // Dedupe: an iframe postMessages its path on every load, including the
      // initial load. Without this guard, slow's load triggers fast.src=same,
      // which reloads fast, which triggers slow.src=same — infinite ping-pong.
      if (path === activePageRef.current) return;

      const matchedPage = PAGES.find((p) => p.path === path);
      if (matchedPage) {
        activePageRef.current = path;
        setActivePage(path);
      }

      // Sync the other iframe. Slow has no client-side router, so a full
      // reload is its real behavior. Fast soft-navs via postMessage —
      // overwriting fast.src would force a full reload and defeat that.
      if (event.origin === SLOW_URL && fastIframeRef.current) {
        fastIframeRef.current.contentWindow?.postMessage(
          { type: "navigate", path },
          FAST_URL,
        );
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
        onRace={() =>
          startRace(`${SLOW_URL}${activePage}`, `${FAST_URL}${activePage}`)
        }
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
