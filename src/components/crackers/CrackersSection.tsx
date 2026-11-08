"use client";

import { useEffect, useState } from "react";
import { LiveAnnouncer } from "@/components/ui/LiveAnnouncer";
import { buttonClass } from "@/components/ui/buttonStyles";
import { GREETING } from "@/lib/greeting";
import { FlowerPotArt, SparklerArt } from "./CrackerArt";
import { FlowerPotFountain, SparklerSpray } from "./CrackerEffects";
import "./crackers.css";

const CRACKERS = GREETING.crackers;
/** How long a sparkler or flower pot burns. Matches the 4s burn in crackers.css. */
const BURN_MS = 4000;

// Fixed star positions (percent) and twinkle offsets.
const STARS = [
  [6, 8, 0], [17, 22, 1.1], [29, 6, 2.3], [41, 15, 0.6], [55, 5, 1.8], [66, 19, 0.3], [78, 9, 2.7],
  [90, 17, 1.4], [12, 38, 2], [86, 36, 0.9], [4, 55, 1.6], [95, 58, 2.4], [24, 48, 0.4], [72, 44, 1.2],
] as const;

/** Keeps a cracker "burning" for BURN_MS, then lets it go out. */
function useBurn(): [boolean, (lit: boolean) => void] {
  const [lit, setLit] = useState(false);
  useEffect(() => {
    if (!lit) return;
    const t = window.setTimeout(() => setLit(false), BURN_MS);
    return () => window.clearTimeout(t);
  }, [lit]);
  return [lit, setLit];
}

/**
 * Moment 3: safe, silent, virtual crackers. A kambi mathappu and a
 * poonthotti to light, and a button that asks the page for fireworks.
 */
export function CrackersSection({ onFireworks }: { onFireworks: () => void }) {
  const [sparklerLit, setSparklerLit] = useBurn();
  const [potLit, setPotLit] = useBurn();
  const [celebrations, setCelebrations] = useState(0);

  const message = celebrations > 0 ? CRACKERS.messages[(celebrations - 1) % CRACKERS.messages.length] : null;
  const celebrate = () => setCelebrations((n) => n + 1);

  const toggle = (lit: boolean, setLit: (v: boolean) => void) => {
    setLit(!lit);
    if (!lit) celebrate();
  };

  const crackers = [
    {
      id: "sparkler",
      lit: sparklerLit,
      onClick: () => toggle(sparklerLit, setSparklerLit),
      label: CRACKERS.sparklerLabel,
      nameTa: CRACKERS.sparklerNameTa,
      art: <SparklerArt className="block h-auto w-full" />,
      effect: <SparklerSpray />,
      width: "w-[clamp(3.5rem,15vw,4.5rem)]",
    },
    {
      id: "flower-pot",
      lit: potLit,
      onClick: () => toggle(potLit, setPotLit),
      label: CRACKERS.flowerPotLabel,
      nameTa: CRACKERS.flowerPotNameTa,
      art: <FlowerPotArt className="block h-auto w-full" />,
      effect: <FlowerPotFountain />,
      width: "w-[clamp(6rem,27vw,8rem)]",
    },
  ];

  return (
    <section id="crackers" aria-labelledby="crackers-title" className="scroll-mt-6 px-4 py-10 sm:py-16">
      <div className="crackers-sky relative mx-auto max-w-3xl overflow-hidden rounded-[2rem] px-3 py-10 text-center ring-1 ring-gold/20 sm:px-10 sm:py-14">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {STARS.map(([x, y, delay], i) => (
            <span
              key={i}
              className="crackers-star absolute size-1 rounded-full bg-gold-soft"
              style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${delay}s` }}
            />
          ))}
        </div>

        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">{CRACKERS.eyebrow}</p>
          <h2
            id="crackers-title"
            className="mx-auto mt-3 max-w-xl text-balance px-2 font-display text-[clamp(1.75rem,6.4vw,2.7rem)] font-semibold leading-tight text-gold-soft"
          >
            {CRACKERS.heading}
          </h2>

          <ul className="mx-auto mt-8 grid max-w-lg grid-cols-2 gap-3 sm:gap-6">
            {crackers.map((c) => (
              <li key={c.id} className="flex">
                <button
                  type="button"
                  data-testid={c.id}
                  data-lit={c.lit}
                  aria-pressed={c.lit}
                  onClick={c.onClick}
                  className="group flex w-full cursor-pointer flex-col items-center justify-end rounded-3xl bg-cream/5 px-2 pb-4 pt-10ring-1 ring-inset ring-cream/10 transition-colors hover:bg-cream/10 hover:ring-gold/40 aria-pressed:ring-gold/50"
                >
                  <span className={`relative block ${c.width} transition-transform duration-200 group-active:scale-95`}>
                    {c.art}
                    {c.lit && c.effect}
                  </span>
                  <span lang="ta" className="mt-3 font-tamil text-base font-semibold text-gold-soft">
                    {c.nameTa}
                  </span>
                  <span className="mt-0.5 text-pretty text-xs leading-snug text-cream/75 sm:text-sm">{c.label}</span>
                </button>
              </li>
            ))}
          </ul>

          <button
            type="button"
            data-testid="fireworks-button"
            onClick={() => {
              onFireworks();
              celebrate();
            }}
            className={`${buttonClass("primary")} mt-8`}
          >
            <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true" focusable="false">
              <path
                d="M12 2v5M12 17v5M2 12h5M17 12h5M4.9 4.9l3.5 3.5M15.6 15.6l3.5 3.5M4.9 19.1l3.5-3.5M15.6 8.4l3.5-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            {CRACKERS.fireworksLabel}
          </button>

          <div className="mt-6 flex min-h-[4.5rem] items-center justify-center">
            {message && (
              <p
                key={celebrations}
                data-testid="crackers-message"
                className="crackers-message max-w-md text-pretty rounded-3xl bg-gold/10 px-5 py-3 font-display text-[clamp(1.2rem,4.6vw,1.5rem)] font-semibold leading-snug text-gold-soft ring-1 ring-inset ring-gold/30"
              >
                {message}
              </p>
            )}
          </div>

          <p className="mt-2 text-xs text-cream/65">{CRACKERS.safetyNote}</p>
        </div>
      </div>
      <LiveAnnouncer message={message ?? ""} />
    </section>
  );
}
