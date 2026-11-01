import { createServerFn } from "@tanstack/react-start";
export const loadSite = createServerFn({ method: "GET" })
  .validator((preview: boolean) => preview)
  .handler(async ({ data }) => {
    const site = await import("./site.server");
    return {
      articles: site.getArticles(data),
      preview: data && site.previewEnabled,
      siteUrl: site.siteUrl,
      production: site.production,
      verification: process.env.GOOGLE_SITE_VERIFICATION || "",
    };
  });
