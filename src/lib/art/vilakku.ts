/*
 * Agal vilakku (அகல் விளக்கு): the small clay oil lamp lit in rows on Tamil
 * doorsteps and kolams. Drawn in three-quarter view: a shallow round bowl whose
 * rim is pinched into a spout pointing towards the viewer; the cotton wick
 * rests in the spout and the flame burns at its tip.
 *
 * The rim is an ellipse (the bowl seen from above) with a smooth outward pull
 * at the spout angle. Everything is generated here once, so the interactive
 * lamps and the Open Graph image share exactly the same geometry.
 */

const CX = 130;
const CY = 130;
const RX = 100;
const RY = 34;
const SPOUT_DEG = 60; // 0° = right, 90° = towards the viewer (screen down)

const r1 = (n: number) => Math.round(n * 10) / 10;

/** Ellipse radius multiplier: 1 everywhere except a smooth pointed bulge at the spout. */
function spoutPull(angleDeg: number, strength: number, width: number) {
  let d = Math.abs(angleDeg - SPOUT_DEG) % 360;
  if (d > 180) d = 360 - d;
  const x = d / width;
  return 1 + strength * Math.exp(-x * x * 1.6) * (1 / (1 + x * 0.9));
}

function rimPoint(angleDeg: number, rx: number, ry: number, strength: number, width: number, cy = CY) {
  const k = spoutPull(angleDeg, strength, width);
  const a = (angleDeg * Math.PI) / 180;
  return [r1(CX + rx * k * Math.cos(a)), r1(cy + ry * k * Math.sin(a))] as const;
}

function outline(rx: number, ry: number, strength: number, width: number, from = 0, to = 360, step = 4, cy = CY) {
  const pts: string[] = [];
  for (let deg = from; deg <= to; deg += step) {
    const [x, y] = rimPoint(deg, rx, ry, strength, width, cy);
    pts.push(`${x} ${y}`);
  }
  return pts;
}

const RIM_STRENGTH = 0.62;
const RIM_WIDTH = 19;
const FLAME_SCALE = 0.8;

/** Outer edge of the rim (the whole top outline of the lamp). */
const rimPath = `M${outline(RX, RY, RIM_STRENGTH, RIM_WIDTH, 0, 360, 3).join(" L")} Z`;

/** Oil/ghee surface inside the bowl. */
const oilPath = `M${outline(RX - 15, RY - 10, 0.42, 17, 0, 360, 3, CY + 2).join(" L")} Z`;

/** Outer clay wall: the front half of the rim, then the rounded underside of the bowl. */
const frontEdge = outline(RX, RY, RIM_STRENGTH, RIM_WIDTH, 0, 180, 3);
const bodyPath = `M${frontEdge.join(" L")} C${CX - RX + 4} ${CY + 46} ${CX - 52} ${CY + 70} ${CX} ${CY + 70} C${CX + 52} ${CY + 70} ${CX + RX - 4} ${CY + 46} ${CX + RX} ${CY} Z`;

/** Small turned foot and its shadow on the ground. */
const footPath = `M${CX - 40} ${CY + 66} C${CX - 36} ${CY + 78} ${CX - 18} ${CY + 81} ${CX} ${CY + 81} C${CX + 18} ${CY + 81} ${CX + 36} ${CY + 78} ${CX + 40} ${CY + 66} Z`;

const spoutTip = rimPoint(SPOUT_DEG, RX, RY, RIM_STRENGTH, RIM_WIDTH);
const wickTip = rimPoint(SPOUT_DEG, RX * 0.93, RY * 0.93, RIM_STRENGTH * 0.92, RIM_WIDTH);
const wickStart = rimPoint(SPOUT_DEG, RX * 0.55, RY * 0.5, 0, RIM_WIDTH, CY + 2);

/** Cotton wick lying in the spout. */
const wickPath = `M${wickStart[0]} ${wickStart[1]} Q${r1((wickStart[0] + wickTip[0]) / 2 + 4)} ${r1((wickStart[1] + wickTip[1]) / 2 - 2)} ${wickTip[0]} ${wickTip[1]}`;

/** Painted band of dots along the bowl (a common hand-painted agal motif). */
function bezier(t: number, p0: number, p1: number, p2: number, p3: number) {
  const u = 1 - t;
  return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
}
const bandPoints = { x: [CX - RX + 12, CX - 60, CX + 60, CX + RX - 12], y: [CY + 20, CY + 52, CY + 52, CY + 20] };
const bandPath = `M${bandPoints.x[0]} ${bandPoints.y[0]} C${bandPoints.x[1]} ${bandPoints.y[1]} ${bandPoints.x[2]} ${bandPoints.y[2]} ${bandPoints.x[3]} ${bandPoints.y[3]}`;
const bandDots = Array.from({ length: 11 }, (_, i) => {
  const t = 0.08 + (i * 0.84) / 10;
  return [
    r1(bezier(t, bandPoints.x[0], bandPoints.x[1], bandPoints.x[2], bandPoints.x[3])),
    r1(bezier(t, bandPoints.y[0], bandPoints.y[1], bandPoints.y[2], bandPoints.y[3]) + 9),
  ] as const;
});

/** The flame is drawn around a base at (0,0) pointing up (height ~100). */
export const FLAME_PATHS = {
  outer: "M0 -104 C15 -76 32 -50 30 -28 C28 -10 16 0 0 0 C-16 0 -28 -10 -30 -28 C-32 -50 -15 -76 0 -104 Z",
  mid: "M0 -78 C11 -58 20 -40 19 -25 C18 -12 11 -5 0 -5 C-11 -5 -18 -12 -19 -25 C-20 -40 -11 -58 0 -78 Z",
  core: "M0 -46 C6 -34 10 -25 9 -17 C8 -11 5 -7 0 -7 C-5 -7 -8 -11 -9 -17 C-10 -25 -6 -34 0 -46 Z",
} as const;

export const VILAKKU = {
  viewBox: { x: 18, y: 64, width: 224, height: 158 },
  paths: { rim: rimPath, oil: oilPath, body: bodyPath, foot: footPath, wick: wickPath, band: bandPath },
  bandDots,
  /** Where the flame sits (on the wick tip, a touch above the rim). */
  flameBase: [wickTip[0], r1(wickTip[1] - 3)] as const,
  flameScale: FLAME_SCALE,
  spoutTip,
  shadow: { cx: CX, cy: CY + 83, rx: 92, ry: 8 },
  colors: {
    flameOuterFrom: "#E87518",
    flameOuterTo: "#FFC928",
    flameMid: "#FFC928",
    flameMidTo: "#FFE082",
    flameCore: "#FFF5DC",
    rimFrom: "#E58A3A",
    rimTo: "#B9561A",
    bodyTop: "#C4601C",
    bodyMid: "#8A3A0B",
    bodyBottom: "#4A2209",
    oilFrom: "#2E1608",
    oilTo: "#6A300C",
    wick: "#F6E7C8",
    foot: "#3B1F0D",
    paint: "#FFC928",
  },
} as const;

/** Flame/glow anchor as a percentage of the SVG box, for positioning HTML glow layers. */
export const FLAME_ANCHOR = {
  x: ((VILAKKU.flameBase[0] - VILAKKU.viewBox.x) / VILAKKU.viewBox.width) * 100,
  // Centre of the flame body (~40% of its height above the base).
  y: ((VILAKKU.flameBase[1] - 42 * FLAME_SCALE - VILAKKU.viewBox.y) / VILAKKU.viewBox.height) * 100,
};

/** Foot position as a percentage of the SVG box (for placing the kolam beneath). */
export const FOOT_ANCHOR = {
  x: ((CX - VILAKKU.viewBox.x) / VILAKKU.viewBox.width) * 100,
  y: ((VILAKKU.shadow.cy - VILAKKU.viewBox.y) / VILAKKU.viewBox.height) * 100,
};

/** A lit vilakku as a standalone SVG document (used by the Open Graph image). */
export function vilakkuSvg(): string {
  const { paths: p, colors: c, viewBox: vb, flameBase: [fx, fy], shadow: s } = VILAKKU;
  const dots = bandDots.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="${c.paint}"/>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.x - 40} ${vb.y - 50} ${vb.width + 80} ${vb.height + 50}" width="${(vb.width + 80) * 2}" height="${(vb.height + 50) * 2}">
<defs>
<radialGradient id="g"><stop offset="0" stop-color="#FFF5DC" stop-opacity=".9"/><stop offset=".4" stop-color="#FFE082" stop-opacity=".45"/><stop offset="1" stop-color="#FFC928" stop-opacity="0"/></radialGradient>
<linearGradient id="fo" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${c.flameOuterFrom}"/><stop offset="1" stop-color="${c.flameOuterTo}"/></linearGradient>
<linearGradient id="fm" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${c.flameMid}"/><stop offset="1" stop-color="${c.flameMidTo}"/></linearGradient>
<linearGradient id="r" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c.rimFrom}"/><stop offset="1" stop-color="${c.rimTo}"/></linearGradient>
<linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.bodyTop}"/><stop offset=".55" stop-color="${c.bodyMid}"/><stop offset="1" stop-color="${c.bodyBottom}"/></linearGradient>
<linearGradient id="o" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.oilFrom}"/><stop offset="1" stop-color="${c.oilTo}"/></linearGradient>
</defs>
<ellipse cx="${fx}" cy="${fy - 38}" rx="78" ry="84" fill="url(#g)"/>
<ellipse cx="${s.cx}" cy="${s.cy}" rx="${s.rx}" ry="${s.ry}" fill="#000" fill-opacity=".35"/>
<path d="${p.foot}" fill="${c.foot}"/>
<path d="${p.body}" fill="url(#b)"/>
<path d="${p.band}" fill="none" stroke="${c.paint}" stroke-width="1.6" stroke-opacity=".7"/>
${dots}
<path d="${p.rim}" fill="url(#r)" stroke="${c.paint}" stroke-opacity=".55" stroke-width="1.2"/>
<path d="${p.oil}" fill="url(#o)"/>
<path d="${p.wick}" fill="none" stroke="${c.wick}" stroke-width="5" stroke-linecap="round"/>
<g transform="translate(${fx} ${fy}) scale(${FLAME_SCALE})">
<path d="${FLAME_PATHS.outer}" fill="url(#fo)"/>
<path d="${FLAME_PATHS.mid}" fill="url(#fm)"/>
<path d="${FLAME_PATHS.core}" fill="${c.flameCore}"/>
</g>
</svg>`;
}
