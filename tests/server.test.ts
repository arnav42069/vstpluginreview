import { afterEach, describe, it, expect, vi } from "vitest";
import raw from "../src/generated/articles.json";
afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
  vi.doUnmock("../src/generated/articles.json");
});
describe("server publication boundary", () => {
  it("never returns ready articles even to a production preview request", async () => {
    vi.stubEnv("SITE_ENV", "production");
    vi.stubEnv("VERCEL_ENV", "");
    vi.stubEnv("EDITORIAL_PREVIEW", "true");
    const site = await import("../src/lib/site.server");
    expect(site.previewEnabled).toBe(false);
    expect(site.getArticles(true)).toHaveLength(4);
    for (const a of raw.filter((a) => a.status !== "published")) {
      expect(site.sitemap()).not.toContain(a.slug);
      expect(site.rss()).not.toContain(a.slug);
    }
  });
  it("Vercel production cannot be overridden by SITE_ENV", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("SITE_ENV", "development");
    vi.stubEnv("EDITORIAL_PREVIEW", "true");
    const site = await import("../src/lib/site.server");
    expect(site.previewEnabled).toBe(false);
  });
  it("preview requires an explicit opt-in", async () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("EDITORIAL_PREVIEW", "false");
    const site = await import("../src/lib/site.server");
    expect(site.getArticles(true)).toHaveLength(4);
  });
  it("published sitemap and RSS contain canonical article records", async () => {
    vi.stubEnv("SITE_URL", "https://vstpluginreview.com");
    vi.doMock("../src/generated/articles.json", () => ({
      default: [
        { ...raw[0], status: "published", title: "Sound & <signal>" },
        ...raw.slice(1).map((a) => ({ ...a, status: "ready" })),
      ],
    }));
    const site = await import("../src/lib/site.server");
    expect(site.getArticles()).toHaveLength(1);
    expect(site.sitemap()).toContain("/articles/" + raw[0].slug);
    expect(site.rss()).toContain("Sound &amp; &lt;signal&gt;");
    expect(site.rss()).toContain("<pubDate>");
    expect(site.sitemap()).not.toContain("/preview");
    expect(site.sitemap()).not.toContain(raw[1].slug);
  });
});
