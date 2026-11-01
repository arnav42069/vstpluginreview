import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { Callout, ProductMention, LinkCard } from "../src/components/Editorial";
import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { articleSchema, type Article } from "../src/lib/content-schema";
const files = (await fs.readdir("content/articles"))
  .filter((f) => f.endsWith(".mdx"))
  .sort();
const articles: Article[] = [];
for (const file of files) {
  const { data, content } = matter(
    await fs.readFile(path.join("content/articles", file), "utf8"),
  );
  const meta = articleSchema.parse(data);
  if (articles.some((a) => a.slug === meta.slug))
    throw Error(`Duplicate slug: ${meta.slug}`);
  if (meta.heroImage && !meta.heroAlt) throw Error(`Missing heroAlt: ${file}`);
  for (const asset of [
    meta.heroImage,
    meta.audio?.src,
    meta.audioAB?.a,
    meta.audioAB?.b,
  ].filter(Boolean)) {
    if (!asset!.startsWith("/") || asset!.includes(".."))
      throw Error(`Invalid asset path: ${asset}`);
    await fs.access(path.join("public", asset!));
  }
  const body = content.replace(/^# .+\n/m, "");
  const compiled = await evaluate(body, {
    ...runtime,
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug],
  });
  const html = renderToStaticMarkup(
    createElement(compiled.default, {
      components: { Callout, ProductMention, LinkCard },
    }),
  );
  const headings = [...html.matchAll(/<h2 id="([^"]+)">(.*?)<\/h2>/g)].map(
    (m) => ({ id: m[1], text: m[2].replace(/<[^>]+>/g, "") }),
  );
  articles.push({
    ...meta,
    html,
    headings,
    excerpt: body.replace(/[#*\[\]()`]/g, "").slice(0, 220),
    readingMinutes:
      meta.readingMinutes ?? Math.ceil(body.split(/\s+/).length / 220),
  });
}
for (const a of articles) {
  for (const slug of [
    ...a.relatedSlugs,
    ...[...a.html.matchAll(/href="\/articles\/([^"#]+)(?:#[^"]*)?"/g)].map(
      (m) => m[1],
    ),
  ]) {
    const target = articles.find((b) => b.slug === slug);
    if (!target) throw Error(`Broken article link: ${a.slug} -> ${slug}`);
    if (a.status === "published" && target.status !== "published")
      throw Error(`Published article links to unpublished article: ${slug}`);
  }
}
const staticPaths = new Set([
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
]);
for (const a of articles) {
  for (const [, href] of a.html.matchAll(/href="([^"]+)"/g)) {
    if (href.startsWith("//") || /^(?:javascript|data):/i.test(href))
      throw Error(`Unsafe link in ${a.slug}`);
    if (!href.startsWith("/") && !href.startsWith("#")) continue;
    const [pathname, anchor] = href.split("#");
    const target = pathname.startsWith("/articles/")
      ? articles.find((b) => "/articles/" + b.slug === pathname)
      : pathname === ""
        ? a
        : undefined;
    if (pathname && !target && !staticPaths.has(pathname))
      throw Error(`Broken internal link: ${href}`);
    if (anchor && target && !target.html.includes(`id="${anchor}"`))
      throw Error(`Broken heading anchor: ${href}`);
  }
}
await fs.mkdir("src/generated", { recursive: true });
await fs.writeFile(
  "src/generated/articles.json",
  JSON.stringify(articles, null, 2),
);
console.log(
  `Validated and compiled ${articles.length} MDX articles (${articles.filter((a) => a.status === "published").length} published).`,
);
