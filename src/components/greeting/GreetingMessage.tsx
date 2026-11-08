import { Marigold } from "@/components/decor/FlowerDecorations";
import { kolamGeometry } from "@/lib/art/kolam";
import { GREETING } from "@/lib/greeting";
import "./greeting.css";

// Saffron-gold card: light gold at the top deepening to saffron at the base.
// Body text is brown (#3B1F0D) throughout: >= 5:1 even on the saffron end.
const CARD_GRADIENT = "linear-gradient(172deg, #FFE082 0%, #FFC928 34%, #F28C28 76%, #E87518 100%)";

const CORNERS = {
  tl: "left-0 top-0 -translate-x-1/2 -translate-y-1/2",
  tr: "right-0 top-0 translate-x-1/2 -translate-y-1/2",
  bl: "left-0 bottom-0 -translate-x-1/2 translate-y-1/2",
  br: "right-0 bottom-0 translate-x-1/2 translate-y-1/2",
} as const;

/** A static pulli kolam (no draw-in), used as corner ornaments and a watermark. */
function StaticKolam({ className, ink, opacity }: { className: string; ink: string; opacity: number }) {
  const { lines, dots } = kolamGeometry();
  return (
    <svg viewBox="-210 -210 420 420" className={className} aria-hidden="true" focusable="false">
      <g fill="none" stroke={ink} strokeOpacity={opacity} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        {lines.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
      <g fill={ink} fillOpacity={opacity}>
        {dots.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="5" />
        ))}
      </g>
    </svg>
  );
}

function BrownDivider() {
  return (
    <div aria-hidden="true" className="my-7 flex items-center justify-center gap-3 sm:my-9">
      <span className="h-px w-12 bg-gradient-to-r from-transparent to-brown/45 sm:w-20" />
      <Marigold size={20} />
      <span className="flex gap-1.5">
        <span className="size-1.5 rounded-full bg-brown/40" />
        <span className="size-1.5 rounded-full bg-brown/65" />
        <span className="size-1.5 rounded-full bg-brown/40" />
      </span>
      <Marigold size={20} />
      <span className="h-px w-12 bg-gradient-to-l from-transparent to-brown/45 sm:w-20" />
    </div>
  );
}

/** A pen stroke beneath the signature. */
function SignatureSwash() {
  return (
    <svg viewBox="0 0 200 22" className="mx-auto -mt-1 block h-auto w-36 sm:w-44" aria-hidden="true" focusable="false">
      <path
        d="M6 15 C 44 5, 92 4, 124 10 S 172 19, 194 7"
        fill="none"
        stroke="#8A3A0B"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeOpacity=".85"
      />
      <circle cx="194" cy="7" r="2.2" fill="#8A3A0B" fillOpacity=".85" />
    </svg>
  );
}

/** The final, personal greeting from Jegan. */
export function GreetingMessage() {
  const f = GREETING.final;
  return (
    <section id="wishes" aria-labelledby="wishes-title" className="relative isolate scroll-mt-6 px-4 py-14 sm:py-24">
      {/* Golden halo behind the card. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: "radial-gradient(55% 45% at 50% 50%, rgb(255 201 40 / 0.2), rgb(232 117 24 / 0.06) 60%, transparent 80%)" }}
      />

      <article
        className="relative mx-auto max-w-2xl overflow-hidden rounded-[2rem] px-6 py-12 text-center text-brown shadow-[0_30px_100px_-30px_rgb(255_201_40/0.6)] sm:px-14 sm:py-16"
        style={{ background: CARD_GRADIENT }}
      >
        {/* Kolam ornaments: ember ink on the gold top, rice-flour cream on the saffron base. */}
        <StaticKolam className={`pointer-events-none absolute size-40 sm:size-56 ${CORNERS.tl}`} ink="#8A3A0B" opacity={0.4} />
        <StaticKolam className={`pointer-events-none absolute size-40 sm:size-56 ${CORNERS.tr}`} ink="#8A3A0B" opacity={0.4} />
        <StaticKolam className={`pointer-events-none absolute size-40 sm:size-56 ${CORNERS.bl}`} ink="#FFF5DC" opacity={0.6} />
        <StaticKolam className={`pointer-events-none absolute size-40 sm:size-56 ${CORNERS.br}`} ink="#FFF5DC" opacity={0.6} />
        <StaticKolam
          className="pointer-events-none absolute left-1/2 top-1/2 size-[28rem] -translate-x-1/2 -translate-y-1/2 sm:size-[34rem]"
          ink="#3B1F0D"
          opacity={0.06}
        />
        {/* Pulli-dot inner border. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-3 rounded-[1.5rem] border-2 border-dotted border-brown/25 sm:inset-4" />
        <div aria-hidden="true" className="final-sheen pointer-events-none absolute inset-y-0 -left-1/2 w-1/2" />

        <div className="relative">
          <div aria-hidden="true" className="flex items-center justify-center -space-x-1.5">
            <Marigold size={24} />
            <Marigold size={32} className="relative" />
            <Marigold size={24} />
          </div>

          <p
            lang="ta"
            className="mt-5 text-balance font-tamil text-[clamp(1.2rem,5.2vw,2rem)] font-bold leading-[1.7] text-ember [overflow-wrap:break-word]"
          >
            {f.headingTa}
          </p>
          <h2 id="wishes-title" className="mt-1 font-display text-[clamp(2.4rem,9.5vw,3.9rem)] font-bold leading-[1.05] text-brown">
            {f.heading}
          </h2>

          <BrownDivider />

          <p className="mx-auto max-w-xl text-pretty font-display text-[clamp(1.2rem,4.6vw,1.6rem)] font-medium leading-snug text-brown">
            {f.message}
          </p>
          <p className="mx-auto mt-7 max-w-lg text-pretty rounded-2xl bg-cream/40 px-5 py-4 font-display text-[clamp(1.15rem,4.3vw,1.45rem)] font-semibold italic leading-snug text-brown shadow-[inset_0_0_0_1px_rgb(59_31_13/0.12)]">
            {f.wish}
          </p>

          <div className="mt-10 sm:mt-12">
            <p className="font-display text-[clamp(1.25rem,4.6vw,1.55rem)] font-medium italic text-brown">{f.closing}</p>
            <p className="mt-2 inline-block -rotate-3 font-display text-[clamp(2.9rem,12vw,4.25rem)] font-semibold italic leading-[1.1] text-brown">
              {f.signature}
            </p>
            <SignatureSwash />
          </div>
        </div>
      </article>
    </section>
  );
}
