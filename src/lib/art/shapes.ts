export type Point = readonly [number, number];

const r2 = (n: number) => Math.round(n * 100) / 100;

/** Polar → cartesian, with 0° pointing up and angles increasing clockwise. */
export function polar(radius: number, degrees: number, cx = 0, cy = 0): Point {
  const a = ((degrees - 90) * Math.PI) / 180;
  return [r2(cx + radius * Math.cos(a)), r2(cy + radius * Math.sin(a))];
}

export const pt = (p: Point) => `${p[0]} ${p[1]}`;

/** A circle with `bumps` outward scallops — used for marigold petals and kolam rings. */
export function scallopPath(cx: number, cy: number, radius: number, bumps: number, offsetDeg = 0): string {
  const step = 360 / bumps;
  const start = polar(radius, offsetDeg, cx, cy);
  const chord = 2 * radius * Math.sin(Math.PI / bumps);
  const bulge = r2((chord / 2) * 1.08);
  let d = `M${pt(start)}`;
  for (let i = 1; i <= bumps; i++) {
    d += ` A${bulge} ${bulge} 0 0 1 ${pt(polar(radius, offsetDeg + i * step, cx, cy))}`;
  }
  return `${d} Z`;
}

export function circlePath(cx: number, cy: number, radius: number): string {
  return `M${cx} ${cy - radius} A${radius} ${radius} 0 1 1 ${cx} ${cy + radius} A${radius} ${radius} 0 1 1 ${cx} ${cy - radius} Z`;
}

export function svgToDataUrl(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
