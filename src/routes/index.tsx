import { createFileRoute } from "@tanstack/react-router";
import { loadSite } from "../lib/data";
import { Site, seo } from "../components/Site";
export const Route = createFileRoute("/")({
  loader: () => loadSite({ data: false }),
  head: ({ loaderData }) => seo("/", loaderData),
  component: () => <Site path="/" data={Route.useLoaderData()} />,
});
