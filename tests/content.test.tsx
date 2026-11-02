import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import articles from "../src/generated/articles.json";
import {
  articleSchema,
  visibleArticles,
  searchArticles,
  type Article,
} from "../src/lib/content-schema";
import { classifyLink, outboundEvent } from "../src/lib/links";
import {
  AudioPlayer,
  AudioABComparison,
  YouTubeEmbed,
} from "../src/components/Media";
import { seo, validPath } from "../src/components/Site";
const all = articles as Article[];
const drafts = all.filter((a) => a.status === "ready");
const published = all.filter((a) => a.status === "published");
describe("editorial publishing", () => {
  it("preserves five full unpublished articles", () => {
    expect(drafts).toHaveLength(5);
    for (const a of drafts) {
      expect(articleSchema.safeParse(a).success).toBe(true);
      expect(a.status).toBe("ready");
      expect(a.html.length).toBeGreaterThan(4000);
      expect(a.headings.length).toBeGreaterThan(5);
    }
  });
  it("does not leak drafts into public selection", () => {
    expect(visibleArticles(all)).toEqual(published);
    expect(visibleArticles(all, true)).toHaveLength(9);
    expect(visibleArticles(drafts)).toHaveLength(0);
  });
  it("searches body and metadata and supports multiple terms", () => {
    expect(searchArticles(drafts, "polarity")).toHaveLength(2);
    expect(
      searchArticles(all, "compression drums").some(
        (a) => a.slug === "compress-drums-without-losing-punch",
      ),
    ).toBe(true);
    expect(searchArticles(all, "nothing-unmatchable")).toEqual([]);
  });
  it("validates links and unique heading anchors", () => {
    for (const a of all) {
      expect(new Set(a.headings.map((h) => h.id)).size).toBe(a.headings.length);
      for (const slug of a.relatedSlugs)
        expect(all.some((b) => b.slug === slug)).toBe(true);
    }
  });
  it("rejects invalid metadata", () => {
    expect(articleSchema.safeParse({ ...all[0], status: "live" }).success).toBe(
      false,
    );
    expect(
      articleSchema.safeParse({ ...all[0], date: "tomorrow" }).success,
    ).toBe(false);
  });
  it("only resolves known public article paths", () => {
    const data = {
      articles: [],
      preview: false,
      siteUrl: "https://vstpluginreview.com",
      production: true,
      verification: "",
    };
    expect(validPath("/articles/" + all[0].slug, data)).toBe(false);
    expect(validPath("/preview", data)).toBe(false);
    expect(validPath("/categories/mixing", data)).toBe(true);
  });
  it("sets canonical and preview indexing policy", () => {
    const data = {
      articles: all,
      preview: true,
      siteUrl: "https://vstpluginreview.com",
      production: false,
      verification: "",
    };
    const head = seo("/preview/articles/" + all[0].slug, data);
    expect(head.links?.[0].href).toBe(
      "https://vstpluginreview.com/articles/" + all[0].slug,
    );
    expect(
      head.meta?.some(
        (m) =>
          "name" in m &&
          m.name === "robots" &&
          m.content === "noindex, nofollow",
      ),
    ).toBe(true);
  });
});
describe("honest media and outbound links", () => {
  it("hides missing media and unmatched comparisons", () => {
    expect(
      renderToStaticMarkup(createElement(AudioPlayer, { label: "Absent" })),
    ).toBe("");
    expect(
      renderToStaticMarkup(
        createElement(AudioABComparison, {
          a: "/a.wav",
          b: "/b.wav",
          levelMatched: false,
        }),
      ),
    ).toBe("");
    expect(
      renderToStaticMarkup(createElement(YouTubeEmbed, { title: "Absent" })),
    ).toBe("");
  });
  it("supplied media has controls and no autoplay", () => {
    const html = renderToStaticMarkup(
      createElement(AudioPlayer, { src: "/real.wav", label: "Original kick" }),
    );
    expect(html).toContain("controls");
    expect(html).not.toContain("autoplay");
  });
  it("classifies actual owned domain, preserves unrelated query strings", () => {
    const link = classifyLink("https://azazelaudio.com/?ref=test", "kick");
    expect(link.sponsorType).toBe("owned");
    expect(link.href).toContain("utm_campaign=kick");
    expect(link.href).toContain("ref=test");
    expect(
      classifyLink("https://azazelaudio.com.example.org/", "kick").sponsorType,
    ).toBe("independent");
    expect(() => classifyLink("javascript:alert(1)", "kick")).toThrow();
  });
  it("events contain only contextual fields", () => {
    expect(
      outboundEvent("https://azazelaudio.com/", "kick", "article"),
    ).toEqual({
      eventName: "product_cta_click",
      articleSlug: "kick",
      targetDomain: "azazelaudio.com",
      placement: "article",
      contentGroup: "owned",
    });
  });
});
