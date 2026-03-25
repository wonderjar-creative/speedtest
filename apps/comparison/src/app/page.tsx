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
