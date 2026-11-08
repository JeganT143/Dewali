"use client";

import { useEffect } from "react";

/**
 * Marks <html data-page-hidden> while the tab is in the background, which
 * pauses every CSS animation (see globals.css). Canvas effects check
 * document.hidden themselves.
 */
export function usePageVisibility() {
  useEffect(() => {
    const root = document.documentElement;
    const sync = () => root.toggleAttribute("data-page-hidden", document.hidden);
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => {
      document.removeEventListener("visibilitychange", sync);
      root.removeAttribute("data-page-hidden");
    };
  }, []);
}
