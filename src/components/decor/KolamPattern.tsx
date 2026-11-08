import { kolamGeometry } from "@/lib/art/kolam";

/**
 * Pulli kolam (புள்ளிக் கோலம்) drawn in rice-flour cream. The guide dots are
 * visible from the start, as a kolam is begun; the lines draw themselves in
 * when an ancestor has data-lit="true".
 */
export function KolamPattern({ className }: { className?: string }) {
  const { lines, dots } = kolamGeometry();
  return (
    <svg viewBox="-210 -210 420 420" className={className} aria-hidden="true" focusable="false">
      <g fill="none" stroke="#FFF5DC" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" strokeOpacity=".85">
        {lines.map((d, i) => (
          <path
            key={i}
            d={d}
            pathLength={1}
            className="kolam-line"
            style={{ animationDelay: `${300 + (i % 26) * 45}ms` }}
          />
        ))}
      </g>
      <g fill="#FFF5DC" fillOpacity=".75">
        {dots.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="3.6" className="kolam-dot" />
        ))}
      </g>
    </svg>
  );
}
