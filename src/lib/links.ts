export function classifyLink(href: string, articleSlug: string) {
  const url = new URL(href);
  if (!["https:", "http:"].includes(url.protocol))
    throw Error("Unsupported link protocol");
  const owned =
    url.hostname === "azazelaudio.com" ||
    url.hostname.endsWith(".azazelaudio.com");
  if (owned) {
    url.searchParams.set("utm_source", "plugin_signal");
    url.searchParams.set("utm_medium", "editorial");
    url.searchParams.set("utm_campaign", articleSlug);
  }
  return {
    href: url.href,
    targetDomain: url.hostname,
    sponsorType: owned ? ("owned" as const) : ("independent" as const),
  };
}
// Local opt-in integration boundary: no network analytics or personal identifiers are collected.
export function outboundEvent(
  href: string,
  articleSlug: string,
  placement: string,
) {
  const link = classifyLink(href, articleSlug);
  return {
    eventName:
      link.sponsorType === "owned"
        ? "product_cta_click"
        : "outbound_link_click",
    articleSlug,
    targetDomain: link.targetDomain,
    placement,
    contentGroup: link.sponsorType,
  };
}
