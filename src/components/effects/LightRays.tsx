/**
 * Slowly turning rays centred on a point (percentages of the positioned
 * parent). Fades in when the scene is lit.
 */
export function LightRays({ lit, x = 50, y = 50 }: { lit: boolean; x?: number; y?: number }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute size-[min(170vw,900px)] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-[1600ms] ${
        lit ? "opacity-100" : "opacity-0"
      }`}
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <span className="rays block size-full rounded-full" />
    </span>
  );
}
