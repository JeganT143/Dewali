"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/** window.location.origin after hydration; empty string during server render. */
export function useOrigin(): string {
  return useSyncExternalStore(
    noopSubscribe,
    () => window.location.origin,
    () => "",
  );
}
