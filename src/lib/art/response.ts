/** Serve a generated SVG as a static asset (prerendered at build time). */
export function svgResponse(svg: string): Response {
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}

export const THORANAM_URL = "/illustrations/thoranam.svg";
