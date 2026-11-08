import type { CSSProperties } from "react";

function makeSparks(count: number, reach: number) {
  return Array.from({ length: count }, (_, i) => {
    // Deterministic spread, mostly upward, with a little jitter.
    const angle = -115 + (i * 230) / (count - 1) + ((i * 37) % 11) - 5;
    const distance = reach * (0.55 + ((i * 53) % 45) / 100);
    const size = 2.5 + ((i * 29) % 4);
    const color = i % 3 === 0 ? "#FFF5DC" : i % 3 === 1 ? "#FFC928" : "#F28C28";
    return { angle, distance, size, color, delay: (i % 4) * 35 };
  });
}

const LARGE = makeSparks(18, 130);
const SMALL = makeSparks(10, 60);

interface SparkBurstProps {
  /** Origin as a percentage of the positioned parent. */
  x: number;
  y: number;
  size?: "large" | "small";
}

/** A one-shot burst of golden sparks. Change its `key` to replay. */
export function SparkBurst({ x, y, size = "large" }: SparkBurstProps) {
  const sparks = size === "large" ? LARGE : SMALL;
  return (
    <span aria-hidden="true" className="pointer-events-none absolute" style={{ left: `${x}%`, top: `${y}%` }}>
      {sparks.map((s, i) => (
        <span
          key={i}
          className="spark absolute rounded-full"
          style={
            {
              "--a": `${s.angle}deg`,
              "--d": `${s.distance}px`,
              width: s.size,
              height: s.size,
              left: -s.size / 2,
              top: -s.size / 2,
              background: s.color,
              boxShadow: `0 0 ${s.size * 2}px ${s.color}`,
              animationDelay: `${s.delay}ms`,
            } as CSSProperties
          }
        />
      ))}
    </span>
  );
}
