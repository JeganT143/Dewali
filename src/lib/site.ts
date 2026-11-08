/**
 * Absolute site URL, used for Open Graph and canonical URLs on the server.
 * On Vercel, VERCEL_PROJECT_PRODUCTION_URL is set automatically; set
 * NEXT_PUBLIC_SITE_URL to override (e.g. for a custom domain).
 * The share buttons use the visitor's own window.location.origin.
 */
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const SITE_NAME = "Deepavali 2026";
export const SITE_DESCRIPTION =
  "A little Deepavali celebration from Jegan: light the Vilakku, taste the sweets, enjoy the sparkle and receive warm wishes for you and your family.";
