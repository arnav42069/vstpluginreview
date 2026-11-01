import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/rss.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { rss } = await import("../lib/site.server");
        return new Response(rss(), {
          headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
        });
      },
    },
  },
});
