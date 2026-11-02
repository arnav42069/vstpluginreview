import type { Article } from "../lib/content-schema";

export function ArticleHeader({
  article: a,
  unpublished = false,
}: {
  article: Article;
  unpublished?: boolean;
}) {
  return (
    <header className="article-heading">
      <span className="eyebrow">
        {a.category} / {a.skillLevel}
      </span>
      <h1>{a.title}</h1>
      <p>{a.description}</p>
      <div className="meta">
        <a href="/authors/azazel-audio-editorial">{a.author}</a> ·{" "}
        {a.readingMinutes} MIN READ ·{" "}
        {unpublished ? (
          "UNPUBLISHED — DATE PENDING"
        ) : (
          <>
            Published <time dateTime={a.date}>{a.date}</time>
          </>
        )}
        {!unpublished && a.updated && (
          <>
            {" "}
            · Updated <time dateTime={a.updated}>{a.updated}</time>
          </>
        )}
      </div>
    </header>
  );
}

export function ArticleTableOfContents({
  headings,
}: {
  headings: Article["headings"];
}) {
  return (
    <aside className="toc">
      <span className="eyebrow">IN THIS GUIDE</span>
      <nav aria-label="Table of contents">
        {headings.map((h) => (
          <a key={h.id} href={`#${h.id}`}>
            {h.text}
          </a>
        ))}
      </nav>
    </aside>
  );
}
