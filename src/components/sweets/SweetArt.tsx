import { useId } from "react";
import { circlePath, polar, scallopPath } from "@/lib/art/shapes";
import type { SweetId } from "@/lib/greeting";

/* ------------------------------------------------------------------ *
 * Geometry is computed once at module load; every sweet uses a
 * 100 x 100 viewBox and sits on its own soft shadow.
 * ------------------------------------------------------------------ */

// Laddu: tiny boondi pearls packed on a golden-angle spiral.
const BOONDI = Array.from({ length: 72 }, (_, i) => {
  const [x, y] = polar(30 * Math.sqrt((i + 0.5) / 72), i * 137.508, 50, 55);
  return { x, y, r: 2.3 + ((i * 7) % 3) * 0.35, tone: i % 3 };
});
const BOONDI_TONES = ["#FFD766", "#F5A12E", "#DD7A16"];

// Adhirasam: sesame seeds scattered over the glossy top.
const SESAME = Array.from({ length: 9 }, (_, i) => {
  const [x, y] = polar(10 + ((i * 11) % 19), i * 41 + 12, 50, 52);
  return { x, y: 52 + (y - 52) * 0.6, rot: (i * 47) % 180 };
});

// Mysore Pak: pores on each face of the block.
const PORES = [
  [26, 52, 2.2], [32, 62, 1.6], [24, 63, 1.3], [35, 72, 2], [28, 72, 1.4], [31, 55, 1.2],
  [50, 67, 2], [58, 61, 1.5], [66, 58, 2.2], [74, 55, 1.4], [55, 73, 1.6], [70, 66, 1.8], [62, 70, 1.2], [78, 63, 1.3],
  [40, 41, 1.5], [52, 37, 1.3], [62, 43, 1.7], [48, 47, 1.2], [70, 46, 1.1], [34, 45, 1.1],
] as const;

// Murukku: an Archimedean spiral, the way the dough is pressed onto the cloth.
const MURUKKU = (() => {
  const turns = 3.2;
  const steps = 180;
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * turns * 2 * Math.PI;
    const r = 3 + t * 1.45;
    const x = Math.round((50 + r * Math.cos(t)) * 100) / 100;
    const y = Math.round((52 + r * Math.sin(t)) * 100) / 100;
    d += `${i === 0 ? "M" : " L"}${x} ${y}`;
  }
  return d;
})();

// Jangiri: a ring with a crown of small loops.
const JANGIRI = [
  circlePath(50, 52, 12.5),
  ...Array.from({ length: 9 }, (_, i) => {
    const [x, y] = polar(24, i * 40, 50, 52);
    return circlePath(x, y, 8);
  }),
].join(" ");

interface SweetArtProps {
  kind: SweetId;
  /** Show a bite taken out of the sweet. */
  bitten?: boolean;
  className?: string;
}

/** Hand-drawn traditional Deepavali sweets. Decorative: the button carries the name. */
export function SweetArt({ kind, bitten = false, className }: SweetArtProps) {
  const uid = useId().replace(/:/g, "");
  const id = (name: string) => `${uid}-${name}`;
  const mask = bitten ? `url(#${id("bite")})` : undefined;

  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" focusable="false">
      <defs>
        <mask id={id("bite")} maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
          <rect width="100" height="100" fill="#fff" />
          {/* A scalloped bite from the upper right. */}
          <circle cx="80" cy="24" r="12" fill="#000" />
          <circle cx="89" cy="37" r="9.5" fill="#000" />
          <circle cx="68" cy="15" r="9" fill="#000" />
        </mask>
        <radialGradient id={id("laddu")} cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor="#FFD45C" />
          <stop offset="0.55" stopColor="#F29A26" />
          <stop offset="1" stopColor="#B8590F" />
        </radialGradient>
        <radialGradient id={id("shade")} cx="40%" cy="35%" r="65%">
          <stop offset="0.55" stopColor="#7A3A0B" stopOpacity="0" />
          <stop offset="1" stopColor="#7A3A0B" stopOpacity="0.55" />
        </radialGradient>
        <radialGradient id={id("adhi")} cx="42%" cy="35%" r="70%">
          <stop offset="0" stopColor="#9C5420" />
          <stop offset="0.6" stopColor="#6E3410" />
          <stop offset="1" stopColor="#4A220A" />
        </radialGradient>
        <linearGradient id={id("pak")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFE08A" />
          <stop offset="1" stopColor="#F6B839" />
        </linearGradient>
      </defs>

      <ellipse cx="50" cy="90" rx="34" ry="5.5" fill="#3B1F0D" opacity="0.28" />

      <g mask={mask}>
        {kind === "laddu" && (
          <g>
            <circle cx="50" cy="55" r="33" fill={`url(#${id("laddu")})`} stroke="#8A3A0B" strokeWidth="1.2" />
            {BOONDI.map((b, i) => (
              <circle key={i} cx={b.x} cy={b.y} r={b.r} fill={BOONDI_TONES[b.tone]} opacity="0.85" />
            ))}
            <circle cx="50" cy="55" r="33" fill={`url(#${id("shade")})`} />
            {/* A cashew and a raisin pressed into the ball. */}
            <path d="M55 33 q7 -2 9 4 q-3 -2 -6 0 q-3 1 -3 -4z" fill="#FFF0C8" stroke="#C98A3A" strokeWidth="0.6" />
            <ellipse cx="38" cy="66" rx="3" ry="2.2" fill="#6B1E12" />
            <ellipse cx="39" cy="38" rx="9" ry="5" fill="#FFF5DC" opacity="0.4" transform="rotate(-30 39 38)" />
          </g>
        )}

        {kind === "adhirasam" && (
          <g>
            <ellipse cx="50" cy="59" rx="38" ry="23" fill="#3E1B07" />
            <g transform="translate(50 53) scale(1 0.6)">
              <path d={scallopPath(0, 0, 37, 24)} fill={`url(#${id("adhi")})`} stroke="#3E1B07" strokeWidth="1.6" />
              <circle r="27" fill="none" stroke="#3E1B07" strokeOpacity="0.35" strokeWidth="1.2" />
              <circle r="9" fill="#4A220A" />
            </g>
            {/* Jaggery gloss. */}
            <path d="M24 46 q14 -12 36 -11" fill="none" stroke="#FFE0A8" strokeOpacity="0.55" strokeWidth="2.6" strokeLinecap="round" />
            <path d="M66 63 q9 -3 13 -8" fill="none" stroke="#FFE0A8" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" />
            {SESAME.map((s, i) => (
              <ellipse key={i} cx={s.x} cy={s.y} rx="1.9" ry="1" fill="#FFF0D0" transform={`rotate(${s.rot} ${s.x} ${s.y})`} />
            ))}
          </g>
        )}

        {kind === "mysore-pak" && (
          <g strokeLinejoin="round">
            <path d="M18 44 L42 57 L42 83 L18 70 Z" fill="#EFA42C" stroke="#A85B14" strokeWidth="1.2" />
            <path d="M42 57 L84 45 L84 71 L42 83 Z" fill="#D98A1E" stroke="#A85B14" strokeWidth="1.2" />
            <path d="M18 44 L60 32 L84 45 L42 57 Z" fill={`url(#${id("pak")})`} stroke="#A85B14" strokeWidth="1.2" />
            {/* The darker roasted crust along the top edges. */}
            <path d="M19 45 L42 58 L83 46" fill="none" stroke="#C9781B" strokeWidth="2" opacity="0.7" />
            {PORES.map(([x, y, r], i) => (
              <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.75} fill="#B4651A" opacity="0.55" />
            ))}
            <path d="M30 43 L56 36" stroke="#FFF5DC" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}

        {kind === "murukku" && (
          <g fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d={MURUKKU} stroke="#7A4410" strokeWidth="9.5" />
            <path d={MURUKKU} stroke="#D29A4C" strokeWidth="7.5" />
            {/* Star-nozzle ridges. */}
            <path d={MURUKKU} stroke="#8F5418" strokeOpacity="0.55" strokeWidth="7.5" strokeDasharray="1.1 2.4" strokeLinecap="butt" />
            <path d={MURUKKU} stroke="#F6D594" strokeOpacity="0.75" strokeWidth="1.6" />
          </g>
        )}

        {kind === "jangiri" && (
          <g fill="none" strokeLinecap="round">
            <path d={JANGIRI} stroke="#9C2F0A" strokeWidth="8.5" />
            <path d={JANGIRI} stroke="#EE6A1E" strokeWidth="6.5" />
            <path d={JANGIRI} stroke="#C4470F" strokeOpacity="0.45" strokeWidth="6.5" strokeDasharray="1.2 2.6" strokeLinecap="butt" />
            {/* Sugar syrup shine. */}
            <path d={JANGIRI} stroke="#FFC27A" strokeOpacity="0.85" strokeWidth="1.5" />
            <circle cx="50" cy="52" r="5" fill="#FFB347" opacity="0.5" />
          </g>
        )}
      </g>

      {/* Crumbs where the bite was. */}
      {bitten && (
        <g fill={kind === "adhirasam" ? "#6E3410" : kind === "jangiri" ? "#EE6A1E" : "#E9A23A"}>
          <circle cx="86" cy="52" r="1.6" />
          <circle cx="91" cy="58" r="1.1" />
          <circle cx="82" cy="60" r="1.2" />
        </g>
      )}
    </svg>
  );
}
