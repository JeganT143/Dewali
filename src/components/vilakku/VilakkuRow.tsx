"use client";

import { useState } from "react";
import { SparkBurst } from "@/components/effects/SparkBurst";
import { FLAME_ANCHOR } from "@/lib/art/vilakku";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { VilakkuArt } from "./VilakkuArt";

const COUNT = 5;
// A gentle arc along the front of the kolam: outer lamps sit a little higher.
const LIFT = ["-0.9rem", "-0.15rem", "0.35rem", "-0.15rem", "-0.9rem"];

interface VilakkuRowProps {
  /** Shown (and interactive) only after the main vilakku is lit. */
  visible: boolean;
  onLightOne: (litCount: number, total: number) => void;
}

/**
 * Small agal vilakkus arranged on the kolam, as lamps are set out in rows at
 * Tamil doorsteps. Each is its own button with a small glow and spark burst.
 */
export function VilakkuRow({ visible, onLightOne }: VilakkuRowProps) {
  const [lit, setLit] = useState<boolean[]>(() => Array(COUNT).fill(false));
  const [bursts, setBursts] = useState<number[]>(() => Array(COUNT).fill(0));
  const reducedMotion = useReducedMotion();

  if (!visible) return null;

  const light = (i: number) => {
    if (!reducedMotion) setBursts((b) => b.map((n, j) => (j === i ? n + 1 : n)));
    if (lit[i]) return;
    const next = lit.map((v, j) => v || j === i);
    setLit(next);
    onLightOne(next.filter(Boolean).length, COUNT);
  };

  return (
    <ul aria-label="Little vilakkus on the kolam" className="flex w-full max-w-[26rem] lg:max-w-[30rem] items-end justify-between px-1">
      {lit.map((isLit, i) => (
        <li key={i} className="animate-rise-in" style={{ translate: `0 ${LIFT[i]}`, animationDelay: `${200 + i * 110}ms` }}>
          <button
            type="button"
            data-lit={isLit}
            aria-pressed={isLit}
            aria-label={`Light little vilakku ${i + 1} of ${COUNT}`}
            onClick={() => light(i)}
            className="group relative flex min-h-14 min-w-14 cursor-pointer items-end justify-center rounded-2xl p-1 outline-offset-2"
          >
            <span
              aria-hidden="true"
              className="vilakku-glow pointer-events-none absolute size-[180%] -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${i % 2 ? 100 - FLAME_ANCHOR.x : FLAME_ANCHOR.x}%`, top: `${FLAME_ANCHOR.y}%` }}
            >
              <span
                className="block size-full rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgb(255 224 130 / 0.55) 0%, rgb(255 201 40 / 0.2) 30%, rgb(232 117 24 / 0) 62%)",
                }}
              />
            </span>
            <span className="relative block transition-transform duration-200 group-hover:scale-110 group-active:scale-95">
              <VilakkuArt mirrored={i % 2 === 1} className="h-auto w-[clamp(52px,14vw,72px)]" />
              {bursts[i] > 0 && (
                <SparkBurst key={bursts[i]} size="small" x={i % 2 ? 100 - FLAME_ANCHOR.x : FLAME_ANCHOR.x} y={FLAME_ANCHOR.y - 8} />
              )}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
