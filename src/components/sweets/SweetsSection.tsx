"use client";

import { useState } from "react";
import { Marigold } from "@/components/decor/FlowerDecorations";
import { SparkBurst } from "@/components/effects/SparkBurst";
import { LiveAnnouncer } from "@/components/ui/LiveAnnouncer";
import { GREETING } from "@/lib/greeting";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { SweetArt } from "./SweetArt";
import "./sweets.css";

const SWEETS = GREETING.sweets;
const ITEMS = SWEETS.items;

/**
 * Moment 2: a brass platter of traditional sweets. Tap one to take a bite
 * and hear what it has to say; taste all five to become the champion.
 */
export function SweetsSection() {
  const reducedMotion = useReducedMotion();
  const [tasted, setTasted] = useState<boolean[]>(() => ITEMS.map(() => false));
  // Per-sweet tap counts: used as keys so the chomp animation replays on every tap.
  const [taps, setTaps] = useState<number[]>(() => ITEMS.map(() => 0));
  const [active, setActive] = useState<number | null>(null);

  const allTasted = tasted.every(Boolean);
  const totalTaps = taps.reduce((sum, n) => sum + n, 0);
  const current = active === null ? null : ITEMS[active];
  const announcement = current ? `${current.name}: ${current.message}${allTasted ? ` ${SWEETS.allTasted}` : ""}` : "";

  const taste = (i: number) => {
    setTasted((t) => t.map((v, j) => v || j === i));
    setTaps((t) => t.map((n, j) => (j === i ? n + 1 : n)));
    setActive(i);
  };

  return (
    <section id="sweets" aria-labelledby="sweets-title" className="scroll-mt-6 px-4 py-10 sm:py-16">
      <div className="sweets-panel relative mx-auto max-w-3xl overflow-hidden rounded-[2rem] px-3 py-10 text-center text-brown sm:px-10 sm:py-14">
        <Marigold className="absolute left-4 top-4" size={26} />
        <Marigold className="absolute right-4 top-4" size={26} />

        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-ember">{SWEETS.eyebrow}</p>
        <h2
          id="sweets-title"
          className="mx-auto mt-3 max-w-xl text-balance px-2 font-display text-[clamp(1.75rem,6.4vw,2.7rem)] font-semibold leading-tight"
        >
          {SWEETS.heading}
        </h2>
        <p lang="ta" className="mx-auto mt-3 max-w-xl text-pretty px-2 font-tamil text-[clamp(0.98rem,3.9vw,1.2rem)] text-ember">
          {SWEETS.headingTa}
        </p>
        <p className="mt-4 text-sm font-medium text-brown/80">{SWEETS.hint}</p>

        <ul
          aria-label="Plate of Deepavali sweets"
          className="sweets-platter mx-auto mt-6 flex max-w-2xl flex-wrap justify-center gap-y-2 rounded-[2.25rem] px-2 py-6 sm:rounded-full sm:px-8 sm:py-8"
        >
          {ITEMS.map((item, i) => (
            <li key={item.id} className="flex w-1/3 justify-center sm:w-1/5">
              <button
                type="button"
                data-testid={`sweet-${item.id}`}
                aria-pressed={tasted[i]}
                onClick={() => taste(i)}
                className="group flex min-h-11 w-full max-w-[7.5rem] cursor-pointer flex-col items-center rounded-2xl px-1 pb-1.5 pt-1"
              >
                <span className="relative block w-[clamp(4.25rem,22vw,6.25rem)] transition-transform duration-200 group-hover:-translate-y-1 group-active:scale-95">
                  <span key={taps[i]} className={`block ${taps[i] > 0 ? "sweets-chomp" : ""}`}>
                    <SweetArt kind={item.id} bitten={tasted[i]} className="block h-auto w-full" />
                  </span>
                  {!reducedMotion && taps[i] > 0 && <SparkBurst key={`burst-${taps[i]}`} size="small" x={50} y={40} />}
                </span>
                <span className="mt-1 text-sm font-semibold leading-tight">
                  <span className="sr-only">Taste the </span>
                  {item.name}
                </span>
                <span lang="ta" className="font-tamil text-xs text-brown/75">
                  {item.nameTa}
                </span>
              </button>
            </li>
          ))}
        </ul>

        {/* Reserved space keeps the platter from jumping when the first message appears. */}
        <div className="mt-6 flex min-h-[7.5rem] items-start justify-center px-1">
          {current && (
            <div
              key={totalTaps}
              data-testid="sweet-message"
              className="sweets-bubble relative max-w-md rounded-3xl bg-brown px-5 py-4 text-cream shadow-[0_14px_30px_-12px_rgb(59_31_13/0.7)]"
            >
              <p className="text-pretty font-display text-[clamp(1.2rem,4.6vw,1.5rem)] font-semibold leading-snug">
                {current.message}
              </p>
              {allTasted && <p className="mt-2 text-sm font-semibold text-gold">{SWEETS.allTasted}</p>}
            </div>
          )}
        </div>
      </div>
      <LiveAnnouncer message={announcement} />
    </section>
  );
}
