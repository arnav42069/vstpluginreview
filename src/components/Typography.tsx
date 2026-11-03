import type { HTMLAttributes, ReactNode } from "react";

export function EditorialHeading({
  as: Tag = "h2",
  size = "section",
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLHeadingElement> & {
  as?: "h1" | "h2" | "h3" | "h4";
  size?: "display" | "section" | "story";
  children: ReactNode;
}) {
  return (
    <Tag {...props} className={`type-${size} ${className}`.trim()}>
      {children}
    </Tag>
  );
}
export function MetaLine({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={`meta ${className}`.trim()} />;
}
