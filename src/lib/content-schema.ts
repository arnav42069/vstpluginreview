import { z } from "zod";
const localImage = z
  .string()
  .regex(/^\/media\/articles\/[a-zA-Z0-9/_-]+\.(?:webp|avif|png|jpe?g|svg)$/);
const imagePosition = z
  .string()
  .regex(/^(?:center|top|bottom|left|right|(?:\d{1,2}|100)% (?:\d{1,2}|100)%)$/)
  .default("center");
export const galleryImageSchema = z.object({
  src: localImage,
  alt: z.string().min(8),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  caption: z.string().optional(),
  credit: z.string().optional(),
  source: z.url().optional(),
  license: z.string().optional(),
  position: imagePosition,
});
export const articleSchema = z.object({
  title: z.string().min(10),
  description: z.string().min(20),
  excerpt: z.string().min(20).optional(),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  date: z.iso.date(),
  updated: z.iso.date().optional(),
  author: z.literal("Azazel Audio Editorial"),
  category: z.enum(["Sound Design", "Mixing", "Plugin Guides"]),
  tags: z.array(z.string()).min(1),
  skillLevel: z.enum(["Beginner", "Intermediate", "Advanced"]),
  pluginType: z.enum(["Synthesizer", "Effect", "Workflow"]).default("Workflow"),
  status: z.enum(["draft", "ready", "published"]),
  featured: z.boolean().default(false),
  relatedSlugs: z.array(z.string()),
  disclosures: z.string().min(10),
  sources: z.array(z.url()).default([]),
  audio: z
    .object({
      src: z.string().startsWith("/media/articles/"),
      label: z.string(),
      credit: z.string(),
    })
    .optional(),
  audioAB: z
    .object({
      a: z.string().startsWith("/media/articles/"),
      b: z.string().startsWith("/media/articles/"),
      levelMatched: z.literal(true),
    })
    .optional(),
  video: z
    .object({
      id: z.string().regex(/^[-\w]{11}$/),
      title: z.string(),
      transcript: z.string().optional(),
    })
    .optional(),
  readingMinutes: z.number().positive().optional(),
  featuredImage: localImage.optional(),
  featuredImageAlt: z.string().min(8).optional(),
  featuredImagePosition: imagePosition,
  featuredImageCredit: z.string().optional(),
  featuredImageSource: z.url().optional(),
  featuredImageLicense: z.string().optional(),
  gallery: z.array(galleryImageSchema).max(20).optional(),
  heroImage: z.string().optional(),
  heroAlt: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});
export type Article = z.infer<typeof articleSchema> & {
  html: string;
  excerpt: string;
  headings: { id: string; text: string }[];
  readingMinutes: number;
};
export const categories = [
  {
    slug: "sound-design",
    label: "Sound Design",
    description: "Oscillators, envelopes and deliberate sound shaping.",
  },
  {
    slug: "mixing",
    label: "Mixing",
    description: "Clear low end, thoughtful dynamics and decisions in context.",
  },
  {
    slug: "plugin-guides",
    label: "Plugin Guides",
    description:
      "Understand tools and workflows before you add to your collection.",
  },
];
export function visibleArticles(articles: Article[], preview = false) {
  return articles.filter((a) => preview || a.status === "published");
}
export function searchArticles(articles: Article[], query: string) {
  const terms = query.toLowerCase().trim().split(/\s+/);
  return articles.filter((a) =>
    terms.every((t) =>
      [
        a.title,
        a.description,
        a.excerpt,
        a.html.replace(/<[^>]*>/g, " "),
        ...a.tags,
      ]
        .join(" ")
        .toLowerCase()
        .includes(t),
    ),
  );
}
