import { polar, pt } from "@/lib/art/shapes";
import { Marigold } from "./FlowerDecorations";

// A small four-petal pulli kolam: petals looped around a centre dot, with
// guide dots between them. Computed once at module load (deterministic).
const PETALS = [0, 90, 180, 270].map(
  (a) => `M0 0 Q${pt(polar(15, a - 32))} ${pt(polar(19, a))} Q${pt(polar(15, a + 32))} 0 0 Z`,
);
const GUIDE_DOTS = [45, 135, 225, 315].map((a) => polar(14, a));
const OUTER_DOTS = [0, 90, 180, 270].map((a) => polar(23, a));

function KolamMotif({ size = 44 }: { size?: number }) {
  return (
    <svg viewBox="-26 -26 52 52" width={size} height={size} aria-hidden="true" focusable="false">
      <g fill="none" stroke="#FFE082" strokeWidth="1.6" strokeLinejoin="round" strokeOpacity=".85">
        {PETALS.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <circle r="2.4" fill="#FFC928" />
      <g fill="#FFF5DC" fillOpacity=".8">
        {GUIDE_DOTS.map(([x, y]) => (
          <circle key={`${x},${y}`} cx={x} cy={y} r="1.7" />
        ))}
      </g>
      <g fill="#F28C28">
        {OUTER_DOTS.map(([x, y]) => (
          <circle key={`${x},${y}`} cx={x} cy={y} r="1.5" />
        ))}
      </g>
    </svg>
  );
}

function Dots() {
  return (
    <span className="flex shrink-0 items-center gap-1.5">
      <span className="size-1 rounded-full bg-gold/60" />
      <span className="size-1.5 rounded-full bg-gold/80" />
      <span className="size-1 rounded-full bg-gold/60" />
    </span>
  );
}

/**
 * Decorative pause between celebration sections: gold threads drawn towards
 * a small kolam (or a marigold), with pulli dots on either side.
 */
export function SectionDivider({
  variant = "kolam",
  className = "",
}: {
  variant?: "kolam" | "marigold";
  className?: string;
}) {
  return (
    <div aria-hidden="true" className={`flex items-center justify-center gap-2.5 px-6 py-6 sm:gap-4 sm:py-10 ${className}`}>
      <span className="h-px min-w-0 max-w-48 flex-1 bg-gradient-to-r from-transparent via-gold/35 to-gold/70" />
      <Marigold size={16} className="hidden shrink-0 opacity-90 sm:block" />
      <Dots />
      <span className="shrink-0 drop-shadow-[0_0_10px_rgb(255_201_40/0.35)]">
        {variant === "marigold" ? <Marigold size={34} /> : <KolamMotif />}
      </span>
      <Dots />
      <Marigold size={16} className="hidden shrink-0 opacity-90 sm:block" />
      <span className="h-px min-w-0 max-w-48 flex-1 bg-gradient-to-l from-transparent via-gold/35 to-gold/70" />
    </div>
  );
}
