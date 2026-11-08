"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/**
 * Whether the browser offers the native share sheet. Detected after
 * hydration (server snapshot is `false`), so the button is never rendered
 * where it cannot work.
 */
export function useCanNativeShare(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => typeof navigator !== "undefined" && typeof navigator.share === "function",
    () => false,
  );
}
