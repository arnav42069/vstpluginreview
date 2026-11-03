import { Arrow } from "./Arrow";
import type { ReactNode } from "react";
import { classifyLink, outboundEvent } from "../lib/links";
export function Callout({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <aside className="disclosure">
      <strong>{title}</strong>
      <div>{children}</div>
    </aside>
  );
}
export function ProductMention({
  name,
  reason,
  href,
  articleSlug,
  relationship = "independent",
}: {
  name: string;
  reason: string;
  href: string;
  articleSlug: string;
  relationship?: "owned" | "affiliate" | "independent";
}) {
  const link = classifyLink(href, articleSlug);
  const type = link.sponsorType === "owned" ? "owned" : relationship;
  return (
    <aside className="author-box">
      <h3>{name}</h3>
      <p>{reason}</p>
      <p>
        {type === "owned"
          ? "Affiliation disclosure: the author is affiliated with this product. This coverage is not an independent review."
          : type === "affiliate"
            ? "Affiliate disclosure: we may earn a commission if you purchase through this link."
            : "Independent vendor link. No commercial relationship is asserted."}
      </p>
      <a
        href={link.href}
        rel={
          type === "affiliate"
            ? "sponsored noopener noreferrer"
            : "noopener noreferrer"
        }
        onClick={() =>
          window.dispatchEvent(
            new CustomEvent("editorial:outbound", {
              detail: {
                ...outboundEvent(href, articleSlug, "product-mention"),
                contentGroup: type,
                eventName:
                  type === "affiliate"
                    ? "affiliate_link_click"
                    : "product_cta_click",
              },
            }),
          )
        }
      >
        Visit {name}'s official website <Arrow />
      </a>
    </aside>
  );
}

export function LinkCard({
  href,
  title,
  children,
}: {
  href: string;
  title: string;
  children?: ReactNode;
}) {
  if (!href.startsWith("/") && !href.startsWith("https://"))
    throw Error("Invalid card link");
  return (
    <aside className="author-box">
      <h3>
        <a href={href}>
          {title} <Arrow />
        </a>
      </h3>
      {children}
    </aside>
  );
}
