/**
 * The page's sky. Starts as a deep brown night; when the Vilakku is lit a warm
 * saffron-gold light fades in (opacity only, so it is cheap to animate).
 */
export function SceneBackdrop({ lit }: { lit: boolean }) {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 70% at 50% 30%, #3a210f 0%, #2a170a 45%, #211207 75%), #211207",
        }}
      />
      <div
        className={`absolute inset-0 transition-opacity duration-[1800ms] ease-out ${lit ? "opacity-100" : "opacity-0"}`}
        style={{
          background:
            "radial-gradient(90% 60% at 50% 34%, rgb(255 201 40 / 0.42) 0%, rgb(242 140 40 / 0.30) 32%, rgb(232 117 24 / 0.16) 56%, transparent 80%), linear-gradient(180deg, rgb(232 117 24 / 0.10), rgb(59 31 13 / 0) 60%)",
        }}
      />
      {/* Subtle grain-free vignette to hold the eye in the centre. */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(140% 100% at 50% 40%, transparent 55%, rgb(0 0 0 / 0.45) 100%)" }}
      />
    </div>
  );
}
