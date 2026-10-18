import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync } from "node:fs";
const originals: { url: string }[] = JSON.parse(
  readFileSync(new URL("../tests/legacy-posts.json", import.meta.url), "utf8"),
);

test("the homepage introduces Akash and the main tabs open their own pages", async ({
  page,
}) => {
  await page.goto("/");
  const navigation = page.getByRole("navigation", { name: "Main navigation" });
  await expect(
    navigation.getByRole("link", { name: "About", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Akash Nair.",
  );
  await expect(
    page.getByRole("tablist", { name: "Choose a project" }),
  ).toHaveCount(0);
  await page.getByRole("link", { name: "See what I'm working on" }).click();
  await expect(page).toHaveURL(/\/projects\/$/);
  await expect(
    navigation.getByRole("link", { name: "Projects", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await navigation.getByRole("link", { name: "Blog", exact: true }).click();
  await expect(page).toHaveURL(/\/blog\/$/);
  await expect(
    navigation.getByRole("link", { name: "Blog", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await expect(
    page.getByRole("heading", { name: "Blog archive", exact: true }),
  ).toBeVisible();
  await navigation.getByRole("link", { name: "About", exact: true }).click();
  await expect(page).toHaveURL("http://127.0.0.1:4173/");
});

test("project tabs support keyboard, deep links, and back navigation", async ({
  page,
}) => {
  await page.goto("/projects/");
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
  await page.goto("/projects/");
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

test("the homelab architecture groups home and cloud nodes inside one k3s cluster", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  const external: string[] = [];
  page.on("request", (request) => {
    if (new URL(request.url()).origin !== "http://127.0.0.1:4173")
      external.push(request.url());
  });
  await page.goto("/projects/#homelab");
  const cluster = page.getByRole("region", {
    name: "k3s cluster",
    exact: true,
  });
  const pis = cluster.getByRole("region", { name: "Raspberry Pis nodes" });
  await expect(pis.getByRole("listitem")).toHaveCount(3);
  await expect(pis.getByText("Control plane", { exact: true })).toBeVisible();
  await expect(pis.getByText("Worker", { exact: true })).toHaveCount(2);
  await expect(
    cluster
      .getByRole("region", { name: "Oracle Cloud nodes" })
      .getByRole("listitem"),
  ).toHaveCount(3);
  await expect(
    cluster
      .getByRole("region", { name: "Google Cloud nodes" })
      .getByRole("listitem"),
  ).toHaveCount(1);
  await expect(cluster.getByText("Tailscale", { exact: true })).toBeVisible();
  await expect(cluster.getByText("Argo CD", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Simulate deployment" }),
  ).toHaveCount(0);
  expect(external).toEqual([]);
  for (const colorScheme of ["light", "dark"] as const) {
    await page.emulateMedia({ colorScheme, reducedMotion: "reduce" });
    await expect(page.locator("html")).toHaveAttribute(
      "data-theme",
      colorScheme,
    );
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  }
});

test("preferences persist and reduced motion starts with a paused background", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "off");
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
    await page.goto("/projects/");
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
    for (const route of ["/projects/", "/", "/blog/"]) {
      await page.goto(route);
      for (const width of [1280, 768, 390, 320]) {
        await page.setViewportSize({ width, height: 1000 });
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth > innerWidth,
          ),
          `${colorScheme} ${width} ${route}`,
        ).toBe(false);
      }
      await page.setViewportSize({ width: 1280, height: 1000 });
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(results.violations, `${colorScheme} ${route}`).toEqual([]);
    }
  }
});
