import { svgResponse } from "@/lib/art/response";
import { thoranamSvg } from "@/lib/art/thoranam";

// Generated from the same TypeScript geometry as the rest of the artwork and
// prerendered at build time, so it is served as a static, cacheable SVG.
export function GET() {
  return svgResponse(thoranamSvg(1620, 190));
}
