/**
 * Every word of the greeting lives here, so the copy (and the Tamil) can be
 * reviewed in one place. Components read these keys; do not rename keys
 * without updating their consumers.
 */

/** The sender. This is a personal greeting from Jegan to friends and family. */
export const SENDER_NAME = "Jegan";

export const GREETING = {
  eyebrow: "Deepavali · 2026",
  heading: "Happy Deepavali!",
  /** Kept exactly as specified (with நல்வாழ்த்துக்கள்). */
  headingTa: "இனிய தீபாவளி நல்வாழ்த்துக்கள்!",
  supporting:
    "May this Deepavali fill your life with happiness, your home with laughter, your heart with peace and your future with endless opportunities.",
  fromLine: `A little Deepavali celebration from ${SENDER_NAME}`,

  lightLabel: "Tap to light the Vilakku",
  litLabel: "The Vilakku is lit",
  litCelebration: "The Vilakku is lit. May its light fill your home with joy!",
  smallHint: "Now light the little vilakkus on the kolam",
  allLit: "Every vilakku is glowing. May your home be full of light!",
  continueCta: "Let's celebrate",

  sweets: {
    eyebrow: "Moment 2",
    heading: "Okay, enough lighting lamps. Where are the sweets?",
    headingTa: "தீபாவளி என்றால் முதலில் ஞாபகம் வருவது இனிப்புதான்!",
    hint: "Tap a sweet to taste it",
    items: [
      { id: "laddu", name: "Laddu", nameTa: "லட்டு", message: "One laddu? That's just the beginning!" },
      { id: "adhirasam", name: "Adhirasam", nameTa: "அதிரசம்", message: "Calories don't count on Deepavali!" },
      { id: "mysore-pak", name: "Mysore Pak", nameTa: "மைசூர் பாக்", message: "Save some for the others... if you can!" },
      { id: "murukku", name: "Murukku", nameTa: "முறுக்கு", message: "Crunch time! Diet starts tomorrow!" },
      { id: "jangiri", name: "Jangiri", nameTa: "ஜாங்கிரி", message: "Sweet, swirly and gone in seconds!" },
    ],
    allTasted: "You tasted everything! A true Deepavali champion.",
  },

  crackers: {
    eyebrow: "Moment 3",
    heading: "What's Deepavali without a little sparkle?",
    sparklerLabel: "Light the kambi mathappu (sparkler)",
    sparklerNameTa: "கம்பி மத்தாப்பு",
    flowerPotLabel: "Light the poonthotti (flower pot)",
    flowerPotNameTa: "பூந்தொட்டி",
    fireworksLabel: "Launch the fireworks",
    messages: [
      "Warning: Happiness levels exceeding 100%!",
      "Too much excitement. Not enough sweets!",
      "Let the celebrations begin!",
      "Make some noise... but keep it safe!",
    ],
    safetyNote: "Virtual crackers only: no noise, no smoke, all fun.",
  },

  family: {
    eyebrow: "Moment 4",
    heading: "The best part of Deepavali isn't the sweets or fireworks. It's the people we celebrate with.",
    message:
      "May your home be filled with laughter, your family with happiness and your memories with beautiful moments.",
  },

  personality: {
    eyebrow: "Moment 5",
    heading: "Choose your Deepavali personality!",
    options: [
      { id: "sweet-lover", label: "Sweet Lover", response: "You came for the laddu. We understand." },
      { id: "fireworks-fan", label: "Fireworks Fan", response: "You wait all year for this moment!" },
      { id: "family-person", label: "Family Person", response: "The real celebration is being together." },
    ],
  },

  final: {
    heading: "Happy Deepavali!",
    headingTa: "இனிய தீபாவளி நல்வாழ்த்துக்கள்!",
    message:
      "May every Vilakku illuminate your path, every sweet bring a smile, every sparkle bring new hope and every moment with your loved ones become a beautiful memory.",
    wish: "Wishing you and your family happiness, good health, peace and prosperity.",
    closing: "With love and warm wishes,",
    signature: SENDER_NAME,
  },

  share: {
    heading: "Share the Deepavali happiness!",
    intro: "Send this little celebration to your friends and family.",
  },
} as const;

export type SweetId = (typeof GREETING.sweets.items)[number]["id"];
export type PersonalityId = (typeof GREETING.personality.options)[number]["id"];
