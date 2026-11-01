import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async () => {
        const { production, siteUrl } = await import("../lib/site.server");
        return new Response(
          `User-agent: *\n${production ? "Allow: /\nDisallow: /preview" : "Disallow: /"}\nSitemap: ${siteUrl}/sitemap.xml\n`,
          { headers: { "Content-Type": "text/plain" } },
        );
      },
    },
  },
});
