"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const PARENT_ORIGIN = "https://speedtest.denverheadless.com";

export default function NavigationListener() {
  const router = useRouter();

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.origin !== PARENT_ORIGIN) return;
      if (event.data?.type !== "navigate") return;
      const path = event.data.path;
      if (typeof path !== "string") return;
      router.push(path);
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [router]);

  return null;
}
