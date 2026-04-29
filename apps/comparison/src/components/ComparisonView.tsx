"use client";

import { useEffect, useState } from "react";
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

  // Iframe srcs are captured once on mount. Subsequent navigation is driven
  // imperatively (slow: direct .src write; fast: postMessage → router.push).
  // Binding src to activePage forces React to re-set the src attribute on
  // every state change, which triggers a full reload of the fast iframe and
  // defeats its soft-nav optimization.
  const [initialSlowSrc] = useState(() => `${slowUrl}${activePage}`);
  const [initialFastSrc] = useState(() => `${fastUrl}${activePage}`);

  // Auto-fade race timers 5 seconds after race completes.
  // The synchronous setState on non-complete is intentional — it resets
  // overlay visibility when a new race starts (countdown/racing).
  useEffect(() => {
    if (raceStatus === "complete") {
      const timer = setTimeout(() => setOverlayHidden(true), 5000);
      return () => clearTimeout(timer);
    }
    setOverlayHidden(false); // eslint-disable-line react-hooks/set-state-in-effect
  }, [raceStatus]);

  return (
    <section id="comparison" className="px-4 pb-2 scroll-mt-14">
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
                src={initialSlowSrc}
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
                src={initialFastSrc}
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
