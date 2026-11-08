"use client";

import { useState, type ComponentType } from "react";
import { SparkBurst } from "@/components/effects/SparkBurst";
import { LiveAnnouncer } from "@/components/ui/LiveAnnouncer";
import { GREETING, type PersonalityId } from "@/lib/greeting";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { SweetArt } from "../sweets/SweetArt";
import "./personality.css";

const PERSONALITY = GREETING.personality;

function SparkleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="size-full" aria-hidden="true" focusable="false">
      <path d="M24 4 C26 18 30 22 44 24 C30 26 26 30 24 44 C22 30 18 26 4 24 C18 22 22 18 24 4 Z" fill="#FFC928" />
      <path d="M24 13 C25 21 27 23 35 24 C27 25 25 27 24 35 C23 27 21 25 13 24 C21 23 23 21 24 13 Z" fill="#FFF5DC" />
      <path d="M39 6 l1.2 3.8 3.8 1.2 -3.8 1.2 -1.2 3.8 -1.2 -3.8 -3.8 -1.2 3.8 -1.2 Z" fill="#F28C28" />
      <circle cx="9" cy="40" r="2" fill="#F28C28" />
    </svg>
  );
}

/** Two agal vilakkus side by side: celebrating together. */
function TogetherIcon() {
  const lamp = (x: number) => (
    <g transform={`translate(${x} 5)`}>
      <path d="M6 8 C9 14 12 18 12 22 C12 26 0 26 0 22 C0 18 3 14 6 8 Z" fill="#FFC928" />
      <path d="M6 16 C8 19 9 21 9 23 C9 25.5 3 25.5 3 23 C3 21 4 19 6 16 Z" fill="#FFF5DC" />
      <path d="M-5 29 Q6 43 17 29 Z" fill="#E87518" />
      <path d="M-5 29 Q6 33 17 29" fill="none" stroke="#8A3A0B" strokeWidth="1.5" />
    </g>
  );
  return (
    <svg viewBox="0 0 48 48" className="size-full" aria-hidden="true" focusable="false">
      {lamp(6)}
      {lamp(30)}
    </svg>
  );
}

const ICONS: Record<PersonalityId, ComponentType> = {
  "sweet-lover": () => <SweetArt kind="laddu" className="size-full" />,
  "fireworks-fan": SparkleIcon,
  "family-person": TogetherIcon,
};

/** Moment 5: a light-hearted "which one are you?" with three answers. */
export function PersonalityPicker() {
  const reducedMotion = useReducedMotion();
  const [selected, setSelected] = useState<PersonalityId | null>(null);
  const [picks, setPicks] = useState(0);
  const option = PERSONALITY.options.find((o) => o.id === selected);

  const pick = (id: PersonalityId) => {
    setSelected(id);
    setPicks((n) => n + 1);
  };

  return (
    <section id="personality" aria-labelledby="personality-title" className="scroll-mt-6 px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">{PERSONALITY.eyebrow}</p>
        <h2
          id="personality-title"
          className="mt-3 text-balance font-display text-[clamp(1.75rem,6.4vw,2.7rem)] font-semibold leading-tight text-gold-soft"
        >
          {PERSONALITY.heading}
        </h2>

        <div role="group" aria-labelledby="personality-title" className="mt-8 grid grid-cols-3 gap-2 sm:gap-4">
          {PERSONALITY.options.map((o) => {
            const Icon = ICONS[o.id];
            return (
              <button
                key={o.id}
                type="button"
                aria-pressed={selected === o.id}
                onClick={() => pick(o.id)}
                className="group flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-3xl bg-cream/5 px-1.5 py-4 text-cream ring-1 ring-inset ring-cream/15 transition-[background-color,color,box-shadow] duration-200 hover:bg-cream/10 hover:ring-gold/50 aria-pressed:bg-gradient-to-b aria-pressed:from-gold aria-pressed:to-festival aria-pressed:text-brown aria-pressed:ring-gold-soft sm:px-3"
              >
                <span className="persona-icon block size-12 sm:size-14">
                  <Icon />
                </span>
                <span className="text-balance text-sm font-semibold leading-tight sm:text-base">{o.label}</span>
              </button>
            );
          })}
        </div>

        <div className="relative mt-6 flex min-h-20 items-center justify-center">
          {option && (
            <p
              key={`response-${picks}`}
              data-testid="personality-response"
              className="persona-pop max-w-md text-pretty font-display text-[clamp(1.25rem,4.8vw,1.6rem)] font-semibold leading-snug text-gold-soft"
            >
              {option.response}
            </p>
          )}
          {!reducedMotion && picks > 0 && <SparkBurst key={`burst-${picks}`} size="small" x={50} y={20} />}
        </div>
      </div>
      <LiveAnnouncer message={option?.response ?? ""} />
    </section>
  );
}
