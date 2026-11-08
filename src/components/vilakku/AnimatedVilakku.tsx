"use client";

import { Flame } from "lucide-react";
import { useState, type ReactNode } from "react";
import { KolamPattern } from "@/components/decor/KolamPattern";
import { LightRays } from "@/components/effects/LightRays";
import { SparkBurst } from "@/components/effects/SparkBurst";
import { FLAME_ANCHOR, FOOT_ANCHOR } from "@/lib/art/vilakku";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { VilakkuArt } from "./VilakkuArt";

interface AnimatedVilakkuProps {
  lit: boolean;
  onLight: () => void;
  /** Visible button text (and accessible name) before lighting. */
  label: string;
  /** Visible button text after lighting. */
  litLabel: string;
  /**
   * Drawn on the kolam in front of the main lamp (the small vilakkus). They
   * are separate buttons, so they sit in a reserved band between the lamp and
   * its label rather than inside the main button.
   */
  floor?: ReactNode;
}

/**
 * The signature interaction: one real <button> holding the agal vilakku and
 * its label. Lighting it ignites the flame, blooms the glow and rays, draws
 * the kolam beneath and bursts sparks. Pressing again replays the sparks.
 */
export function AnimatedVilakku({ lit, onLight, label, litLabel, floor }: AnimatedVilakkuProps) {
  const [burst, setBurst] = useState(0);
  const reducedMotion = useReducedMotion();

  const handleClick = () => {
    if (!reducedMotion) setBurst((n) => n + 1);
    onLight();
  };

  return (
    <div className="relative flex w-full flex-col items-center">
      <button
        type="button"
        onClick={handleClick}
        data-lit={lit}
        aria-pressed={lit}
        className="group relative flex cursor-pointer flex-col items-center rounded-[2rem] outline-offset-8"
      >
        <span className="relative block">
          {/* Kolam on the floor beneath the lamp, in perspective, centred on its foot. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute w-[min(165%,96vw)] -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${FOOT_ANCHOR.x}%`, top: `${FOOT_ANCHOR.y}%` }}
          >
            <span className="block" style={{ transform: "perspective(700px) rotateX(68deg)" }}>
              <KolamPattern className="w-full" />
            </span>
          </span>

          <LightRays lit={lit} x={FLAME_ANCHOR.x} y={FLAME_ANCHOR.y} />

          {/* Warm bloom around the flame. */}
          <span
            aria-hidden="true"
            className="vilakku-glow pointer-events-none absolute size-[115%] -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${FLAME_ANCHOR.x}%`, top: `${FLAME_ANCHOR.y}%` }}
          >
            <span
              className="vilakku-glow-breathe block size-full rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgb(255 245 220 / 0.6) 0%, rgb(255 224 130 / 0.42) 16%, rgb(255 201 40 / 0.18) 36%, rgb(232 117 24 / 0) 64%)",
              }}
            />
          </span>

          <span className="relative block transition-transform duration-300 ease-out group-hover:scale-[1.03] group-active:scale-[0.97]">
            <VilakkuArt className="h-auto w-[clamp(230px,66vw,320px)] drop-shadow-[0_22px_26px_rgb(0_0_0/0.5)]" />
            {burst > 0 && <SparkBurst key={burst} x={FLAME_ANCHOR.x} y={FLAME_ANCHOR.y - 6} />}
          </span>
        </span>

        {/* Reserved band where the small vilakkus stand (no layout shift when they appear). */}
        <span aria-hidden="true" className="block h-[5.75rem]" />

        <span
          className={`relative inline-flex min-h-11 items-center gap-2 rounded-full px-5 py-2 text-base font-semibold tracking-wide transition-colors duration-700 ${
            lit
              ? "bg-night/90 text-gold-soft ring-1 ring-gold/40"
              : "invite bg-gradient-to-r from-gold to-festival text-brown shadow-[0_8px_30px_rgb(242_140_40/0.4)] group-hover:from-gold-soft group-hover:to-gold"
          }`}
        >
          <Flame aria-hidden="true" className="size-4" strokeWidth={2.4} />
          {lit ? litLabel : label}
        </span>
      </button>

      {floor && <div className="absolute inset-x-0 bottom-[3.4rem] flex h-[5.75rem] justify-center">{floor}</div>}
    </div>
  );
}
