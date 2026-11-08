import { useId } from "react";

/*
 * Anchor points (percent of the art box) where the effects attach.
 * Keep in sync with the viewBox coordinates below.
 */
export const SPARKLER_TIP = { x: 50, y: (40 / 220) * 100 } as const;
export const FLOWER_POT_MOUTH = { x: 50, y: (116 / 200) * 100 } as const;

const SPECKLES = Array.from({ length: 22 }, (_, i) => ({
  x: 37.5 + ((i * 37) % 5),
  y: 44 + ((i * 53) % 92),
  r: 0.55 + ((i * 7) % 3) * 0.25,
}));

/** Kambi mathappu: a wire sparkler, coated along its upper half. */
export function SparklerArt({ className }: { className?: string }) {
  const coat = `${useId().replace(/:/g, "")}-coat`;
  return (
    <svg viewBox="0 0 80 220" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={coat} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#4A423B" />
          <stop offset="0.45" stopColor="#7C7166" />
          <stop offset="1" stopColor="#3E3731" />
        </linearGradient>
      </defs>
      {/* Bare wire, with a little hook where it is held. */}
      <path d="M40 34 L40 206 q0 7 -6 7" fill="none" stroke="#B8AEA3" strokeWidth="2.2" strokeLinecap="round" />
      <g className="crackers-coat">
        <rect x="36" y="40" width="8" height="100" rx="4" fill={`url(#${coat})`} />
        {SPECKLES.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#A69A8C" opacity="0.7" />
        ))}
      </g>
    </svg>
  );
}

const STRIPES = ["#E87518", "#FFC928", "#B8321A", "#FFF5DC", "#E87518", "#FFC928", "#B8321A"];

/** Poonthotti: the clay-and-paper cone that sends up a fountain of sparks. */
export function FlowerPotArt({ className }: { className?: string }) {
  const clip = `${useId().replace(/:/g, "")}-cone`;
  return (
    <svg viewBox="0 0 120 200" className={className} aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={clip}>
          <path d="M49 118 L71 118 L95 188 L25 188 Z" />
        </clipPath>
      </defs>
      <ellipse cx="60" cy="191" rx="42" ry="6" fill="#000" opacity="0.35" />
      <g clipPath={`url(#${clip})`}>
        {STRIPES.map((color, i) => (
          <rect key={i} x="20" y={118 + i * 10} width="80" height="10" fill={color} />
        ))}
        {/* Paper-wrap pattern: a row of little diamonds. */}
        {Array.from({ length: 7 }, (_, i) => (
          <path key={i} d={`M${33 + i * 9} 158 l3 -4 l3 4 l-3 4 Z`} fill="#3B1F0D" opacity="0.55" />
        ))}
        {/* Rounded shading so the cone reads as 3D. */}
        <path d="M49 118 L56 118 L44 188 L25 188 Z" fill="#000" opacity="0.18" />
        <path d="M64 118 L71 118 L95 188 L80 188 Z" fill="#000" opacity="0.28" />
        <path d="M57 118 L60 118 L58 188 L52 188 Z" fill="#fff" opacity="0.18" />
      </g>
      <path d="M49 118 L71 118 L95 188 L25 188 Z" fill="none" stroke="#3B1F0D" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Clay cap and fuse. */}
      <ellipse cx="60" cy="118" rx="12" ry="3.6" fill="#8A3A0B" stroke="#3B1F0D" strokeWidth="1" />
      <path d="M60 117 q2 -6 -1 -10" fill="none" stroke="#CDBFA8" strokeWidth="1.4" strokeLinecap="round" />
      <ellipse cx="60" cy="188" rx="35" ry="4" fill="#8A3A0B" stroke="#3B1F0D" strokeWidth="1" />
    </svg>
  );
}
