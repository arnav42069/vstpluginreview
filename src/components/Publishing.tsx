import type { ReactNode, TableHTMLAttributes } from "react";

/** Content images are credited local assets, never invented product interfaces. */
export type ArticleImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  credit?: string;
  source?: string;
  license?: string;
  position?: string;
  enlarge?: boolean;
};
function assertLocalAsset(src: string) {
  if (!src.startsWith("/media/") || src.startsWith("//") || src.includes(".."))
    throw Error("Article media must use a local /media/ asset path");
}
export function ArticleImage({
  src,
  alt,
  width,
  height,
  caption,
  credit,
  source,
  license,
  position = "center",
  enlarge = true,
}: ArticleImageProps) {
  assertLocalAsset(src);
  if (!alt.trim() || width <= 0 || height <= 0)
    throw Error("Article images require descriptive alt text and dimensions");
  const image = (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      style={{ objectPosition: position }}
    />
  );
  return (
    <figure className="article-image">
      {enlarge ? (
        <a
          href={src}
          data-enlarge-image=""
          data-image-alt={alt}
          data-image-caption={caption}
          data-image-credit={credit}
          aria-label={`Enlarge image: ${alt}`}
        >
          {image}
        </a>
      ) : (
        image
      )}
      {(caption || credit || license || source) && (
        <figcaption>
          {caption}
          <small className="image-provenance">
            {credit}
            {license && ` · ${license}`}
            {source?.startsWith("https://") && (
              <>
                {" "}
                ·{" "}
                <a href={source} rel="noopener noreferrer">
                  Image source
                </a>
              </>
            )}
          </small>
        </figcaption>
      )}
    </figure>
  );
}

export function PluginReviewSection({
  title,
  officialUrl,
  image,
  children,
}: {
  title: string;
  officialUrl?: string;
  image?: ArticleImageProps;
  children: ReactNode;
}) {
  if (officialUrl && !officialUrl.startsWith("https://"))
    throw Error("Official product links must use HTTPS");
  return (
    <section className="plugin-review-section" aria-label={title}>
      <h3>{title}</h3>
      <div className={image ? "plugin-review-layout" : undefined}>
        {image && <ArticleImage {...image} />}
        <div>{children}</div>
      </div>
      {officialUrl && (
        <p>
          <a href={officialUrl} rel="noopener noreferrer">
            Official {title} website
          </a>
        </p>
      )}
    </section>
  );
}
export function PluginFeatureList({ items }: { items: string[] }) {
  return (
    <ul className="plugin-feature-list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
export function ProsCons({ pros, cons }: { pros: string[]; cons: string[] }) {
  return (
    <div className="pros-cons">
      <section aria-label="Strengths">
        <h4>Strengths</h4>
        <ul>
          {pros.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </section>
      <section aria-label="Limitations">
        <h4>Limitations</h4>
        <ul>
          {cons.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
export function TutorialSteps({
  steps,
}: {
  steps: { title: string; description: string }[];
}) {
  return (
    <ol className="tutorial-steps">
      {steps.map((step) => (
        <li key={step.title}>
          <strong>{step.title}</strong>
          <p>{step.description}</p>
        </li>
      ))}
    </ol>
  );
}
/** Keyboard users can scroll wide tables without trapping focus on the page. */
export function ResponsiveTable({
  children,
  ...props
}: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div
      className="comparison-scroll"
      role="region"
      aria-label="Scrollable article table"
      tabIndex={0}
    >
      <table {...props}>{children}</table>
    </div>
  );
}
export function PluginComparisonTable({
  caption,
  columns,
  rows,
}: {
  caption: string;
  columns: string[];
  rows: string[][];
}) {
  if (rows.some((row) => row.length !== columns.length))
    throw Error("Comparison rows must match the number of column headings");
  return (
    <div
      className="comparison-scroll"
      role="region"
      aria-label={caption}
      tabIndex={0}
    >
      <table>
        <caption>{caption}</caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column} scope="col">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) =>
                j === 0 ? (
                  <th key={j} scope="row">
                    {cell}
                  </th>
                ) : (
                  <td key={j}>{cell}</td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export function EditorialDisclosure({ children }: { children: ReactNode }) {
  return (
    <aside
      className="disclosure editorial-disclosure"
      aria-label="Editorial disclosure"
    >
      <strong>Editorial disclosure</strong>
      <div>{children}</div>
    </aside>
  );
}
/** Native controls survive build-time MDX rendering; absent real assets render nothing. */
export function AudioComparisonPlayer({
  a,
  b,
  levelMatched = false,
  credit,
}: {
  a?: string;
  b?: string;
  levelMatched?: boolean;
  credit?: string;
}) {
  if (!a || !b || !levelMatched) return null;
  assertLocalAsset(a);
  assertLocalAsset(b);
  return (
    <section className="media" aria-label="Level-matched audio comparison">
      <h3>Audio comparison</h3>
      <figure>
        <figcaption>A — original recording</figcaption>
        <audio
          controls
          preload="none"
          src={a}
          aria-label="Original recording"
        />
      </figure>
      <figure>
        <figcaption>B — processed recording</figcaption>
        <audio
          controls
          preload="none"
          src={b}
          aria-label="Processed recording"
        />
      </figure>
      <p>
        Compare at the same listening level.
        {credit && ` Recording credit: ${credit}`}
      </p>
    </section>
  );
}
