import type { CSSProperties } from "react";
import { FLOWER_POT_MOUTH, SPARKLER_TIP } from "./CrackerArt";

const r1 = (n: number) => Math.round(n * 10) / 10;
const TONES = ["#FFF5DC", "#FFE082", "#FFC928", "#F28C28"];

// Deterministic (no Math.random) so server and client markup match.
const RAYS = Array.from({ length: 24 }, (_, i) => ({
  a: (i * 360) / 24 + ((i * 17) % 9) - 4,
  d: 24 + ((i * 31) % 30),
  len: 6 + ((i * 13) % 8),
  // Negative delays: the spray is already full the moment it is lit.
  delay: -((i * 97) % 560),
  color: TONES[i % 3],
}));

const FOUNTAIN = Array.from({ length: 30 }, (_, i) => {
  const angle = (((i * 47) % 56) - 28) * (Math.PI / 180);
  const d = 58 + ((i * 29) % 46);
  const x1 = Math.sin(angle) * d;
  const y1 = -Math.cos(angle) * d;
  return {
    x1: r1(x1),
    y1: r1(y1),
    // Sparks arc outward and fall back a little as they fade.
    x2: r1(x1 * 1.5),
    y2: r1(y1 * 0.7),
    size: 2.5 + (i % 3),
    dur: 900 + ((i * 61) % 500),
    delay: -((i * 113) % 1400),
    color: TONES[i % 4],
  };
});

/** Spark spray at the sparkler tip; the whole spray creeps down the wire as it burns. */
export function SparklerSpray() {
  return (
    <span aria-hidden="true" className="crackers-burn pointer-events-none absolute inset-0">
      <span className="absolute" style={{ left: `${SPARKLER_TIP.x}%`, top: `${SPARKLER_TIP.y}%` }}>
        <span className="crackers-glow absolute -left-7 -top-7 size-14 rounded-full" />
        {RAYS.map((r, i) => (
          <span
            key={i}
            className="crackers-ray absolute w-0.5 rounded-full"
            style={
              {
                "--a": `${r.a}deg`,
                "--d": `${r.d}px`,
                height: r.len,
                left: -1,
                top: -r.len,
                background: `linear-gradient(to top, transparent, ${r.color})`,
                animationDelay: `${r.delay}ms`,
              } as CSSProperties
            }
          />
        ))}
      </span>
    </span>
  );
}

/** A rising fountain of golden sparks from the mouth of the flower pot. */
export function FlowerPotFountain() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute"
      style={{ left: `${FLOWER_POT_MOUTH.x}%`, top: `${FLOWER_POT_MOUTH.y}%` }}
    >
      <span className="crackers-glow absolute -left-8 -top-10 size-16 rounded-full" />
      {FOUNTAIN.map((p, i) => (
        <span
          key={i}
          className="crackers-fount absolute rounded-full"
          style={
            {
              "--x1": `${p.x1}px`,
              "--y1": `${p.y1}px`,
              "--x2": `${p.x2}px`,
              "--y2": `${p.y2}px`,
              width: p.size,
              height: p.size,
              left: -p.size / 2,
              top: -p.size / 2,
              background: p.color,
              boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
              animationDuration: `${p.dur}ms`,
              animationDelay: `${p.delay}ms`,
            } as CSSProperties
          }
        />
      ))}
    </span>
  );
}
