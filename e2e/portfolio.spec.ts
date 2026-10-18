import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync } from "node:fs";
const originals: { url: string }[] = JSON.parse(
  readFileSync(new URL("../tests/legacy-posts.json", import.meta.url), "utf8"),
);

test("project tabs support keyboard, deep links, and back navigation", async ({
  page,
}) => {
  await page.goto("/");
  const power = page.getByRole("tab", { name: "Power Hour" });
  await expect(power).toHaveAttribute("aria-selected", "true");
  await power.focus();
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("tab", { name: "iNAB" })).toBeFocused();
  await expect(page.getByRole("tabpanel")).toHaveAttribute("id", "panel-inab");
  await expect(page).toHaveURL(/#inab$/);
  await page.getByRole("tab", { name: "Homelab" }).click();
  await expect(page.getByRole("tabpanel")).toHaveAttribute(
    "id",
    "panel-homelab",
  );
  await page.goBack();
  await expect(page.getByRole("tabpanel")).toHaveAttribute("id", "panel-inab");
  await page.goBack();
  await expect(power).toHaveAttribute("aria-selected", "true");
  await page.goForward();
  await expect(page.getByRole("tabpanel")).toHaveAttribute("id", "panel-inab");
  await page.reload();
  await expect(page.getByRole("tab", { name: "iNAB" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
});

test("actual screenshots load, cycle, and enlarge in an accessible dialog", async ({
  page,
}) => {
  await page.goto("/");
  const panel = page.getByRole("tabpanel");
  const image = panel.locator(".screenshot-open img");
  await expect(image).toBeVisible();
  await expect
    .poll(() => image.evaluate((img: HTMLImageElement) => img.naturalWidth))
    .toBeGreaterThan(0);
  await panel
    .getByRole("button", { name: "Next Power Hour screenshot" })
    .click();
  await expect(image).toHaveAttribute("src", /power-hour-muscles/);
  await panel
    .getByRole("button", { name: "Enlarge Power Hour screenshot" })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    panel.getByRole("button", { name: "Enlarge Power Hour screenshot" }),
  ).toBeFocused();
});

test("workout and budget sketches respond and the timer stops when switching projects", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Try a demo" }).first().click();
  const workout = page.locator(".workout-demo");
  await workout
    .getByRole("button", { name: "Start demo", exact: true })
    .click();
  await expect(workout.locator(".timer-value")).not.toHaveText("00:40");
  await workout.getByRole("button", { name: "Pause", exact: true }).click();
  const time = await workout.locator(".timer-value").innerText();
  await page.waitForTimeout(1100);
  await expect(workout.locator(".timer-value")).toHaveText(time);
  await workout.getByRole("button", { name: "Next", exact: true }).click();
  await expect(workout.getByRole("heading", { name: "Rest" })).toBeVisible();
  await workout.getByRole("button", { name: "Reset session" }).click();
  await workout
    .getByRole("button", { name: "Start demo", exact: true })
    .click();
  await page.getByRole("tab", { name: "iNAB" }).click();
  await page.waitForTimeout(400);
  await page.getByRole("tab", { name: "Power Hour" }).click();
  await expect(
    workout.getByRole("button", { name: "Start demo", exact: true }),
  ).toBeVisible();
  await page.getByRole("tab", { name: "iNAB" }).click();
  await page
    .getByRole("tabpanel")
    .getByRole("button", { name: "Try a demo" })
    .click();
  const budget = page.locator(".budget-demo");
  await budget.getByRole("button", { name: "Add €20 expense" }).click();
  await expect(budget.locator(".budget-value")).toHaveText("€114");
  await page.getByLabel("Dining budget").fill("400");
  await expect(budget.locator(".budget-value")).toHaveText("€194");
  await budget.getByRole("button", { name: "Reset", exact: true }).click();
  await expect(budget.locator(".budget-value")).toHaveText("€134");
});

test("homelab simulation is local and finishes without calling any external API", async ({
  page,
}) => {
  const external: string[] = [];
  page.on("request", (request) => {
    if (new URL(request.url()).origin !== "http://127.0.0.1:4173")
      external.push(request.url());
  });
  await page.goto("/#homelab");
  const panel = page.getByRole("tabpanel");
  await panel.getByRole("button", { name: "Cloud nodes", exact: true }).click();
  await expect(panel.locator(".node-information h3")).toHaveText("Cloud nodes");
  await panel.getByRole("button", { name: "Simulate deployment" }).click();
  await expect(panel.getByRole("status")).toHaveText(
    "Demo complete. No changes were made to the cluster.",
    { timeout: 7000 },
  );
  expect(external).toEqual([]);
});

test("preferences persist and reduced motion starts with a paused background", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "off");
  await expect(
    page.getByRole("button", { name: "Play background", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Use dark theme" }).click();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "off");
});

test("archive search and every old article URL work on the exported static host", async ({
  page,
  request,
}) => {
  await page.goto("/blog/");
  await expect(page.getByRole("status")).toHaveText("25 posts");
  await page.getByRole("searchbox").fill("terrafying");
  await expect(page.getByRole("status")).toHaveText("1 post");
  await page
    .getByRole("link", { name: /Making Terraform Less Terrafying/ })
    .click();
  await expect(
    page.getByRole("heading", {
      name: "Making Terraform Less Terrafying",
      level: 1,
      exact: true,
    }),
  ).toBeVisible();
  await expect
    .poll(() =>
      page
        .locator(".article-body img")
        .first()
        .evaluate((image: HTMLImageElement) => image.naturalWidth),
    )
    .toBeGreaterThan(0);
  for (const post of originals) {
    const response = await request.get(post.url);
    expect(response.status(), post.url).toBe(200);
  }
});

test("light, dark and narrow layouts remain accessible and fit their viewport", async ({
  page,
}) => {
  for (const colorScheme of ["light", "dark"] as const) {
    await page.emulateMedia({ colorScheme, reducedMotion: "reduce" });
    await page.goto("/");
    for (const width of [1280, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const name of ["Power Hour", "iNAB", "Homelab"]) {
        await page.getByRole("tab", { name }).click();
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        );
        expect(overflow, `${colorScheme} ${width} ${name}`).toBe(false);
      }
    }
    await page.setViewportSize({ width: 1280, height: 1000 });
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  }
});
