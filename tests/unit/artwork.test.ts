import { describe, expect, it } from "vitest";
import { kolamGeometry, kolamSvg } from "@/lib/art/kolam";
import { scallopPath } from "@/lib/art/shapes";
import { thoranamSvg } from "@/lib/art/thoranam";
import { FLAME_ANCHOR, FOOT_ANCHOR, VILAKKU, vilakkuSvg } from "@/lib/art/vilakku";

/*
 * The artwork is generated from code, so guard against the classic failure
 * modes: NaN/undefined leaking into path data, and anchors drifting outside
 * the drawing (which would misplace the glow, sparks and kolam).
 */

const bad = /NaN|undefined|Infinity/;

describe("agal vilakku geometry", () => {
  it("produces finite path data", () => {
    for (const d of Object.values(VILAKKU.paths)) {
      expect(d).not.toMatch(bad);
      expect(d.startsWith("M")).toBe(true);
    }
  });

  it("places the flame on the spout, inside the drawing", () => {
    const [fx, fy] = VILAKKU.flameBase;
    const [sx, sy] = VILAKKU.spoutTip;
    expect(Math.hypot(fx - sx, fy - sy)).toBeLessThan(15);
    // The spout points to the right of the bowl's centre (x = 130).
    expect(fx).toBeGreaterThan(150);
    expect(FLAME_ANCHOR.x).toBeGreaterThan(0);
    expect(FLAME_ANCHOR.x).toBeLessThan(100);
    expect(FLAME_ANCHOR.y).toBeGreaterThan(0);
    expect(FLAME_ANCHOR.y).toBeLessThan(100);
  });

  it("keeps the whole flame within the viewBox", () => {
    const flameTop = VILAKKU.flameBase[1] - 104 * VILAKKU.flameScale;
    expect(flameTop).toBeGreaterThanOrEqual(VILAKKU.viewBox.y);
  });

  it("centres the kolam under the lamp's foot", () => {
    expect(FOOT_ANCHOR.x).toBeCloseTo(50, 0);
    expect(FOOT_ANCHOR.y).toBeGreaterThan(80);
    expect(FOOT_ANCHOR.y).toBeLessThanOrEqual(100);
  });

  it("exports a standalone SVG document", () => {
    const svg = vilakkuSvg();
    expect(svg.startsWith("<svg")).toBe(true);
    expect(svg.endsWith("</svg>")).toBe(true);
    expect(svg).not.toMatch(bad);
  });
});

describe("kolam, thoranam and shapes", () => {
  it("builds a kolam with lines and guide dots", () => {
    const { lines, dots } = kolamGeometry();
    expect(lines.length).toBeGreaterThan(20);
    expect(dots.length).toBeGreaterThan(20);
    expect(kolamSvg()).not.toMatch(bad);
  });

  it("builds a thoranam of any width", () => {
    for (const width of [360, 1080, 1620]) {
      const svg = thoranamSvg(width, 190);
      expect(svg).toContain(`viewBox="0 0 ${width} 190"`);
      expect(svg).not.toMatch(bad);
    }
  });

  it("closes scalloped (marigold) outlines", () => {
    const d = scallopPath(0, 0, 10, 12);
    expect(d.match(/A/g)).toHaveLength(12);
    expect(d.endsWith("Z")).toBe(true);
  });
});
