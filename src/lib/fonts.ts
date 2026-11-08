import { Cormorant_Garamond, Hind_Madurai, Noto_Serif_Tamil } from "next/font/google";

/** English display serif: headings, the card title and message. */
export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

/** Tamil serif with robust shaping: Tamil headings and card text. */
export const notoSerifTamil = Noto_Serif_Tamil({
  subsets: ["tamil"],
  variable: "--font-noto-tamil",
  display: "swap",
});

/** Interface text; covers Latin and Tamil so the UI reads consistently in both. */
export const hindMadurai = Hind_Madurai({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-hind",
  display: "swap",
});

export const fontVariables = [cormorant.variable, notoSerifTamil.variable, hindMadurai.variable].join(" ");
