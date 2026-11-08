import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { GREETING, SENDER_NAME } from "../src/lib/greeting";

/** The Tamil greeting without its "!", as used inside the share message. */
const TAMIL_GREETING = "இனிய தீபாவளி நல்வாழ்த்துக்கள்";

/** Sections that appear only once the main Vilakku is lit. */
const REVEALED_SECTIONS = ["#sweets", "#crackers", "#family", "#personality", "#wishes"] as const;

function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push(String(e)));
  return errors;
}

const mainVilakku = (page: Page) => page.getByRole("button", { name: /tap to light the vilakku|the vilakku is lit/i });

async function lightMain(page: Page) {
  await mainVilakku(page).click();
  await expect(mainVilakku(page)).toHaveAttribute("aria-pressed", "true");
}

test.describe("arrival", () => {
  test("shows the greeting, the unlit Vilakku and nothing else yet", async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1, name: "Happy Deepavali!" })).toBeVisible();
    await expect(page.locator('[lang="ta"]', { hasText: GREETING.headingTa }).first()).toBeVisible();
    await expect(page.getByText(GREETING.supporting).first()).toBeVisible();

    const button = mainVilakku(page);
    await expect(button).toHaveAccessibleName("Tap to light the Vilakku");
    await expect(button).toHaveAttribute("aria-pressed", "false");

    // Every celebration section, sharing and the small vilakkus appear only after lighting.
    for (const id of REVEALED_SECTIONS) {
      await expect(page.locator(id), `${id} should not exist before lighting`).toHaveCount(0);
    }
    await expect(page.getByRole("link", { name: GREETING.continueCta })).toHaveCount(0);
    await expect(page.getByRole("button", { name: /little vilakku/i })).toHaveCount(0);

    expect(errors).toEqual([]);
  });

  test("never uses the word 'diya'", async ({ page }) => {
    await page.goto("/");
    await lightMain(page);
    const text = (await page.locator("body").innerText()).toLowerCase();
    const html = (await page.content()).toLowerCase();
    expect(text).not.toContain("diya");
    expect(html).not.toContain("diya");
  });
});

test.describe("lighting the Vilakku", () => {
  test("by click: flame ignites, scene lights up and the greeting is revealed", async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto("/");
    await lightMain(page);

    await expect(page.locator("[data-scene-lit]")).toHaveAttribute("data-scene-lit", "true");
    await expect(page.getByRole("status").filter({ hasText: "The Vilakku is lit" })).toHaveCount(1);

    // The flame finishes igniting (opacity animates 0 → 1).
    const flame = page.locator('button[data-lit="true"] .vilakku-flame').first();
    await expect.poll(() => flame.evaluate((el) => Number(getComputedStyle(el).opacity)), { timeout: 3000 }).toBe(1);

    // Every celebration section is now in the page.
    for (const id of REVEALED_SECTIONS) {
      await expect(page.locator(id), `${id} should exist after lighting`).toHaveCount(1);
    }

    // The hero invites the visitor onward to the sweets.
    const cta = page.getByRole("link", { name: GREETING.continueCta });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("href", /#sweets$/);
    await expect(page.getByRole("link", { name: /read my wishes/i })).toHaveCount(0);

    const wishes = page.locator("#wishes");
    await wishes.scrollIntoViewIfNeeded();
    await expect(wishes.getByRole("heading", { level: 2, name: GREETING.final.heading })).toBeVisible();
    await expect(wishes.locator('[lang="ta"]', { hasText: GREETING.final.headingTa }).first()).toBeVisible();
    await expect(wishes.getByText(GREETING.final.message)).toBeVisible();
    await expect(wishes.getByText(GREETING.final.wish)).toBeVisible();
    await expect(wishes.getByText(GREETING.final.closing)).toBeVisible();
    await expect(wishes.getByText(SENDER_NAME, { exact: true })).toBeVisible();

    expect(errors).toEqual([]);
  });

  test("by keyboard: Enter lights it", async ({ page }) => {
    await page.goto("/");
    await mainVilakku(page).focus();
    await page.keyboard.press("Enter");
    await expect(mainVilakku(page)).toHaveAttribute("aria-pressed", "true");
  });

  test("by keyboard: Space lights it", async ({ page }) => {
    await page.goto("/");
    await mainVilakku(page).focus();
    await page.keyboard.press("Space");
    await expect(mainVilakku(page)).toHaveAttribute("aria-pressed", "true");
  });

  test("the little vilakkus can each be lit, and lighting all of them celebrates", async ({ page }) => {
    await page.goto("/");
    await lightMain(page);

    const small = page.getByRole("button", { name: /little vilakku/i });
    await expect(small).toHaveCount(5);
    for (let i = 0; i < 5; i++) {
      await small.nth(i).click();
      await expect(small.nth(i)).toHaveAttribute("aria-pressed", "true");
    }
    await expect(page.getByText(GREETING.allLit).first()).toBeVisible();
  });
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("lights instantly with no decorative motion", async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto("/");

    // Decorative motion layers are removed.
    await expect(page.locator("canvas")).toHaveCount(0);
    await expect(page.locator(".particle").first()).toBeHidden();

    await lightMain(page);
    const flame = page.locator('button[data-lit="true"] .vilakku-flame').first();
    // With reduced motion the lit state is reached almost immediately.
    await expect.poll(() => flame.evaluate((el) => Number(getComputedStyle(el).opacity)), { timeout: 500 }).toBe(1);
    await expect(page.locator(".spark")).toHaveCount(0);
    await expect(page.locator(".petal").first()).toBeHidden();
    await expect(page.locator("#wishes")).toBeVisible();
    expect(errors).toEqual([]);
  });
});

test("pauses CSS animations while the tab is hidden", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, get: () => true });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(page.locator("html")).toHaveAttribute("data-page-hidden", "");
  const state = await page.locator(".invite").evaluate((el) => getComputedStyle(el).animationPlayState);
  expect(state).toBe("paused");
});

test.describe("sharing", () => {
  test("WhatsApp link carries the greeting, one 🪔 and the site URL", async ({ page, baseURL }) => {
    await page.goto("/?from=somewhere#wishes");
    await lightMain(page);
    await expect(page.getByRole("heading", { name: GREETING.share.heading })).toBeVisible();
    const href = await page.getByTestId("share-whatsapp").getAttribute("href");
    expect(href).toBeTruthy();
    const wa = new URL(href!);
    expect(wa.origin).toBe("https://wa.me");
    const text = wa.searchParams.get("text")!;
    expect(Array.from(text.matchAll(/🪔/gu))).toHaveLength(1);
    expect(text).toContain(TAMIL_GREETING);
    // Always the clean site root, regardless of the visitor's query string or hash.
    expect(text.split("\n").at(-1)).toBe(`${baseURL}/`);
    await expect(page.getByTestId("share-whatsapp")).toHaveAttribute("target", "_blank");
  });

  test("native share button appears when supported and shares the site URL", async ({ page, baseURL }) => {
    await page.addInitScript(() => {
      const calls: unknown[] = [];
      (window as unknown as { __shareCalls: unknown[] }).__shareCalls = calls;
      Object.defineProperty(navigator, "share", {
        configurable: true,
        value: (data: unknown) => {
          calls.push(data);
          return Promise.resolve();
        },
      });
    });
    await page.goto("/");
    await lightMain(page);
    await page.getByTestId("share-native").click();
    const calls = await page.evaluate(() => (window as unknown as { __shareCalls: Array<Record<string, string>> }).__shareCalls);
    expect(calls).toHaveLength(1);
    expect(calls[0].url).toBe(`${baseURL}/`);
    expect(calls[0].text).toContain("🪔");
    await expect(page.getByText("Thank you for sharing the light!").first()).toBeVisible();
  });

  test("native share button is hidden when unsupported", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "share", { configurable: true, value: undefined });
    });
    await page.goto("/");
    await lightMain(page);
    await expect(page.getByTestId("share-copy")).toBeVisible();
    await expect(page.getByTestId("share-native")).toHaveCount(0);
  });

  test("copy link copies the site URL and confirms", async ({ page, baseURL, browserName, context }) => {
    if (browserName === "chromium") {
      await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    }
    await page.goto("/");
    await lightMain(page);
    await page.getByTestId("share-copy").click();

    const status = page.locator("p[aria-hidden='true']").filter({ hasText: /Link copied|Couldn't copy/ });
    await expect(status).toBeVisible();
    if (browserName === "chromium") {
      await expect(page.getByTestId("share-copy")).toHaveText("Copied!");
      expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(`${baseURL}/`);
    }
  });
});

test.describe("layout and typography", () => {
  for (const viewport of [
    { width: 360, height: 740 },
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1440, height: 900 },
  ]) {
    test(`no horizontal overflow at ${viewport.width}px, before and after lighting`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto("/");
      const overflow = () => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(await overflow()).toBeLessThanOrEqual(0);
      await lightMain(page);
      await page.locator("#wishes").scrollIntoViewIfNeeded();
      expect(await overflow()).toBeLessThanOrEqual(0);
    });
  }

  test("the main Vilakku and its label fit in the first screen on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto("/");
    const box = await mainVilakku(page).boundingBox();
    expect(box).not.toBeNull();
    expect(box!.y + box!.height).toBeLessThanOrEqual(740);
  });

  test("Tamil text uses Noto Serif Tamil and the font actually loads", async ({ page }) => {
    await page.goto("/");
    await lightMain(page);
    const tamil = page.locator("#wishes [lang='ta']").first();
    await tamil.scrollIntoViewIfNeeded();
    await expect(tamil).toBeVisible();
    const family = await tamil.evaluate((el) => getComputedStyle(el).fontFamily);
    expect(family).toMatch(/Noto Serif Tamil/i);
    const loaded = await page.evaluate(async () => {
      await document.fonts.ready;
      return [...document.fonts].some((f) => /Noto Serif Tamil/i.test(f.family) && f.status === "loaded");
    });
    expect(loaded).toBe(true);
    // No text in the greeting card overflows its box.
    const overflowing = await page
      .locator("#wishes p")
      .evaluateAll((els) => els.filter((el) => el.scrollWidth > el.clientWidth + 1).length);
    expect(overflowing).toBe(0);
  });
});

test.describe("accessibility (axe)", () => {
  test("no serious or critical violations before and after lighting", async ({ page }) => {
    await page.goto("/");
    const before = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    const serious = (r: typeof before) => r.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious(before), JSON.stringify(serious(before), null, 2)).toEqual([]);

    await lightMain(page);
    // Let reveal animations settle so contrast is measured on final colours.
    await page.waitForTimeout(2500);
    const after = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    expect(serious(after), JSON.stringify(serious(after), null, 2)).toEqual([]);
  });
});

test.describe("metadata", () => {
  test("has social preview tags and a 1200×630 Open Graph image", async ({ page, request }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Happy Deepavali from Jegan!/);
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute("content");
    expect(ogImage).toBeTruthy();
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", /இனிய தீபாவளி/);

    const res = await request.get(new URL(ogImage!).pathname);
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("image/png");
    const png = await res.body();
    // PNG IHDR: width and height are big-endian uint32 at bytes 16 and 20.
    expect(png.readUInt32BE(16)).toBe(1200);
    expect(png.readUInt32BE(20)).toBe(630);
  });
});
