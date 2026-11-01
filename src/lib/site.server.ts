import articles from "../generated/articles.json";
import { visibleArticles, type Article } from "./content-schema";
export const siteUrl = new URL(
  process.env.SITE_URL || "https://vstpluginreview.com",
).origin;
export const production = process.env.VERCEL_ENV
  ? process.env.VERCEL_ENV === "production"
  : process.env.SITE_ENV === "production";
export const previewEnabled =
  !production && process.env.EDITORIAL_PREVIEW === "true";
export function getArticles(preview = false) {
  return visibleArticles(articles as Article[], preview && previewEnabled);
}
export const publicPaths = [
  "/",
  "/articles",
  "/tutorials",
  "/reviews",
  "/free-tools",
  "/about",
  "/editorial-policy",
  "/privacy",
  "/terms",
  "/contact",
  "/disclosures",
  "/authors/azazel-audio-editorial",
  "/categories/sound-design",
  "/categories/mixing",
  "/categories/plugin-guides",
];
export const xml = (s: string) =>
  s.replace(
    /[<>&"']/g,
    (c) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        '"': "&quot;",
        "'": "&apos;",
      })[c]!,
  );
export function sitemap() {
  return `<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${publicPaths.map((p) => `<url><loc>${xml(siteUrl + p)}</loc></url>`).join("")}${getArticles()
    .map(
      (a) =>
        `<url><loc>${siteUrl}/articles/${a.slug}</loc><lastmod>${a.updated ?? a.date}</lastmod></url>`,
    )
    .join("")}</urlset>`;
}
export function rss() {
  return `<?xml version="1.0"?><rss version="2.0"><channel><title>VST Plugin Review</title><link>${siteUrl}</link><description>Evidence, sound, and workflow over hype.</description>${getArticles()
    .map(
      (a) =>
        `<item><title>${xml(a.title)}</title><description>${xml(a.description)}</description><link>${siteUrl}/articles/${a.slug}</link><guid>${siteUrl}/articles/${a.slug}</guid><pubDate>${new Date(a.date).toUTCString()}</pubDate></item>`,
    )
    .join("")}</channel></rss>`;
}
