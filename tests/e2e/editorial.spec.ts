import { test, expect } from "@playwright/test";
test("editorial hierarchy uses local fonts, varied story patterns and a reachable search", async ({
  page,
}) => {
  const externalFonts: string[] = [];
  page.on("request", (r) => {
    if (/fonts\.(googleapis|gstatic)\.com/.test(r.url()))
      externalFonts.push(r.url());
  });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  expect(
    await page.evaluate(() => document.fonts.check('700 32px "Space Grotesk"')),
  ).toBe(true);
  expect(
    await page.evaluate(() => document.fonts.check("400 16px Inter")),
  ).toBe(true);
  expect(
    await page.locator("h1").evaluate((el) => getComputedStyle(el).fontFamily),
  ).toContain("Space Grotesk");
  await expect(page.locator(".featured-story")).toHaveCount(1);
  await expect(page.locator(".latest-grid .story-standard")).toHaveCount(1);
  await expect(page.locator(".latest-grid .story-compact")).toHaveCount(2);
  await page.getByRole("link", { name: "Search", exact: true }).click();
  await expect(page.locator("#article-search")).toBeVisible();
  await page.locator("#article-search").fill("FabFilter Pro-C 3");
  await expect(page.locator(".card")).toHaveCount(1);
  expect(externalFonts).toEqual([]);
});
test("article measure stays readable and sticky navigation leaves target headings visible", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/articles/modular-synthesis-beginners-guide");
  await page.evaluate(() => document.fonts.ready);
  const measure = await page.locator(".prose").evaluate((el) => {
    const s = getComputedStyle(el);
    return {
      width: el.getBoundingClientRect().width,
      size: parseFloat(s.fontSize),
      line: parseFloat(s.lineHeight),
      border: s.borderTopWidth,
    };
  });
  expect(measure.width).toBeGreaterThan(550);
  expect(measure.width).toBeLessThan(840);
  expect(measure.line / measure.size).toBeGreaterThan(1.7);
  expect(measure.border).toBe("0px");
  const link = page.locator(".toc a").nth(2);
  const id = (await link.getAttribute("href"))!.slice(1);
  await link.click();
  await expect
    .poll(() =>
      page.evaluate((id) => {
        const top = document.getElementById(id)!.getBoundingClientRect().top;
        const headerBottom = document
          .querySelector(".site-header")!
          .getBoundingClientRect().bottom;
        return top > headerBottom + 8 && top < window.innerHeight / 2;
      }, id),
    )
    .toBe(true);
  expect(
    await page
      .locator(".site-header")
      .evaluate((el) => el.getBoundingClientRect().bottom),
  ).toBeLessThan(120);
});
