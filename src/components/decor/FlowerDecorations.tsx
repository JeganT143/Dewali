import type { CSSProperties } from "react";
import { scallopPath } from "@/lib/art/shapes";

const PETAL_COLORS = ["#E87518", "#F28C28", "#FFC928", "#F28C28", "#E87518", "#FFE082"];

// Deterministic so server and client render the same markup.
const PETALS = Array.from({ length: 16 }, (_, i) => ({
  left: (i * 61 + 7) % 100,
  size: 9 + ((i * 7) % 7),
  duration: 5.5 + ((i * 13) % 30) / 10,
  delay: ((i * 37) % 22) / 10,
  sway: ((i * 41) % 120) - 60,
  spin: 240 + ((i * 53) % 360),
  color: PETAL_COLORS[i % PETAL_COLORS.length],
}));

/**
 * A single shower of marigold petals drifting down, played when `trigger`
 * changes (each value remounts the shower). Hidden with reduced motion.
 */
export function PetalShower({ trigger }: { trigger: number }) {
  if (trigger === 0) return null;
  return (
    <div key={trigger} aria-hidden="true" className="pointer-events-none fixed inset-0 z-20 overflow-hidden">
      {PETALS.map((p, i) => (
        <span
          key={i}
          className="petal absolute top-0"
          style={
            {
              left: `${p.left}%`,
              width: p.size,
              height: p.size * 1.35,
              background: `radial-gradient(circle at 35% 30%, #FFE082 0 12%, ${p.color} 55%)`,
              borderRadius: "60% 60% 60% 60% / 75% 75% 40% 40%",
              "--dur": `${p.duration}s`,
              "--delay": `${p.delay}s`,
              "--sway": `${p.sway}px`,
              "--spin": `${p.spin}deg`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

/** A small marigold (சாமந்தி) used as an ornament. */
export function Marigold({ className, size = 28 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="-20 -20 40 40" width={size} height={size} className={className} aria-hidden="true" focusable="false">
      <path d={scallopPath(0, 0, 17, 12)} fill="#E87518" />
      <path d={scallopPath(0, 0, 12.5, 10, 18)} fill="#F28C28" />
      <circle r="6.5" fill="#FFC928" />
      <circle r="2.4" fill="#9C4710" />
    </svg>
  );
}

/** Marigold, kolam dots and marigold: the divider used in the greeting. */
export function FlowerDivider() {
  return (
    <div aria-hidden="true" className="flex items-center justify-center gap-3">
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold/60 sm:w-24" />
      <Marigold size={22} />
      <span className="flex gap-1.5">
        <span className="size-1.5 rounded-full bg-gold/80" />
        <span className="size-1.5 rounded-full bg-gold" />
        <span className="size-1.5 rounded-full bg-gold/80" />
      </span>
      <Marigold size={22} />
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold/60 sm:w-24" />
    </div>
  );
}
