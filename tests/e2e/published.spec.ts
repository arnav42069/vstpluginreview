import { test, expect } from "@playwright/test";
const slugs = [
  "best-compressor-vst-plugins-2026",
  "best-free-vst-plugins-2026",
  "modular-synthesis-beginners-guide",
  "kick-drum-synthesis-guide",
];
test("four published guides have distinct SSR metadata, working TOCs and images", async ({
  page,
  request,
  browser,
}) => {
  const titles = new Set<string>();
  for (const slug of slugs) {
    const response = await page.goto("/articles/" + slug);
    expect(response?.status()).toBe(200);
    titles.add(await page.title());
    await expect(page.locator(".prose")).toBeVisible();
    const headings = await page
      .locator(".toc a")
      .evaluateAll((links) =>
        links.map((a) => a.getAttribute("href")!.slice(1)),
      );
    expect(headings.length).toBeGreaterThan(6);
    for (const id of headings)
      expect(
        await page
          .locator("[id]")
          .evaluateAll((els, id) => els.some((el) => el.id === id), id),
      ).toBe(true);
    const hero = page.locator(".article-hero img");
    await expect(hero).toBeVisible();
    expect(
      await hero.evaluate(
        (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
      ),
    ).toBe(true);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      new RegExp(slug + "/featured.png$"),
    );
    const schemas = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    expect(
      schemas.some((s) => JSON.parse(s)["@type"] === "BreadcrumbList"),
    ).toBe(true);
    expect(schemas.join()).not.toContain("aggregateRating");
    await page.setViewportSize({ width: 390, height: 844 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  }
  expect(titles.size).toBe(4);
  for (const path of ["/sitemap.xml", "/rss.xml"]) {
    const body = await (await request.get(path)).text();
    for (const slug of slugs) expect(body).toContain("/articles/" + slug);
  }
  const context = await browser.newContext({ javaScriptEnabled: false });
  const nojs = await context.newPage();
  await nojs.goto("/articles/" + slugs[0]);
  await expect(nojs.locator(".prose")).toContainText("threshold");
  await context.close();
});
test("new public article remains readable in both themes without hydration errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const { default: AxeBuilder } = await import("@axe-core/playwright");
  for (const slug of slugs) {
    await page.goto("/articles/" + slug);
    for (const theme of ["Light", "Dark"]) {
      await page.getByText("Settings", { exact: true }).click();
      await page.getByRole("button", { name: theme, exact: true }).click();
      await page.getByText("Settings", { exact: true }).click();
      const result = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(result.violations).toEqual([]);
    }
  }
  expect(errors).toEqual([]);
});
