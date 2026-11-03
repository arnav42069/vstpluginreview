import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { loadSite } from "../lib/data";
import { Site, seo, validPath } from "../components/Site";
export const Route = createFileRoute("/$")({
  loader: async ({ params }) => {
    const path = "/" + (params._splat || "");
    if (path === "/authors/azazel-audio-editorial")
      throw redirect({ href: "/authors/adnan-singh", statusCode: 301 });
    const data = await loadSite({ data: path.startsWith("/preview") });
    if (!validPath(path, data)) throw notFound();
    return { path, data };
  },
  head: ({ loaderData }) =>
    loaderData
      ? seo(loaderData.path, loaderData.data)
      : {
          meta: [
            { title: "Page not found | VST Plugin Review" },
            { name: "robots", content: "noindex" },
          ],
        },
  component: () => {
    const { path, data } = Route.useLoaderData();
    return <Site path={path} data={data} />;
  },
});
