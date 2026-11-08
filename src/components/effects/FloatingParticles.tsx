import type { CSSProperties } from "react";

// Deterministic layout so server and client render identically.
const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  left: (i * 47 + 13) % 100,
  size: 2 + ((i * 7) % 4),
  duration: 11 + ((i * 13) % 10),
  delay: -((i * 1.7) % 16),
  sway: ((i * 29) % 60) - 30,
  peak: 0.35 + ((i * 11) % 6) / 10,
}));

/** Embers drifting upward. CSS-only; hidden entirely with reduced motion. */
export function FloatingParticles({ lit }: { lit: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 overflow-hidden transition-opacity duration-[1500ms] motion-reduce:hidden ${
        lit ? "opacity-100" : "opacity-40"
      }`}
    >
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="particle absolute bottom-[-10px] rounded-full bg-gold"
          style={
            {
              left: `${p.left}%`,
              width: p.size,
              height: p.size,
              boxShadow: `0 0 ${p.size * 3}px rgb(255 201 40 / 0.8)`,
              "--dur": `${p.duration}s`,
              "--delay": `${p.delay}s`,
              "--sway": `${p.sway}px`,
              "--peak": p.peak,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
