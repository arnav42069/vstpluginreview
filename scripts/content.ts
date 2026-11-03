import imageVariants from "../src/lib/image-variants.json";
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { Callout, ProductMention, LinkCard } from "../src/components/Editorial";
import { evaluate } from "@mdx-js/mdx";
import {
  ArticleImage,
  PluginReviewSection,
  PluginFeatureList,
  ProsCons,
  TutorialSteps,
  ResponsiveTable,
  PluginComparisonTable,
  EditorialDisclosure,
  AudioComparisonPlayer,
} from "../src/components/Publishing";
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
for (const [source, image] of Object.entries(imageVariants)) {
  for (const candidate of image.variants) {
    if (
      !candidate.src.startsWith("/media/articles/") ||
      candidate.src.includes("..") ||
      candidate.width > image.width
    )
      throw Error(`Invalid responsive image candidate for ${source}`);
    await fs.access(path.join("public", candidate.src));
  }
}

for (const file of files) {
  const { data, content } = matter(
    await fs.readFile(path.join("content/articles", file), "utf8"),
  );
  const parsed = articleSchema.parse(data);
  const meta = {
    ...parsed,
    heroImage: parsed.featuredImage ?? parsed.heroImage,
    heroAlt: parsed.featuredImageAlt ?? parsed.heroAlt,
  };
  if (
    meta.featuredImage &&
    (!meta.featuredImageAlt ||
      !meta.featuredImageCredit ||
      !meta.featuredImageSource ||
      !meta.featuredImageLicense)
  )
    throw Error(
      `Featured image requires alt, credit, source and license: ${file}`,
    );
  if (articles.some((a) => a.slug === meta.slug))
    throw Error(`Duplicate slug: ${meta.slug}`);
  if (meta.heroImage && !meta.heroAlt) throw Error(`Missing heroAlt: ${file}`);
  for (const asset of [
    meta.heroImage,
    ...(meta.gallery ?? []).map((image) => image.src),
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
      components: {
        Callout,
        ProductMention,
        LinkCard,
        ArticleImage,
        PluginReviewSection,
        PluginFeatureList,
        ProsCons,
        TutorialSteps,
        PluginComparisonTable,
        EditorialDisclosure,
        AudioComparisonPlayer,
        table: ResponsiveTable,
      },
    }),
  );
  for (const [, src] of html.matchAll(/<(?:img|audio)[^>]+src="([^"]+)"/g)) {
    if (!src.startsWith("/media/") || src.includes(".."))
      throw Error(`Invalid article media: ${src}`);
    await fs.access(path.join("public", src));
  }
  for (const [image] of html.matchAll(/<img[^>]*>/g)) {
    if (
      !/alt="[^"]+"/.test(image) ||
      !/width="[1-9][0-9]*"/.test(image) ||
      !/height="[1-9][0-9]*"/.test(image)
    )
      throw Error(
        `Article images require alt text and stable dimensions: ${file}`,
      );
  }
  const headings = [...html.matchAll(/<h2 id="([^"]+)">(.*?)<\/h2>/g)].map(
    (m) => ({ id: m[1], text: m[2].replace(/<[^>]+>/g, "") }),
  );
  articles.push({
    ...meta,
    html,
    headings,
    excerpt: meta.excerpt ?? body.replace(/[#*\[\]()`]/g, "").slice(0, 220),
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
  "/authors/adnan-singh",
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
    if (pathname.startsWith("/media/articles/") && !pathname.includes("..")) {
      await fs.access(path.join("public", pathname));
      continue;
    }
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
