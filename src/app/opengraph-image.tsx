import { ImageResponse } from "next/og";
import { svgToDataUrl } from "@/lib/art/shapes";
import { vilakkuSvg } from "@/lib/art/vilakku";

/*
 * The WhatsApp/social preview image. English-only on purpose: the Open Graph
 * renderer does not shape Tamil script reliably, and broken Tamil would be
 * worse than none. The Tamil greeting is carried in og:title instead.
 */

export const alt = "A lit Tamil agal vilakku with the words Happy Deepavali";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const lamp = svgToDataUrl(vilakkuSvg());
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
          background: "radial-gradient(circle at 30% 50%, #7a3a0e 0%, #3b1f0d 40%, #211207 78%)",
          color: "#FFF5DC",
          padding: "0 70px",
        }}
      >
        <img src={lamp} width={540} height={369} alt="" />
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 560 }}>
          <div style={{ fontSize: 26, letterSpacing: 10, color: "#FFC928", textTransform: "uppercase" }}>
            Deepavali 2026
          </div>
          <div style={{ fontSize: 92, fontWeight: 700, lineHeight: 1.02, marginTop: 14, color: "#FFE082" }}>
            Happy Deepavali!
          </div>
          <div style={{ fontSize: 34, marginTop: 26, color: "#FFF5DC", opacity: 0.92, lineHeight: 1.3 }}>
            A little Deepavali celebration from Jegan. Tap to light the Vilakku!
          </div>
        </div>
      </div>
    ),
    size,
  );
}
