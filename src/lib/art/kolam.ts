import { circlePath, polar, pt, scallopPath, type Point } from "./shapes";

/*
 * A pulli-style kolam: a ring of lotus petals around the lamp, loops drawn
 * around guide dots (pulli), and a scalloped outer border. Centred at (0,0),
 * radius ~200. Lines are kept as separate paths so the hero can "draw" them in.
 */

export interface KolamGeometry {
  lines: string[];
  dots: Point[];
}

let cached: KolamGeometry | null = null;

export function kolamGeometry(): KolamGeometry {
  if (cached) return cached;
  const lines: string[] = [];
  const dots: Point[] = [];

  lines.push(circlePath(0, 0, 54));

  for (let i = 0; i < 8; i++) {
    const a = i * 45;
    const b = a + 22.5;
    // Large lotus petal.
    lines.push(
      `M${pt(polar(60, a))} Q${pt(polar(118, a - 21))} ${pt(polar(154, a))} Q${pt(polar(118, a + 21))} ${pt(polar(60, a))} Z`,
    );
    // Small petal between the large ones.
    lines.push(
      `M${pt(polar(60, b))} Q${pt(polar(90, b - 11))} ${pt(polar(106, b))} Q${pt(polar(90, b + 11))} ${pt(polar(60, b))} Z`,
    );
    // Loop drawn around a guide dot.
    const [lx, ly] = polar(130, b);
    lines.push(circlePath(lx, ly, 11));
    dots.push([lx, ly]);
    dots.push(polar(132, a));
    dots.push(polar(38, b));
  }

  lines.push(scallopPath(0, 0, 170, 16));
  for (let i = 0; i < 16; i++) dots.push(polar(190, i * 22.5 + 11.25));

  cached = { lines, dots };
  return cached;
}

export function kolamSvg({
  stroke = "#FFF5DC",
  strokeOpacity = 0.9,
  strokeWidth = 3,
  dotColor = "#FFF5DC",
}: {
  stroke?: string;
  strokeOpacity?: number;
  strokeWidth?: number;
  dotColor?: string;
} = {}): string {
  const { lines, dots } = kolamGeometry();
  const paths = lines.map((d) => `<path d="${d}"/>`).join("");
  const circles = dots.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4"/>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-210 -210 420 420" width="420" height="420">
<g fill="none" stroke="${stroke}" stroke-opacity="${strokeOpacity}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${paths}</g>
<g fill="${dotColor}" fill-opacity="${strokeOpacity}">${circles}</g>
</svg>`;
}
