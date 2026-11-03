import { test, expect } from "@playwright/test";
test("personal bylines and author metadata replace company editorial branding", async ({
  page,
  request,
}) => {
  for (const path of [
    "/",
    "/about",
    "/contact",
    "/editorial-policy",
    "/disclosures",
    "/authors/adnan-singh",
    "/articles/best-compressor-vst-plugins-2026",
    "/articles/best-free-vst-plugins-2026",
    "/articles/modular-synthesis-beginners-guide",
  ]) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator("body")).not.toContainText("Azazel Audio");
    await expect(page.locator("body")).toContainText("Adnan Singh");
  }
  await page.goto("/articles/kick-drum-synthesis-guide");
  await expect(page.locator(".article-heading")).toContainText("Adnan Singh");
  await expect(page.locator(".site-header")).not.toContainText("Azazel Audio");
  await expect(page.locator("footer")).not.toContainText("Azazel Audio");
  await expect(page.locator(".prose")).toContainText(
    "Suckerpunch is developed by Azazel Audio",
  );
  const schema = JSON.parse(
    (await page
      .locator('script[type="application/ld+json"]')
      .first()
      .textContent())!,
  );
  expect(schema.author).toEqual({
    "@type": "Person",
    name: "Adnan Singh",
    url: expect.stringContaining("/authors/adnan-singh"),
  });
  expect(schema.publisher.parentOrganization).toBeUndefined();
  const legacy = await request.get("/authors/azazel-audio-editorial", {
    maxRedirects: 0,
  });
  expect(legacy.status()).toBe(301);
  expect(legacy.headers().location).toBe("/authors/adnan-singh");
  const map = await (await request.get("/sitemap.xml")).text();
  expect(map).toContain("/authors/adnan-singh");
  expect(map).not.toContain("azazel-audio-editorial");
  const rss = await (await request.get("/rss.xml")).text();
  expect(rss).toContain("<dc:creator>Adnan Singh</dc:creator>");
  expect(rss).not.toContain("Azazel Audio Editorial");
});
