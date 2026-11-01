import { test, expect } from "@playwright/test";
const slugs = [
  "how-to-make-a-psytrance-kick",
  "kick-bass-phase-alignment",
  "best-free-vst-plugins-edm",
  "kick-synthesizer-vs-samples",
  "compress-drums-without-losing-punch",
];
test("public pages render and exclude unpublished content", async ({
  page,
  request,
}) => {
  for (const path of [
    "/",
    "/articles",
    "/tutorials",
    "/reviews",
    "/free-tools",
    "/about",
    "/editorial-policy",
    "/disclosures",
    "/privacy",
    "/terms",
    "/contact",
    "/authors/azazel-audio-editorial",
    "/categories/mixing",
  ]) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("link[rel=canonical]")).toHaveCount(1);
  }
  for (const path of ["/rss.xml", "/sitemap.xml"]) {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    const text = await response.text();
    for (const slug of slugs) expect(text).not.toContain(slug);
  }
  expect((await request.get("/articles/" + slugs[0])).status()).toBe(404);
});
test("all five previews, metadata, related links and search", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/preview");
  await expect(page.locator(".card")).toHaveCount(5);
  await page.getByRole("searchbox").fill("polarity");
  await expect(page.locator(".card")).toHaveCount(2);
  await page.getByRole("searchbox").fill("");
  await page.getByLabel("Experience").selectOption("Beginner");
  await expect(page.locator(".card")).toHaveCount(2);
  for (const slug of slugs) {
    await page.goto("/preview/articles/" + slug);
    await expect(page.locator(".prose")).toBeVisible();
    await expect(page.locator("meta[name=robots]")).toHaveAttribute(
      "content",
      "noindex, nofollow",
    );
    await expect(
      page.getByRole("navigation", { name: "Table of contents" }),
    ).toBeVisible();
    expect(
      await page.locator('.prose a[href^="/preview/articles/"]').count(),
    ).toBeGreaterThanOrEqual(2);
    await expect(page.locator("audio")).toHaveCount(0);
    const schema = await page
      .locator('script[type="application/ld+json"]')
      .first()
      .textContent();
    expect(JSON.parse(schema || "{}")["@type"]).toBe("BlogPosting");
    expect(schema).not.toContain("aggregateRating");
  }
  expect(errors).toEqual([]);
});
test("production denies previews even with preview env enabled", async ({
  request,
}) => {
  for (const path of [
    "/preview",
    "/preview/articles/" + slugs[0],
    "/articles/" + slugs[0],
  ])
    expect((await request.get("http://127.0.0.1:3101" + path)).status()).toBe(
      404,
    );
  const html = await (await request.get("http://127.0.0.1:3101/")).text();
  for (const slug of slugs) expect(html).not.toContain(slug);
  expect(
    await (await request.get("http://127.0.0.1:3101/robots.txt")).text(),
  ).toContain("Disallow: /preview");
});
for (const width of [360, 390, 768, 1024, 1440])
  test(`responsive layout at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ["/", "/preview", "/preview/articles/" + slugs[0]]) {
      await page.goto(path);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
    }
    await page.screenshot({
      path: `test-results/preview-${width}.png`,
      fullPage: true,
    });
  });
test("keyboard navigation, frequency tool and honest subscription state", async ({
  page,
}) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByText("Skip to content")).toBeFocused();
  await expect(
    page.getByRole("button", { name: "Coming after editorial launch" }),
  ).toBeDisabled();
  await page.goto("/free-tools");
  await page.getByLabel("MIDI note").fill("69");
  await expect(page.locator("output")).toHaveText("440.00 Hz");
});
test("SSR content works without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3100/preview");
  await expect(page.locator(".card")).toHaveCount(5);
  await page.goto("http://127.0.0.1:3100/preview/articles/" + slugs[0]);
  await expect(page.locator(".prose")).toContainText(
    "Start with a clean oscillator",
  );
  await context.close();
});

test("WCAG automated checks on representative routes", async ({ page }) => {
  const { default: AxeBuilder } = await import("@axe-core/playwright");
  for (const path of [
    "/",
    "/preview",
    "/preview/articles/" + slugs[0],
    "/free-tools",
  ]) {
    await page.goto(path);
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(result.violations).toEqual([]);
  }
});
