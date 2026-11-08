import { describe, expect, it } from "vitest";
import { GREETING, SENDER_NAME } from "@/lib/greeting";

/** The forbidden term from AGENTS.md, built so it never appears literally in source. */
const FORBIDDEN_TERM = String.fromCharCode(100, 105, 121, 97);

describe("greeting copy", () => {
  it("is signed by Jegan", () => {
    expect(SENDER_NAME).toBe("Jegan");
    expect(GREETING.final.signature).toBe("Jegan");
    expect(GREETING.final.closing).toBe("With love and warm wishes,");
  });

  it("keeps the Tamil greeting exactly as specified", () => {
    expect(GREETING.headingTa).toBe("இனிய தீபாவளி நல்வாழ்த்துக்கள்!");
    expect(GREETING.final.headingTa).toBe("இனிய தீபாவளி நல்வாழ்த்துக்கள்!");
    expect(GREETING.heading).toBe("Happy Deepavali!");
  });

  it("offers the five traditional sweets, each with a unique id and a message", () => {
    const items = GREETING.sweets.items;
    expect(items.map((s) => s.id)).toEqual(["laddu", "adhirasam", "mysore-pak", "murukku", "jangiri"]);
    expect(new Set(items.map((s) => s.id)).size).toBe(items.length);
    for (const item of items) {
      expect(item.name.length).toBeGreaterThan(0);
      expect(item.message.length).toBeGreaterThan(0);
    }
  });

  it("has four cracker messages and three personality options with unique ids", () => {
    expect(GREETING.crackers.messages).toHaveLength(4);
    expect(new Set(GREETING.crackers.messages).size).toBe(4);
    const options = GREETING.personality.options;
    expect(options.map((o) => o.label)).toEqual(["Sweet Lover", "Fireworks Fan", "Family Person"]);
    expect(new Set(options.map((o) => o.id)).size).toBe(3);
  });

  it("uses Vilakku terminology and never the forbidden term", () => {
    const all = JSON.stringify({ GREETING, SENDER_NAME }).toLowerCase();
    expect(all).toContain("vilakku");
    expect(all).not.toContain(FORBIDDEN_TERM);
  });
});
