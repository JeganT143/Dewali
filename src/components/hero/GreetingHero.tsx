import { ArrowDown } from "lucide-react";
import { Thoranam } from "@/components/decor/Thoranam";
import { buttonClass } from "@/components/ui/buttonStyles";
import { AnimatedVilakku } from "@/components/vilakku/AnimatedVilakku";
import { VilakkuRow } from "@/components/vilakku/VilakkuRow";
import { GREETING } from "@/lib/greeting";

interface GreetingHeroProps {
  lit: boolean;
  allLit: boolean;
  onLight: () => void;
  onLightSmall: (litCount: number, total: number) => void;
}

/** Scenes 1–3: arrival, lighting the Vilakku, and the little vilakkus on the kolam. */
export function GreetingHero({ lit, allLit, onLight, onLightSmall }: GreetingHeroProps) {
  return (
    <section aria-labelledby="hero-title" className="relative flex min-h-svh flex-col items-center overflow-hidden">
      <Thoranam />

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col items-center px-4 pb-12 text-center">
        <p className="awaits-light mt-1 text-xs font-semibold uppercase tracking-[0.38em] text-gold/85 sm:text-sm">
          {GREETING.eyebrow}
        </p>

        <h1
          id="hero-title"
          className="awaits-light mt-2 bg-gradient-to-b from-gold-soft via-gold to-festival bg-clip-text pb-1 font-display text-[clamp(3rem,13vw,5.75rem)] font-semibold leading-[0.98] tracking-tight text-transparent"
        >
          {GREETING.heading}
        </h1>

        <p lang="ta" className="awaits-light mt-1 font-tamil text-[clamp(1.1rem,4.9vw,1.75rem)] font-medium text-cream">
          {GREETING.headingTa}
        </p>

        <p className="awaits-light mt-3 max-w-md text-balance text-[0.97rem] leading-relaxed text-cream/85 sm:text-lg">
          {GREETING.supporting}
        </p>
        <p className="awaits-light mt-2 font-display text-lg italic text-gold-soft">{GREETING.fromLine}</p>

        <div className="mt-[clamp(1rem,3.5vh,2.25rem)] w-full">
          <AnimatedVilakku
            lit={lit}
            onLight={onLight}
            label={GREETING.lightLabel}
            litLabel={GREETING.litLabel}
            floor={<VilakkuRow visible={lit} onLightOne={onLightSmall} />}
          />
        </div>

        <div className="mt-5 flex min-h-[6.5rem] flex-col items-center gap-4">
          {lit && (
            <>
              <p className="animate-rise-in text-balance font-display text-[clamp(1.2rem,4.6vw,1.6rem)] italic text-gold-soft">
                {allLit ? GREETING.allLit : GREETING.smallHint}
              </p>
              <a href="#sweets" className={`${buttonClass("primary")} animate-rise-in [animation-delay:400ms]`}>
                {GREETING.continueCta}
                <ArrowDown aria-hidden="true" className="size-4" />
              </a>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
