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

test("the desk cat follows ahead and sits to look behind without flipping", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const scene = page.locator(".desk-companion");
  const home = scene.locator("[data-cat-home]");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "on");
  await expect(
    page.getByRole("button", { name: "Call the cat", exact: true }),
  ).toHaveCount(0);
  const bounds = (await scene.boundingBox())!;
  const start = await home.evaluate((el) => el.getBoundingClientRect().left);
  await page.mouse.move(
    bounds.x + bounds.width * 0.3,
    bounds.y + bounds.height * 0.65,
  );
  await expect(home).toHaveAttribute("data-pose", "walk");
  await expect
    .poll(() => home.evaluate((el) => el.getBoundingClientRect().left))
    .toBeLessThan(start - 25);
  const beforeTurn = await home.evaluate(
    (el) => el.getBoundingClientRect().left,
  );
  await page.mouse.move(
    bounds.x + bounds.width * 0.95,
    bounds.y + bounds.height * 0.65,
  );
  await expect(home).toHaveAttribute("data-pose", "sit");
  const seated = await home.evaluate((el) => el.getBoundingClientRect().left);
  expect(Math.abs(seated - beforeTurn)).toBeLessThan(5);
  // Hold the cursor behind her: no repositioning, reversal, or delayed jump.
  const samples = await home.evaluate(async (el) => {
    const values: { x: number; body: string; gaze: number }[] = [];
    const start = performance.now();
    while (performance.now() - start < 3000) {
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => resolve()),
      );
      values.push({
        x: el.getBoundingClientRect().left,
        body: el.querySelector<SVGSVGElement>("[data-cat]")!.style.transform,
        gaze: parseFloat((el as HTMLElement).style.getPropertyValue("--hx")),
      });
    }
    return values;
  });
  expect(
    Math.max(...samples.map((v) => v.x)) - Math.min(...samples.map((v) => v.x)),
  ).toBeLessThan(0.1);
  expect(samples.every((v) => v.body === "scaleX(1)")).toBe(true);
  expect(samples.at(-1)!.gaze).toBeGreaterThan(0);
  // Moving above her changes her gaze, keeping the seated body in place.
  await page.mouse.move(bounds.x + bounds.width * 0.95, bounds.y);
  await expect
    .poll(() =>
      home.evaluate((el) =>
        parseFloat((el as HTMLElement).style.getPropertyValue("--hy")),
      ),
    )
    .toBeLessThan(-0.2);
  expect(
    await home.evaluate((el) => el.getBoundingClientRect().left),
  ).toBeCloseTo(seated, 1);
  // Bring the cursor ahead again and she resumes walking in the same direction.
  await page.mouse.move(
    bounds.x + bounds.width * 0.1,
    bounds.y + bounds.height * 0.65,
  );
  await expect(home).toHaveAttribute("data-pose", "walk");
  await expect
    .poll(() => home.evaluate((el) => el.getBoundingClientRect().left))
    .toBeLessThan(seated - 15);
  await expect(home.locator("[data-cat]")).toHaveCSS(
    "transform",
    "matrix(1, 0, 0, 1, 0, 0)",
  );
  await expect(page.locator(".desk-flight, .pounce-marker")).toHaveCount(0);
  expect(
    await scene
      .locator(".laptop-foreground")
      .evaluate((lid) => getComputedStyle(lid).zIndex),
  ).toBe("3");
});

test("hovering Projects and Blog visibly lifts the cat's head without moving her body", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "on");
  await page.locator(".about-page").evaluate(async (el) => {
    await Promise.all(
      el.getAnimations().map((animation) => animation.finished),
    );
  });
  const home = page.locator("[data-cat-home]");
  const snapshot = () =>
    home.evaluate((el) => {
      const body = el.getBoundingClientRect();
      const head = el.querySelector(".seated-head")!.getBoundingClientRect();
      return {
        x: body.x,
        y: body.y,
        headY: head.y + head.height / 2 - body.y,
        eyesY: new DOMMatrixReadOnly(
          getComputedStyle(el.querySelector(".seated-head .cat-eyes")!)
            .transform,
        ).m42,
        direction:
          el.querySelector<SVGSVGElement>("[data-cat]")!.style.transform,
      };
    });
  const initial = await snapshot();
  const navigation = page.getByRole("navigation", { name: "Main navigation" });
  for (const name of ["Projects", "Blog", "Projects"]) {
    await navigation.getByRole("link", { name, exact: true }).hover();
    await expect(home).toHaveAttribute("data-pose", "sit");
    await expect
      .poll(async () => (await snapshot()).headY)
      .toBeLessThan(initial.headY - 3);
    await expect.poll(async () => (await snapshot()).eyesY).toBeLessThan(-1);
    const current = await snapshot();
    expect(current.x).toBeCloseTo(initial.x, 1);
    expect(current.y).toBeCloseTo(initial.y, 1);
    expect(current.direction).toBe("scaleX(1)");
  }
});

test("desk tracking cleans up on navigation and respects reduced motion", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const home = page.locator("[data-cat-home]");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "on");
  let bounds = (await page.locator(".desk-companion").boundingBox())!;
  await page.mouse.move(bounds.x, bounds.y + bounds.height * 0.65);
  await expect(home).toHaveAttribute("data-pose", "walk");
  const navigation = page.getByRole("navigation", { name: "Main navigation" });
  await navigation.getByRole("link", { name: "Projects", exact: true }).click();
  await expect(home).toHaveCount(0);
  await page.mouse.move(50, 50);
  await navigation.getByRole("link", { name: "About", exact: true }).click();
  await expect(home).toBeVisible();
  bounds = (await page.locator(".desk-companion").boundingBox())!;
  await page.mouse.move(bounds.x, bounds.y + bounds.height * 0.65);
  await expect(home).toHaveAttribute("data-pose", "walk");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("html")).toHaveAttribute("data-motion", "off");
  await expect(home).toHaveAttribute("data-pose", "sit");
  const paused = await home.evaluate((el) => el.getBoundingClientRect().left);
  await page.mouse.move(bounds.x + bounds.width, bounds.y + bounds.height);
  await page.waitForTimeout(400);
  expect(await home.evaluate((el) => el.getBoundingClientRect().left)).toBe(
    paused,
  );
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator("html")).toHaveAttribute("data-motion", "on");
  await page.mouse.move(bounds.x, bounds.y + bounds.height * 0.65);
  await expect(home).toHaveAttribute("data-pose", "walk");
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
