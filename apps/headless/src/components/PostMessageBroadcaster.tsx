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
