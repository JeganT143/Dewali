import { FLAME_PATHS } from "@/lib/art/vilakku";

interface FlameAnimationProps {
  /** Flame base in SVG user units. */
  x: number;
  y: number;
  scale: number;
  /** Unique gradient id prefix (one per SVG). */
  idPrefix: string;
  colors: { outerFrom: string; outerTo: string; mid: string; midTo: string; core: string };
}

/**
 * Three flame layers inside two flicker groups with different periods, so the
 * movement never looks mechanical. Positioning uses the SVG transform
 * attribute on the outer group; CSS animates only the inner groups (a CSS
 * transform would otherwise override the positioning). Ignition and flicker
 * are driven by data-lit on an ancestor (see globals.css).
 */
export function FlameAnimation({ x, y, scale, idPrefix, colors }: FlameAnimationProps) {
  const outer = `${idPrefix}-flame-outer`;
  const mid = `${idPrefix}-flame-mid`;
  const ember = `${idPrefix}-ember`;
  return (
    <>
      <defs>
        <linearGradient id={outer} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor={colors.outerFrom} />
          <stop offset="1" stopColor={colors.outerTo} />
        </linearGradient>
        <linearGradient id={mid} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor={colors.mid} />
          <stop offset="1" stopColor={colors.midTo} />
        </linearGradient>
        <radialGradient id={ember}>
          <stop offset="0" stopColor="#FFC928" />
          <stop offset="1" stopColor="#E87518" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g transform={`translate(${x} ${y}) scale(${scale})`}>
        {/* Unlit: a faint ember glowing on the wick tip. */}
        <circle className="vilakku-ember" cx="0" cy="-2" r="9" fill={`url(#${ember})`} />

        <g className="vilakku-flame">
          <g className="vilakku-flicker-a">
            <path d={FLAME_PATHS.outer} fill={`url(#${outer})`} />
            <g className="vilakku-flicker-b">
              <path d={FLAME_PATHS.mid} fill={`url(#${mid})`} />
              <path d={FLAME_PATHS.core} fill={colors.core} />
            </g>
          </g>
        </g>
      </g>
    </>
  );
}
