import { describe, expect, it } from "vitest";
import { SHARE_MESSAGE, buildShareText, buildWhatsAppUrl, shareUrlFrom } from "@/lib/share/share";

const countLamps = (text: string) => Array.from(text.matchAll(/🪔/gu)).length;

describe("shareUrlFrom", () => {
  it("returns the site root for an origin", () => {
    expect(shareUrlFrom("https://deepavali.example")).toBe("https://deepavali.example/");
  });

  it("does not double the slash when the origin has a trailing slash", () => {
    expect(shareUrlFrom("https://deepavali.example/")).toBe("https://deepavali.example/");
  });
});

describe("share message", () => {
  it("contains exactly one 🪔 emoji", () => {
    expect(countLamps(SHARE_MESSAGE)).toBe(1);
  });

  it("includes the Tamil greeting exactly as specified", () => {
    expect(SHARE_MESSAGE).toContain("இனிய தீபாவளி நல்வாழ்த்துக்கள்");
  });

  it("uses Vilakku terminology and never 'diya'", () => {
    expect(SHARE_MESSAGE).toContain("Vilakku");
    expect(SHARE_MESSAGE.toLowerCase()).not.toContain("diya");
  });

  it("puts the URL on its own last line so WhatsApp links it cleanly", () => {
    const text = buildShareText("https://deepavali.example/");
    expect(text.split("\n").at(-1)).toBe("https://deepavali.example/");
  });
});

describe("buildWhatsAppUrl", () => {
  const url = "https://deepavali.example/";
  const wa = new URL(buildWhatsAppUrl(url));

  it("targets wa.me with only a text parameter", () => {
    expect(wa.origin).toBe("https://wa.me");
    expect(wa.pathname).toBe("/");
    expect([...wa.searchParams.keys()]).toEqual(["text"]);
  });

  it("round-trips the full message, Tamil and emoji included", () => {
    expect(wa.searchParams.get("text")).toBe(buildShareText(url));
  });

  it("percent-encodes the text (no raw spaces, newlines or emoji in the URL)", () => {
    const raw = buildWhatsAppUrl(url);
    expect(raw).not.toMatch(/[\s🪔]/u);
    expect(raw).toContain("%F0%9F%AA%94"); // 🪔 in UTF-8
  });
});
