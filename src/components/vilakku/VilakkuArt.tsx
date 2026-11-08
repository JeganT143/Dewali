import { useId } from "react";
import { VILAKKU } from "@/lib/art/vilakku";
import { FlameAnimation } from "./FlameAnimation";

/**
 * Traditional Tamil agal vilakku as inline SVG. Purely decorative: the
 * wrapping button provides the accessible name and state.
 */
export function VilakkuArt({ className, mirrored = false }: { className?: string; mirrored?: boolean }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const { paths: p, colors: c, viewBox: vb, shadow: s } = VILAKKU;
  const [fx, fy] = VILAKKU.flameBase;
  const ref = (name: string) => `url(#${id}-${name})`;

  return (
    <svg
      viewBox={`${vb.x} ${vb.y} ${vb.width} ${vb.height}`}
      className={className}
      style={mirrored ? { transform: "scaleX(-1)" } : undefined}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`${id}-rim`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={c.rimFrom} />
          <stop offset="1" stopColor={c.rimTo} />
        </linearGradient>
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c.bodyTop} />
          <stop offset=".55" stopColor={c.bodyMid} />
          <stop offset="1" stopColor={c.bodyBottom} />
        </linearGradient>
        <linearGradient id={`${id}-oil`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c.oilFrom} />
          <stop offset="1" stopColor={c.oilTo} />
        </linearGradient>
        <radialGradient id={`${id}-warm`} cx={fx} cy={fy} r="120" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFE082" stopOpacity=".75" />
          <stop offset="1" stopColor="#FFC928" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx={s.cx} cy={s.cy} rx={s.rx} ry={s.ry} fill="#000" fillOpacity=".38" />
      <path d={p.foot} fill={c.foot} />
      <path d={p.body} fill={ref("body")} />
      <path d={p.band} fill="none" stroke={c.paint} strokeWidth="1.6" strokeOpacity=".7" />
      {VILAKKU.bandDots.map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="2.6" fill={c.paint} />
      ))}
      <path d={p.rim} fill={ref("rim")} stroke={c.paint} strokeOpacity=".55" strokeWidth="1.2" />
      <path d={p.oil} fill={ref("oil")} />
      {/* Firelight on the oil and clay once lit. */}
      <path className="vilakku-warmth" d={p.rim} fill={ref("warm")} />
      <path d={p.wick} fill="none" stroke={c.wick} strokeWidth="5" strokeLinecap="round" />

      <FlameAnimation
        x={fx}
        y={fy}
        scale={VILAKKU.flameScale}
        idPrefix={id}
        colors={{ outerFrom: c.flameOuterFrom, outerTo: c.flameOuterTo, mid: c.flameMid, midTo: c.flameMidTo, core: c.flameCore }}
      />
    </svg>
  );
}
