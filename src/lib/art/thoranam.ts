import { scallopPath } from "./shapes";

/*
 * Thoranam (தோரணம்): a garland of marigolds and mango leaves strung across a
 * doorway for festivals. Generated for any width so it can span the hero and
 * the card.
 */

const COLORS = {
  rope: "#8A4A14",
  string: "#A85F1E",
  petalOuter: "#E87518",
  petalMid: "#F28C28",
  heart: "#FFC928",
  seed: "#9C4710",
  leaf: "#6E8B2E",
  leafDark: "#56701F",
  rib: "#B4C25A",
  bead: "#FFC928",
};

function marigold(cx: number, cy: number, r: number): string {
  return [
    `<path d="${scallopPath(cx, cy, r, 12)}" fill="${COLORS.petalOuter}"/>`,
    `<path d="${scallopPath(cx, cy, r * 0.72, 10, 18)}" fill="${COLORS.petalMid}"/>`,
    `<circle cx="${cx}" cy="${cy}" r="${(r * 0.38).toFixed(2)}" fill="${COLORS.heart}"/>`,
    `<circle cx="${cx}" cy="${cy}" r="${(r * 0.14).toFixed(2)}" fill="${COLORS.seed}"/>`,
  ].join("");
}

function leaf(x: number, y: number, angle: number, length: number, dark: boolean): string {
  const w = length * 0.22;
  const l = length;
  return `<g transform="translate(${x} ${y}) rotate(${angle})"><path d="M0 0 C${w} ${l * 0.26} ${w} ${l * 0.72} 0 ${l} C${-w} ${l * 0.72} ${-w} ${l * 0.26} 0 0 Z" fill="${dark ? COLORS.leafDark : COLORS.leaf}"/><path d="M0 4 L0 ${l - 6}" stroke="${COLORS.rib}" stroke-width="1.5" stroke-linecap="round"/></g>`;
}

export function thoranamSvg(width = 1080, height = 190, spacing = 90): string {
  const ropeY = (x: number) => {
    const t = x / width;
    return 16 + 44 * t * (1 - t) * 4 * 0.5;
  };
  const parts: string[] = [];
  parts.push(
    `<path d="M0 16 Q${width / 2} ${16 + 44} ${width} 16" fill="none" stroke="${COLORS.rope}" stroke-width="4" stroke-linecap="round"/>`,
  );

  const count = Math.floor(width / spacing);
  const offset = (width - (count - 1) * spacing) / 2;
  for (let i = 0; i < count; i++) {
    const x = Math.round(offset + i * spacing);
    const y = ropeY(x);
    if (i % 2 === 0) {
      // Marigold string: three flowers and a bead.
      const r = 15;
      parts.push(`<path d="M${x} ${y} L${x} ${y + 98}" stroke="${COLORS.string}" stroke-width="2"/>`);
      parts.push(marigold(x, y + 22, r + 1));
      parts.push(marigold(x, y + 52, r));
      parts.push(marigold(x, y + 80, r - 1.5));
      parts.push(`<circle cx="${x}" cy="${y + 104}" r="4.5" fill="${COLORS.bead}"/>`);
    } else {
      // Pair of mango leaves.
      parts.push(leaf(x, y + 2, -16, 74, false));
      parts.push(leaf(x, y + 2, 16, 74, true));
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">${parts.join("")}</svg>`;
}
