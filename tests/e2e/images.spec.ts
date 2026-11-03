import { test, expect } from "@playwright/test";
const slugs = [
  "best-compressor-vst-plugins-2026",
  "best-free-vst-plugins-2026",
  "modular-synthesis-beginners-guide",
  "kick-drum-synthesis-guide",
];
test("published articles have relevant optimized image sets, provenance and working enlargement", async ({
  page,
  request,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const heroSources = new Set<string>();
  const manifest = await (
    await request.get("/media/asset-sources.json")
  ).json();
  for (const slug of slugs) {
    await page.goto("/articles/" + slug);
    const hero = page.locator(".article-hero img");
    heroSources.add((await hero.getAttribute("src"))!);
    await expect(hero).toHaveAttribute("src", /\.webp$/);
    await expect(page.locator(".article-hero figcaption")).not.toBeEmpty();
    const figures = page.locator(".prose .article-image");
    expect(await figures.count()).toBeGreaterThanOrEqual(4);
    for (const image of await page
      .locator(".prose img, .article-hero img")
      .all()) {
      await image.scrollIntoViewIfNeeded();
      await expect(image).toBeVisible();
      await expect
        .poll(() =>
          image.evaluate(
            (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
          ),
        )
        .toBe(true);
      const src = await image.getAttribute("src");
      expect(
        manifest.assets.some(
          (a: { asset: string; license: string; source: string }) =>
            a.asset === src && a.license && a.source,
        ),
      ).toBe(true);
    }
    const fullImageLink = page.locator(".prose a[data-enlarge-image]").first();
    await fullImageLink.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Close enlarged image" }),
    ).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).not.toBeVisible();
    await expect(fullImageLink).toBeFocused();
    await page.setViewportSize({ width: 390, height: 844 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  }
  expect(heroSources.size).toBe(4);
  expect(errors).toEqual([]);
});
test("lightbox is keyboard accessible and passes automated accessibility checks", async ({
  page,
}) => {
  await page.goto("/articles/best-compressor-vst-plugins-2026");
  await page.locator(".article-hero a[data-enlarge-image]").focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  const { default: AxeBuilder } = await import("@axe-core/playwright");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
  await page.getByRole("button", { name: "Close enlarged image" }).click();
  await expect(
    page.locator(".article-hero a[data-enlarge-image]"),
  ).toBeFocused();
});

test("mobile image delivery uses smaller files and enlargement retains the original", async ({
  page,
  request,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const cover = page.locator(".featured-art img");
  await expect(cover).toHaveAttribute("srcset", /480w/);
  await expect
    .poll(() =>
      cover.evaluate(
        (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
      ),
    )
    .toBe(true);
  const selected = await cover.evaluate(
    (img: HTMLImageElement) => img.currentSrc,
  );
  expect(selected).toContain("/responsive/");
  const manifest = await (
    await request.get("/media/asset-sources.json")
  ).json();
  expect(
    manifest.assets.some(
      (a: { asset: string; derivedFrom?: string }) =>
        a.asset === new URL(selected).pathname && a.derivedFrom,
    ),
  ).toBe(true);
  await page.goto("/articles/best-compressor-vst-plugins-2026");
  const screenshot = page.locator('.prose img[src$="pro-c-3-press.webp"]');
  await screenshot.scrollIntoViewIfNeeded();
  await expect(screenshot).toHaveAttribute("srcset", /800w/);
  const original = await screenshot.getAttribute("src");
  await screenshot.click();
  await expect(page.locator("dialog img")).toHaveAttribute("src", original!);
  expect(original).not.toContain("/responsive/");
});
