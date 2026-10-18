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

test("the desk cat crouches on planted paws, pounces, and returns", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const scene = page.locator(".desk-companion");
  await expect(scene.locator(".pounce-marker")).toHaveCount(3);
  await expect(page.locator(".glasses")).toHaveCount(0);
  const points = await scene.locator(".pounce-marker").evaluateAll((dots) =>
    dots.map((dot) => ({
      x: parseFloat((dot as HTMLElement).style.left),
      y: parseFloat((dot as HTMLElement).style.top),
    })),
  );
  const target = points[0];
  const approach = Array.from({ length: 16 }, (_, i) => ({
    x: target.x + Math.cos((i * Math.PI) / 8) * 80,
    y: target.y + Math.sin((i * Math.PI) / 8) * 80,
  })).find((point) =>
    points.every((spot) => Math.hypot(point.x - spot.x, point.y - spot.y) > 65),
  );
  expect(approach).toBeDefined();
  await page.mouse.move(approach!.x, approach!.y);
  await expect(scene.locator("[data-cat-home]")).toHaveAttribute(
    "data-pose",
    "stalk",
  );
  const feet = await scene
    .locator(".side-rig .leg")
    .evaluateAll((legs) =>
      legs.map((leg) => Number((leg as HTMLElement).dataset.footY)),
    );
  expect(feet).toEqual([177, 177, 177, 177]);
  await expect(page.locator(".desk-flight")).toHaveCount(0);
  await page.mouse.move(target.x, target.y);
  await page.waitForFunction(
    () =>
      document.querySelector<HTMLElement>(".desk-companion")?.dataset
        .catPhase === "outbound",
  );
  const flying = page.locator(".desk-flight");
  await expect(flying).toHaveAttribute("aria-hidden", "true");
  await expect
    .poll(() =>
      flying
        .locator(".side-rig")
        .evaluate((rig) => getComputedStyle(rig).opacity),
    )
    .toBe("1");
  await page.waitForFunction(
    () =>
      document.querySelector<HTMLElement>(".desk-companion")?.dataset
        .catPhase === "caught",
  );
  await page.waitForFunction(
    () =>
      document.querySelector<HTMLElement>(".desk-companion")?.dataset.busy ===
      "false",
  );
  await expect(flying).toHaveCount(0);
  await expect(scene.locator("[data-cat-home]")).toBeVisible();
  await expect(scene.locator("[data-cat-home]")).toHaveAttribute(
    "data-pose",
    "walk",
  );
  expect(
    await scene
      .locator(".laptop-foreground")
      .evaluate((lid) => getComputedStyle(lid).zIndex),
  ).toBe("3");
});

test("desk animations clean up on navigation and reduced-motion changes", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const call = page.getByRole("button", { name: "Call the cat", exact: true });
  await expect(call).toBeEnabled();
  await call.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".desk-flight")).toHaveCount(1);
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Projects", exact: true })
    .click();
  await expect(page.locator(".desk-flight")).toHaveCount(0);
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "About", exact: true })
    .click();
  await expect(page.locator(".pounce-marker")).toHaveCount(3);
  await call.click();
  await expect(page.locator(".desk-flight")).toHaveCount(1);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".desk-flight")).toHaveCount(0);
  await expect(page.locator(".desk-call")).toBeDisabled();
  await expect(page.locator(".desk-call")).toBeHidden();
  await expect(page.locator(".pounce-marker")).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator(".pounce-marker")).toHaveCount(3);
  expect(errors).toEqual([]);
});

test("walking paws stay planted as the cat moves across the desk", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect(page.locator("[data-cat-home]")).toHaveAttribute(
    "data-pose",
    "walk",
    { timeout: 12_000 },
  );
  const samples = await page.evaluate(async () => {
    const home = document.querySelector<HTMLElement>("[data-cat-home]")!;
    const svg = home.querySelector<SVGSVGElement>("[data-cat]")!;
    const legs = [...home.querySelectorAll<SVGGElement>(".side-rig .leg")];
    const result: { x: number; feet: { x: number; planted: boolean }[] }[] = [];
    const start = performance.now();
    while (performance.now() - start < 1100) {
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => resolve()),
      );
      result.push({
        x: home.getBoundingClientRect().left,
        feet: legs.map((leg) => {
          const foot = new DOMPoint(
            Number(leg.dataset.footX),
            Number(leg.dataset.footY),
          );
          return {
            x: foot.matrixTransform(svg.getScreenCTM()!).x,
            planted: foot.y === 177,
          };
        }),
      });
    }
    return result;
  });
  expect(samples[0].x - samples.at(-1)!.x).toBeGreaterThan(10);
  let checkedContacts = 0;
  for (let leg = 0; leg < 4; leg++) {
    let contact: number[] = [];
    const check = () => {
      if (contact.length >= 6) {
        expect(Math.max(...contact) - Math.min(...contact)).toBeLessThan(0.75);
        checkedContacts++;
      }
      contact = [];
    };
    for (const sample of samples) {
      if (sample.feet[leg].planted) contact.push(sample.feet[leg].x);
      else check();
    }
    check();
  }
  expect(checkedContacts).toBeGreaterThanOrEqual(4);
});
