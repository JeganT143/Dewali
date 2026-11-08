import { THORANAM_URL } from "@/lib/art/response";

/** Marigold-and-mango-leaf garland across the top of the page. */
export function Thoranam({ className = "" }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- static decorative SVG; next/image adds nothing here
    <img
      src={THORANAM_URL}
      alt=""
      aria-hidden="true"
      draggable={false}
      className={`pointer-events-none block h-[clamp(84px,14vw,150px)] w-full select-none object-cover object-top ${className}`}
    />
  );
}
