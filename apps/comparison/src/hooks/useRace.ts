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
  startRace: (slowSrc: string, fastSrc: string) => void;
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

  // Timer loop — using ref to avoid stale closure in requestAnimationFrame
  const tickRef = useRef<() => void>(() => {});

  useEffect(() => {
    tickRef.current = () => {
      const elapsed = (performance.now() - startTimeRef.current) / 1000;

      if (!fastDoneRef.current) {
        setFastTime(parseFloat(elapsed.toFixed(1)));
      }
      if (!slowDoneRef.current) {
        setSlowTime(parseFloat(elapsed.toFixed(1)));
      }

      if (!fastDoneRef.current || !slowDoneRef.current) {
        rafRef.current = requestAnimationFrame(tickRef.current);
      } else {
        setRaceStatus("complete");
      }
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
    };
  }, []);

  // Caller passes current URLs because the iframes' src attributes are set
  // once on mount and never updated by React — fast soft-navs via postMessage,
  // which doesn't touch the src attribute, and the iframe is cross-origin so
  // contentWindow.location can't be read.
  const startRace = useCallback((slowSrc: string, fastSrc: string) => {
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
        if (slowIframeRef.current) slowIframeRef.current.src = slowSrc;
        if (fastIframeRef.current) fastIframeRef.current.src = fastSrc;

        // Start timer loop
        rafRef.current = requestAnimationFrame(tickRef.current);

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
  }, []);

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
