import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { GREETING } from "../src/lib/greeting";

/**
 * The celebration that follows lighting the Vilakku: sweets, virtual
 * crackers, family wishes and the personality picker.
 */

/** The forbidden term from AGENTS.md, built so it never appears literally in source. */
const FORBIDDEN_TERM = String.fromCharCode(100, 105, 121, 97);

const SECTIONS = ["#sweets", "#crackers", "#family", "#personality", "#wishes"] as const;

/** Contract copy, pinned here so drift in src/lib/greeting.ts is caught. */
const SWEET_CONTRACT: Record<string, { name: string; message: string }> = {
  laddu: { name: "Laddu", message: "One laddu? That's just the beginning!" },
  adhirasam: { name: "Adhirasam", message: "Calories don't count on Deepavali!" },
  "mysore-pak": { name: "Mysore Pak", message: "Save some for the others... if you can!" },
  murukku: { name: "Murukku", message: "Diet starts tomorrow!" },
  jangiri: { name: "Jangiri", message: GREETING.sweets.items.find((s) => s.id === "jangiri")!.message },
};
const SWEETS_TAMIL_LINE = "தீபாவளி என்றால் முதலில் ஞாபகம் வருவது இனிப்புதான்!";
const CRACKER_MESSAGES: readonly string[] = GREETING.crackers.messages;

function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push(String(e)));
  return errors;
}

async function lightMain(page: Page) {
  await page.getByRole("button", { name: /tap to light the vilakku/i }).click();
  // Once lit, the same button is renamed "The Vilakku is lit".
  await expect(page.getByRole("button", { name: /the vilakku is lit/i })).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#sweets")).toBeAttached();
}

async function tasteAllSweets(page: Page) {
  for (const id of Object.keys(SWEET_CONTRACT)) {
    const sweet = page.getByTestId(`sweet-${id}`);
    await sweet.click();
    await expect(sweet).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByTestId("sweet-message")).toContainText(SWEET_CONTRACT[id].message);
  }
}

async function expectCrackerMessage(page: Page) {
  await expect
    .poll(async () => CRACKER_MESSAGES.includes(((await page.getByTestId("crackers-message").textContent()) ?? "").trim()), {
      message: "crackers-message should show one of GREETING.crackers.messages",
    })
    .toBe(true);
}

async function pickEachPersonality(page: Page) {
  const section = page.locator("#personality");
  const options = GREETING.personality.options;
  for (const option of options) {
    await section.getByRole("button", { name: option.label }).click();
    for (const other of options) {
      await expect(section.getByRole("button", { name: other.label })).toHaveAttribute(
        "aria-pressed",
        other.id === option.id ? "true" : "false",
      );
    }
    await expect(page.getByTestId("personality-response")).toContainText(option.response);
  }
}

test.describe("sweets", () => {
  test("each sweet can be tasted and responds playfully", async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto("/");
    await lightMain(page);

    const section = page.locator("#sweets");
    await section.scrollIntoViewIfNeeded();
    await expect(section.getByRole("heading", { name: GREETING.sweets.heading })).toBeVisible();
    const tamil = section.locator('[lang="ta"]', { hasText: SWEETS_TAMIL_LINE }).first();
    await expect(tamil).toBeVisible();

    // Every sweet is a named button.
    for (const [id, { name }] of Object.entries(SWEET_CONTRACT)) {
      const sweet = page.getByTestId(`sweet-${id}`);
      await expect(sweet).toHaveRole("button");
      await expect(sweet).toHaveAccessibleName(new RegExp(name, "i"));
    }

    await expect(section.getByText(GREETING.sweets.allTasted)).toHaveCount(0);
    await expect(page.getByTestId("plate-sweet")).toHaveCount(0);
    await tasteAllSweets(page);
    await expect(section.getByText(GREETING.sweets.allTasted).first()).toBeVisible();

    // Every tap adds that sweet to the visitor's banana-leaf plate.
    await expect(page.getByTestId("plate-sweet")).toHaveCount(5);
    await expect(section.getByText("5 sweets on your plate", { exact: true })).toBeVisible();
    await page.getByTestId("sweet-laddu").click();
    await expect(page.getByTestId("plate-sweet")).toHaveCount(6);

    expect(errors).toEqual([]);
  });

  test("a sweet can be tasted with the keyboard", async ({ page }) => {
    await page.goto("/");
    await lightMain(page);
    const laddu = page.getByTestId("sweet-laddu");
    await laddu.focus();
    await page.keyboard.press("Enter");
    await expect(laddu).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByTestId("sweet-message")).toContainText(SWEET_CONTRACT.laddu.message);
  });
});

test.describe("virtual crackers", () => {
  test("sparkler, flower pot and fireworks respond, with a safety note", async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto("/");
    await lightMain(page);

    const section = page.locator("#crackers");
    await section.scrollIntoViewIfNeeded();
    await expect(section.getByRole("heading", { name: GREETING.crackers.heading })).toBeVisible();
    await expect(section.getByText(GREETING.crackers.safetyNote)).toBeVisible();

    const sparkler = page.getByTestId("sparkler");
    await expect(sparkler).toHaveAttribute("aria-pressed", "false");
    await sparkler.click();
    await expect(sparkler).toHaveAttribute("aria-pressed", "true");
    await expectCrackerMessage(page);

    const flowerPot = page.getByTestId("flower-pot");
    await flowerPot.click();
    await expect(flowerPot).toHaveAttribute("aria-pressed", "true");
    await expectCrackerMessage(page);

    await page.getByTestId("fireworks-button").click();
    await expect(page.locator("canvas").first()).toBeAttached();
    await expectCrackerMessage(page);

    expect(errors).toEqual([]);
  });

  test("the sparkler lights with Enter", async ({ page }) => {
    await page.goto("/");
    await lightMain(page);
    const sparkler = page.getByTestId("sparkler");
    await sparkler.focus();
    await page.keyboard.press("Enter");
    await expect(sparkler).toHaveAttribute("aria-pressed", "true");
    await expectCrackerMessage(page);
  });
});

test("family wishes are shown", async ({ page }) => {
  await page.goto("/");
  await lightMain(page);
  const section = page.locator("#family");
  await section.scrollIntoViewIfNeeded();
  await expect(section).toContainText(GREETING.family.heading);
  await expect(section).toContainText(GREETING.family.message);
});

test("choosing a Deepavali personality shows exactly one matching response", async ({ page }) => {
  await page.goto("/");
  await lightMain(page);
  await page.locator("#personality").scrollIntoViewIfNeeded();
  await expect(page.locator("#personality").getByRole("heading", { name: GREETING.personality.heading })).toBeVisible();
  await pickEachPersonality(page);
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("interactions still respond, without canvas or sparks", async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto("/");
    await lightMain(page);

    await page.getByTestId("sweet-laddu").click();
    await expect(page.getByTestId("sweet-message")).toContainText(SWEET_CONTRACT.laddu.message);
    await expect(page.locator(".spark")).toHaveCount(0);

    await page.getByTestId("sparkler").click();
    await expectCrackerMessage(page);
    await page.getByTestId("fireworks-button").click();
    await expectCrackerMessage(page);
    await expect(page.locator("canvas")).toHaveCount(0);
    await expect(page.locator(".spark")).toHaveCount(0);

    await pickEachPersonality(page);
    expect(errors).toEqual([]);
  });
});

test.describe("full journey", () => {
  test("no console errors, no forbidden term and no serious axe violations", async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto("/");
    await lightMain(page);

    await tasteAllSweets(page);
    await page.getByTestId("sparkler").click();
    await page.getByTestId("flower-pot").click();
    await page.getByTestId("fireworks-button").click();
    await expectCrackerMessage(page);
    await pickEachPersonality(page);

    // Scroll through every section so scroll-triggered reveals run.
    for (const id of SECTIONS) {
      await page.locator(id).scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
    }
    // Let reveal animations settle so contrast is measured on final colours.
    await page.waitForTimeout(1200);

    const text = (await page.locator("body").innerText()).toLowerCase();
    expect(text).not.toContain(FORBIDDEN_TERM);

    const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    const serious = result.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);

    expect(errors).toEqual([]);
  });

  test("no horizontal overflow at 360px after interacting", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto("/");
    await lightMain(page);

    await tasteAllSweets(page);
    await page.getByTestId("sparkler").click();
    await page.getByTestId("flower-pot").click();
    await page.getByTestId("fireworks-button").click();
    await pickEachPersonality(page);

    const overflow = () => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    for (const id of SECTIONS) {
      await page.locator(id).scrollIntoViewIfNeeded();
      // Transient sparks may briefly extend; the settled layout must fit.
      await expect.poll(overflow, { message: `overflow near ${id}`, timeout: 3000 }).toBeLessThanOrEqual(0);
    }
  });
});
