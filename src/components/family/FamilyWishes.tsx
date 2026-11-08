import type { CSSProperties } from "react";
import { VilakkuArt } from "@/components/vilakku/VilakkuArt";
import { scallopPath } from "@/lib/art/shapes";
import { FLAME_ANCHOR } from "@/lib/art/vilakku";
import { GREETING } from "@/lib/greeting";
import "./family.css";

/* ------------------------------------------------------------------ *
 * Marigold garland: heads strung along a gentle swag, as hung over a
 * doorway. Positions are computed once, deterministically.
 * ------------------------------------------------------------------ */
const SWAG = { x0: 10, y0: 8, cx: 180, cy: 64, x1: 350, y1: 8 };
const HEAD_COLORS = ["#E87518", "#FFC928", "#F28C28"];
const r1 = (n: number) => Math.round(n * 10) / 10;

const GARLAND_HEADS = Array.from({ length: 15 }, (_, i) => {
  const t = i / 14;
  const u = 1 - t;
  return {
    x: r1(u * u * SWAG.x0 + 2 * u * t * SWAG.cx + t * t * SWAG.x1),
    y: r1(u * u * SWAG.y0 + 2 * u * t * SWAG.cy + t * t * SWAG.y1),
    r: i % 2 ? 6.2 : 7.6,
    color: HEAD_COLORS[i % HEAD_COLORS.length],
  };
});

// Short strands hanging from each end of the swag.
const TASSELS = [SWAG.x0, SWAG.x1].flatMap((x) =>
  [20, 32, 43].map((y, j) => ({ x, y, r: 6 - j * 1.2, color: HEAD_COLORS[(j + 1) % HEAD_COLORS.length] })),
);

function MarigoldGarland({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 360 58" className={className} aria-hidden="true" focusable="false">
      <path
        d={`M${SWAG.x0} ${SWAG.y0} Q${SWAG.cx} ${SWAG.cy} ${SWAG.x1} ${SWAG.y1}`}
        fill="none"
        stroke="#FFE082"
        strokeOpacity=".45"
        strokeWidth="1.2"
      />
      {[SWAG.x0, SWAG.x1].map((x) => (
        <line key={x} x1={x} y1={SWAG.y0} x2={x} y2={46} stroke="#FFE082" strokeOpacity=".4" strokeWidth="1" />
      ))}
      {[...TASSELS, ...GARLAND_HEADS].map((h, i) => (
        <g key={i}>
          <path d={scallopPath(h.x, h.y, h.r, 10)} fill={h.color} />
          <circle cx={h.x} cy={h.y} r={r1(h.r * 0.55)} fill="#FFE082" fillOpacity=".55" />
          <circle cx={h.x} cy={h.y} r={r1(h.r * 0.22)} fill="#9C4710" />
        </g>
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ *
 * A row of lit agal vilakkus on the doorstep. The centre lamp is lit
 * first and the light spreads outwards.
 * ------------------------------------------------------------------ */
const LAMPS = [
  { width: "w-10 sm:w-14", lift: "-0.55rem", delay: 560, mirrored: false },
  { width: "w-12 sm:w-16", lift: "-0.15rem", delay: 280, mirrored: true },
  { width: "w-16 sm:w-20", lift: "0.2rem", delay: 0, mirrored: false },
  { width: "w-12 sm:w-16", lift: "-0.15rem", delay: 280, mirrored: true },
  { width: "w-10 sm:w-14", lift: "-0.55rem", delay: 560, mirrored: false },
];

function LampRow() {
  return (
    <div aria-hidden="true" className="relative mx-auto mt-12 max-w-md sm:mt-16">
      {/* Light pooling on the ground beneath the lamps. */}
      <div
        className="family-ground pointer-events-none absolute inset-x-0 bottom-0 h-20 translate-y-1/2"
        style={{ background: "radial-gradient(50% 50% at 50% 50%, rgb(255 201 40 / 0.32), rgb(232 117 24 / 0.1) 55%, transparent 80%)" }}
      />
      <ul data-lit="true" className="family-lamps relative flex items-end justify-center gap-3 sm:gap-7">
        {LAMPS.map((lamp, i) => (
          <li
            key={i}
            className={`relative ${lamp.width}`}
            style={{ translate: `0 ${lamp.lift}`, "--ignite-delay": `${lamp.delay}ms` } as CSSProperties}
          >
            <span
              className="family-lamp-glow pointer-events-none absolute size-[260%] -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${lamp.mirrored ? 100 - FLAME_ANCHOR.x : FLAME_ANCHOR.x}%`, top: `${FLAME_ANCHOR.y}%` }}
            >
              <span
                className="block size-full rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgb(255 224 130 / 0.5) 0%, rgb(255 201 40 / 0.18) 28%, rgb(232 117 24 / 0) 60%)",
                }}
              />
            </span>
            <VilakkuArt className="relative block h-auto w-full" mirrored={lamp.mirrored} />
          </li>
        ))}
      </ul>
      <div className="mx-auto mt-3 h-px w-4/5 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
    </div>
  );
}

/** Splits the heading after its first sentence so the second can carry the emphasis. */
function splitHeading(text: string): [string, string] | null {
  const i = text.indexOf(". ");
  return i === -1 ? null : [text.slice(0, i + 1), text.slice(i + 2)];
}

/** Moment 4: the people we celebrate with. Calm, warm and golden. */
export function FamilyWishes() {
  const { eyebrow, heading, message } = GREETING.family;
  const parts = splitHeading(heading);

  return (
    <section id="family" aria-labelledby="family-title" className="relative isolate scroll-mt-6 px-4 py-14 text-center sm:py-24">
      {/* Soft golden light rising from the lamps. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(70% 55% at 50% 82%, rgb(255 201 40 / 0.16), rgb(232 117 24 / 0.07) 50%, transparent 78%), radial-gradient(60% 35% at 50% 0%, rgb(255 224 130 / 0.07), transparent 70%)",
        }}
      />

      <MarigoldGarland className="mx-auto block h-auto w-full max-w-xs sm:max-w-md" />

      <p className="mt-8 font-sans text-xs font-semibold uppercase tracking-[0.28em] text-gold/80">{eyebrow}</p>

      <h2 id="family-title" className="mx-auto mt-4 max-w-3xl text-balance font-display">
        {parts ? (
          <>
            <span className="block text-[clamp(1.3rem,4.8vw,1.9rem)] font-medium italic leading-snug text-cream/80">
              {parts[0]}
            </span>{" "}
            <span className="mt-3 block text-[clamp(2rem,7.6vw,3.5rem)] font-semibold leading-[1.1] text-gold-soft">
              {parts[1]}
            </span>
          </>
        ) : (
          <span className="block text-[clamp(1.9rem,7vw,3.25rem)] font-semibold leading-[1.12] text-gold-soft">{heading}</span>
        )}
      </h2>

      <p className="mx-auto mt-6 max-w-xl text-pretty font-display text-[clamp(1.15rem,4.2vw,1.45rem)] leading-relaxed text-cream/90">
        {message}
      </p>

      <LampRow />
    </section>
  );
}
