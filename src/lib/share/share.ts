/*
 * Everyone shares the same page. These helpers build the share URL and the
 * prefilled message; they are pure so they can be unit-tested.
 */

export const SHARE_TITLE = "Happy Deepavali from Jegan! இனிய தீபாவளி நல்வாழ்த்துக்கள்";

/** The message that accompanies the link (one 🪔, as requested). */
export const SHARE_MESSAGE =
  "🪔 Happy Deepavali! இனிய தீபாவளி நல்வாழ்த்துக்கள்! Jegan made a little Deepavali celebration for you. Light the Vilakku, grab a sweet and enjoy the sparkle:";

/** The canonical page URL: origin + "/", without query string or hash. */
export function shareUrlFrom(origin: string): string {
  return `${origin.replace(/\/+$/, "")}/`;
}

export function buildShareText(url: string): string {
  return `${SHARE_MESSAGE}\n${url}`;
}

/** wa.me opens the WhatsApp app on phones and WhatsApp Web/Desktop elsewhere. */
export function buildWhatsAppUrl(url: string): string {
  return `https://wa.me/?text=${encodeURIComponent(buildShareText(url))}`;
}
