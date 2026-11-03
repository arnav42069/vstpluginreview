import { EditorialHeading, MetaLine } from "./Typography";
import {
  responsiveImage,
  cardImageSizes,
  featuredImageSizes,
  heroImageSizes,
} from "../lib/images";
import { ArticleGallery, ImageLightbox } from "./EditorialImages";
import { ThemeSettings } from "./ThemeSettings";
import { ArticleHeader, ArticleTableOfContents } from "./ArticlePresentation";
import { Arrow } from "./Arrow";
import { AudioPlayer, AudioABComparison, YouTubeEmbed } from "./Media";
import { useEffect, useState } from "react";
import type { loadSite } from "../lib/data";
import {
  categories,
  searchArticles,
  type Article,
} from "../lib/content-schema";
import { classifyLink, outboundEvent } from "../lib/links";
type Data = Awaited<ReturnType<typeof loadSite>>;
const pages: Record<string, [string, string]> = {
  "/about": [
    "About the publication",
    "Evidence, sound, and workflow over hype.",
  ],
  "/editorial-policy": [
    "Editorial policy",
    "Useful advice. Clear evidence. Transparent interests.",
  ],
  "/disclosures": [
    "Ownership & affiliate disclosure",
    "Know who is behind the recommendations.",
  ],
  "/privacy": ["Privacy", "A small footprint, with clear choices."],
  "/terms": ["Terms of use", "Educational information, used with care."],
  "/contact": ["Contact & corrections", "Help us keep the signal clear."],
  "/authors/azazel-audio-editorial": [
    "Azazel Audio Editorial",
    "The editorial team of this Azazel Audio-owned publication.",
  ],
  "/free-tools": [
    "The frequency desk",
    "A practical reference for your next session.",
  ],
};
const titleFor = (p: string) =>
  pages[p]?.[0] ??
  (p === "/reviews"
    ? "Reviews & comparisons"
    : p === "/tutorials"
      ? "Production tutorials"
      : p.startsWith("/categories/")
        ? categories.find((c) => p.endsWith(c.slug))?.label
        : "The article library");
const articleAt = (p: string, d: Data) =>
  d.articles.find(
    (a) => p === `/articles/${a.slug}` || p === `/preview/articles/${a.slug}`,
  );
export function validPath(p: string, d: Data) {
  return Boolean(
    pages[p] ||
    ["/articles", "/tutorials", "/reviews"].includes(p) ||
    categories.some((c) => p === `/categories/${c.slug}`) ||
    articleAt(p, d) ||
    (p === "/preview" && d.preview),
  );
}
export function seo(path: string, d?: Data) {
  if (!d) return {};
  const a = articleAt(path, d);
  const title =
    a?.seoTitle ??
    a?.title ??
    (path === "/" ? "Evidence, sound & workflow" : titleFor(path));
  const description =
    a?.seoDescription ??
    a?.description ??
    pages[path]?.[1] ??
    "Music production tutorials, plugin guides and transparent editorial coverage from an Azazel Audio-owned publication.";
  const canonical = d.siteUrl + path.replace(/^\/preview/, "");
  return {
    meta: [
      { title: `${title} | VST Plugin Review` },
      { name: "description", content: description },
      {
        name: "robots",
        content:
          !d.production || d.preview ? "noindex, nofollow" : "index, follow",
      },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: a ? "article" : "website" },
      { property: "og:url", content: canonical },
      {
        property: "og:image",
        content: `${d.siteUrl}${a?.heroImage ?? "/og.png"}`,
      },
      {
        property: "og:image:alt",
        content:
          a?.heroAlt ?? "VST Plugin Review — evidence, sound and workflow",
      },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: a?.heroImage ? "675" : "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      {
        name: "twitter:image",
        content: `${d.siteUrl}${a?.heroImage ?? "/og.png"}`,
      },
      { name: "twitter:image:alt", content: a?.heroAlt ?? "VST Plugin Review" },
      ...(a && a.status === "published"
        ? [
            {
              property: "article:published_time",
              content: a.date + "T00:00:00+05:30",
            },
            ...(a.updated
              ? [
                  {
                    property: "article:modified_time",
                    content: a.updated + "T00:00:00+05:30",
                  },
                ]
              : []),
          ]
        : []),
      ...(d.verification
        ? [{ name: "google-site-verification", content: d.verification }]
        : []),
    ],
    links: [
      { rel: "canonical", href: canonical },
      {
        rel: "alternate",
        type: "application/rss+xml",
        title: "VST Plugin Review RSS",
        href: "/rss.xml",
      },
    ],
  };
}
function Newsletter() {
  return (
    <section className="newsletter">
      <div>
        <span className="eyebrow">LESS NOISE. MORE SIGNAL.</span>
        <h2>Good advice belongs in your session.</h2>
        <p>
          Our email publication is in preparation. Subscriptions are not open
          yet.
        </p>
      </div>
      <div>
        <label htmlFor="newsletter">Email updates</label>
        <input
          id="newsletter"
          type="email"
          placeholder="Not accepting email addresses yet"
          disabled
        />
        <button disabled>Coming after editorial launch</button>
        <small>No information is collected by this form.</small>
      </div>
    </section>
  );
}
function Card({
  a,
  preview = false,
  index = 0,
  variant = "standard",
  showAuthor = false,
  imageSizes = cardImageSizes,
}: {
  a: Article;
  preview?: boolean;
  index?: number;
  variant?: "standard" | "compact" | "wide";
  showAuthor?: boolean;
  imageSizes?: string;
}) {
  return (
    <article className={`card story-${variant}`}>
      <div className={`card-art art-${index % 3}`}>
        {a.heroImage ? (
          <img
            {...responsiveImage(
              a.heroImage,
              variant === "compact"
                ? "(max-width: 767px) 100px, 150px"
                : variant === "wide"
                  ? "(max-width: 767px) 110px, (max-width: 1100px) 45vw, 600px"
                  : imageSizes,
            )}
            style={{ objectPosition: a.featuredImagePosition }}
            alt={a.heroAlt ?? ""}
            width="1200"
            height="675"
            loading="lazy"
          />
        ) : (
          <Wave />
        )}
        <span>{a.category}</span>
        <b aria-hidden="true">{String(index + 1).padStart(2, "0")}</b>
      </div>
      <div className="card-body">
        <MetaLine>
          <span className="story-category">{a.category}</span>
          <span>{a.readingMinutes} MIN READ</span>
          {preview && a.status !== "published" ? (
            <strong>DRAFT</strong>
          ) : (
            <time dateTime={a.date}>{a.date}</time>
          )}
          {showAuthor && <span>{a.author}</span>}
        </MetaLine>
        <EditorialHeading as="h3" size="story">
          <a href={`${preview ? "/preview" : ""}/articles/${a.slug}`}>
            {a.title}
          </a>
        </EditorialHeading>
        <p>{a.description}</p>
        <a
          className="text-link"
          href={`${preview ? "/preview" : ""}/articles/${a.slug}`}
        >
          Read the guide{" "}
          <span aria-hidden="true">
            <Arrow />
          </span>
        </a>
      </div>
    </article>
  );
}
function RelatedArticles({
  articles,
  preview = false,
  title = "Keep the session moving",
}: {
  articles: Article[];
  preview?: boolean;
  title?: string;
}) {
  if (!articles.length) return null;
  return (
    <section>
      <div className="section-heading">
        <h2>{title}</h2>
      </div>
      <div className="card-grid">
        {articles.map((a, i) => (
          <Card key={a.slug} a={a} index={i} preview={preview} />
        ))}
      </div>
    </section>
  );
}

function EditorialHome({ articles }: { articles: Article[] }) {
  const latest = [...articles].sort((a, b) => b.date.localeCompare(a.date));
  const lead =
    latest.find((a) => a.slug === "kick-drum-synthesis-guide") ??
    latest.find((a) => a.featured) ??
    latest[0];
  const secondary = latest.filter((a) => a.slug !== lead?.slug).slice(0, 3);
  const guides = latest.filter(
    (a) => a.category === "Plugin Guides" && !a.tags.includes("free plugins"),
  );
  const tutorials = latest.filter((a) => a.category !== "Plugin Guides");
  const free = latest.filter((a) => a.tags.includes("free plugins"));
  return (
    <>
      <div className="publication-line">
        <span>THE PRODUCTION JOURNAL</span>
        <span>Sound. Technique. Perspective.</span>
        <span>AN AZAZEL AUDIO PUBLICATION</span>
      </div>
      <section className="editorial-intro">
        <EditorialHeading as="h1" size="display">
          <span>Better tools.</span>
          <br />
          <em>More deliberate music.</em>
        </EditorialHeading>
        <div className="intro-aside">
          <span className="signal-mark" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </span>
          <p>
            Practical production guides, thoughtful plugin comparisons, and a
            closer look at how sound works.
          </p>
          <a className="text-link" href="/editorial-policy">
            Our editorial approach <Arrow />
          </a>
        </div>
      </section>
      {lead && (
        <section className="featured-story" aria-labelledby="featured-title">
          <a
            className="featured-art"
            href={`/articles/${lead.slug}`}
            tabIndex={-1}
            aria-hidden="true"
          >
            {lead.heroImage ? (
              <img
                {...responsiveImage(lead.heroImage, featuredImageSizes)}
                style={{ objectPosition: lead.featuredImagePosition }}
                alt=""
                width="1200"
                height="675"
                fetchPriority="high"
              />
            ) : (
              <Wave />
            )}
          </a>
          <div className="featured-copy">
            <span className="eyebrow">THE LEAD / {lead.category}</span>
            <EditorialHeading id="featured-title" size="section">
              <a href={`/articles/${lead.slug}`}>{lead.title}</a>
            </EditorialHeading>
            <p>{lead.description}</p>
            <MetaLine>
              <time dateTime={lead.date}>{lead.date}</time>
              <span>{lead.readingMinutes} MIN READ</span>
            </MetaLine>
            <a className="text-link" href={`/articles/${lead.slug}`}>
              Read the full guide <Arrow />
            </a>
          </div>
        </section>
      )}
      <section className="latest-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">01 / THE EDITORIAL DESK</span>
            <EditorialHeading>Latest articles</EditorialHeading>
          </div>
          <a href="/articles">
            All articles <Arrow />
          </a>
        </div>
        <div className="latest-grid">
          {secondary[0] && (
            <Card
              a={secondary[0]}
              imageSizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1100px) 50vw, 640px"
            />
          )}
          <div className="latest-secondary">
            {secondary.slice(1).map((a, i) => (
              <Card key={a.slug} a={a} index={i + 1} variant="compact" />
            ))}
          </div>
        </div>
      </section>
      <section className="desk-columns">
        <div>
          <div className="section-heading">
            <div>
              <span className="eyebrow">02 / TOOLS IN CONTEXT</span>
              <EditorialHeading>Reviews & buying guides</EditorialHeading>
            </div>
          </div>
          <p className="section-description">
            Documented capabilities, useful comparisons, and clear limitations.
            Specification-based coverage, with no claimed hands-on tests.
          </p>
          {guides.map((a) => (
            <Card key={a.slug} a={a} variant="compact" />
          ))}
          <a className="text-link" href="/reviews">
            Browse all comparisons <Arrow />
          </a>
        </div>
        <div className="free-desk">
          <div className="section-heading">
            <div>
              <span className="eyebrow">THE OPEN TOOLKIT</span>
              <EditorialHeading>
                Good tools.
                <br />
                No entry fee.
              </EditorialHeading>
            </div>
          </div>
          {free.map((a) => (
            <Card key={a.slug} a={a} variant="wide" showAuthor />
          ))}
        </div>
      </section>
      <section className="tutorial-desk">
        <div className="section-heading">
          <div>
            <span className="eyebrow">03 / SOUND DESIGN & TECHNIQUE</span>
            <EditorialHeading>Learn the signal path.</EditorialHeading>
          </div>
          <a href="/tutorials">
            All tutorials <Arrow />
          </a>
        </div>
        <div className="story-rows">
          {tutorials.map((a, i) => (
            <Card key={a.slug} a={a} index={i} variant="compact" />
          ))}
        </div>
      </section>
      <section className="topics">
        <span className="eyebrow">EXPLORE THE INDEX</span>
        {categories.map((c, i) => (
          <a key={c.slug} href={`/categories/${c.slug}`}>
            <span>0{i + 1}</span>
            <h2>{c.label}</h2>
            <p>{c.description}</p>
            <b aria-hidden="true">
              <Arrow />
            </b>
          </a>
        ))}
      </section>
      <section className="principles">
        <div>
          <span className="eyebrow">OUR EDITORIAL STANDARD</span>
          <EditorialHeading>
            Evidence, sound,
            <br />
            and workflow over hype.
          </EditorialHeading>
        </div>
        <div>
          <p>
            Azazel Audio owns this publication. We label affiliated coverage,
            link to official sources, and distinguish documented features from
            actual testing.
          </p>
          <a className="text-link" href="/editorial-policy">
            Read our editorial policy <Arrow />
          </a>
        </div>
      </section>
      <Newsletter />
    </>
  );
}

function Wave() {
  return (
    <svg viewBox="0 0 600 240" fill="none" aria-hidden="true">
      <path
        d="M0 120H30L37 110 44 132 51 90 58 150 65 68 72 172 79 42 86 194 93 62 100 174 107 80 114 154 121 100 128 138 135 116 142 124 160 120H180C200 15 220 15 240 120S280 225 300 120 340 40 360 120 400 180 420 120 460 80 480 120 520 145 540 120H600"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M0 120H600M180 0V240M300 0V240M420 0V240"
        stroke="currentColor"
        opacity=".14"
      />
    </svg>
  );
}
function Directory({ path, data }: { path: string; data: Data }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All topics");
  const [level, setLevel] = useState("All levels");
  const [type, setType] = useState("All types");
  const [sort, setSort] = useState("Latest");
  let list = data.articles;
  if (path.startsWith("/categories/"))
    list = list.filter((a) =>
      categories.some((c) => path.endsWith(c.slug) && a.category === c.label),
    );
  if (path === "/tutorials")
    list = list.filter((a) => a.category !== "Plugin Guides");
  if (path === "/reviews")
    list = list.filter(
      (a) => a.category === "Plugin Guides" && !a.tags.includes("free plugins"),
    );
  list = searchArticles(list, query)
    .filter(
      (a) =>
        (category === "All topics" || a.category === category) &&
        (level === "All levels" || a.skillLevel === level) &&
        (type === "All types" || a.pluginType === type),
    )
    .sort((a, b) =>
      sort === "Featured"
        ? Number(b.featured) - Number(a.featured)
        : b.date.localeCompare(a.date),
    );
  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">THE READING ROOM</span>
        <h1>{data.preview ? "Editorial preview" : titleFor(path)}</h1>
        <p>
          {data.preview
            ? "Published guides and five original drafts. Drafts remain clearly marked and excluded from public feeds."
            : (categories.find((c) => path.endsWith(c.slug))?.description ??
              "Practical knowledge for deliberate production decisions.")}
        </p>
      </div>
      <div className="filters">
        <label className="search">
          Search articles
          <input
            id="article-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try kick, phase, compression…"
          />
        </label>
        <label>
          Topic
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {["All topics", ...categories.map((c) => c.label)].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
        <label>
          Experience
          <select value={level} onChange={(e) => setLevel(e.target.value)}>
            {["All levels", "Beginner", "Intermediate", "Advanced"].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
        <label>
          Plugin type
          <select value={type} onChange={(e) => setType(e.target.value)}>
            {["All types", "Synthesizer", "Effect", "Workflow"].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
        <label>
          Sort
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option>Latest</option>
            <option>Featured</option>
          </select>
        </label>
      </div>
      <p role="status" className="meta">
        {list.length} {list.length === 1 ? "article" : "articles"}
      </p>
      {list.length ? (
        <div className="card-grid">
          {list.map((a, i) => (
            <Card key={a.slug} a={a} index={i} preview={data.preview} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <h2>
            {query ? "No matching articles" : "The next issue is taking shape."}
          </h2>
          <p>
            {path === "/reviews"
              ? "We will publish reviews only after documented hands-on evaluation. No ratings or testing claims are available yet."
              : "Our launch guides are being reviewed. Published articles will appear here after approval."}
          </p>
          <a href="/editorial-policy">
            Read our editorial standards <Arrow />
          </a>
        </div>
      )}
    </>
  );
}
export function ArticleLayout({ a, data }: { a: Article; data: Data }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const el = document.querySelector(".prose");
      if (el) {
        const r = el.getBoundingClientRect();
        setProgress(
          Math.min(
            100,
            Math.max(0, (-r.top / (r.height - window.innerHeight)) * 100),
          ),
        );
      }
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  let html = a.html.replace(
    /href="(https?:[^" ]+)"/g,
    (_, url: string) =>
      `href="${classifyLink(url.replaceAll("&amp;", "&"), a.slug).href.replaceAll("&", "&amp;")}" rel="noopener noreferrer"`,
  );
  if (data.preview)
    html = html.replaceAll('href="/articles/', 'href="/preview/articles/');
  const related = data.articles.filter((b) => a.relatedSlugs.includes(b.slug));
  return (
    <>
      <div className="reading-progress" style={{ width: `${progress}%` }} />
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <a href="/">Home</a> /{" "}
        <a href={data.preview ? "/preview" : "/articles"}>Articles</a> /{" "}
        <span>{a.category}</span>
      </nav>
      <ArticleHeader article={a} unpublished={a.status !== "published"} />
      <div className="disclosure">
        {a.disclosures} <a href="/disclosures">Full disclosure</a>
      </div>
      {a.heroImage && (
        <figure className="article-hero">
          <a
            href={a.heroImage}
            data-enlarge-image=""
            data-image-alt={a.heroAlt}
            data-image-credit={a.featuredImageCredit}
            aria-label={`Enlarge image: ${a.heroAlt}`}
          >
            <img
              {...responsiveImage(a.heroImage, heroImageSizes)}
              alt={a.heroAlt ?? ""}
              width="1200"
              height="675"
              fetchPriority="high"
              style={{ objectPosition: a.featuredImagePosition }}
            />
          </a>
          {a.featuredImageCredit && (
            <figcaption>
              {a.featuredImageCredit} · {a.featuredImageLicense}
              {a.featuredImageSource && (
                <>
                  {" "}
                  ·{" "}
                  <a href={a.featuredImageSource} rel="noopener noreferrer">
                    Image source
                  </a>
                </>
              )}
            </figcaption>
          )}
        </figure>
      )}
      <div className="reading-layout">
        <ArticleTableOfContents headings={a.headings} />
        <article
          className="prose"
          onClick={(e) => {
            const link = (e.target as HTMLElement).closest("a");
            if (
              link?.href.startsWith("http") &&
              new URL(link.href).origin !== location.origin
            )
              window.dispatchEvent(
                new CustomEvent("editorial:outbound", {
                  detail: outboundEvent(link.href, a.slug, "article-body"),
                }),
              );
          }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
      <ArticleGallery images={a.gallery} />
      {a.sources.length > 0 && (
        <section className="article-sources">
          <h2>Sources</h2>
          <ul>
            {a.sources.map((s) => (
              <li key={s}>
                <a href={s} rel="noopener noreferrer">
                  {s}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
      {a.audio && <AudioPlayer {...a.audio} />}
      {a.audioAB && <AudioABComparison {...a.audioAB} />}
      {a.video && <YouTubeEmbed {...a.video} />}
      <div className="author-box">
        <span className="eyebrow">WRITTEN BY</span>
        <h2>
          <a href="/authors/azazel-audio-editorial">Azazel Audio Editorial</a>
        </h2>
        <p>
          The editorial team of Azazel Audio. Product ownership is disclosed;
          this specification-based coverage and educational guidance do not
          represent independent hands-on reviews.
        </p>
        <a href="/contact">
          Suggest a correction <Arrow />
        </a>
      </div>
      <RelatedArticles articles={related} preview={data.preview} />
    </>
  );
}
function Info({ path, data }: { path: string; data: Data }) {
  const [note, setNote] = useState(36);
  return (
    <>
      <header className="page-heading">
        <span className="eyebrow">VST PLUGIN REVIEW</span>
        <h1>{pages[path][0]}</h1>
        <p>{pages[path][1]}</p>
      </header>
      <div className="prose info">
        {path === "/about" && (
          <>
            <h2>Decisions you can hear.</h2>
            <p>
              We cover music production, sound design, and the tools that help
              producers work with intention. Our publication is owned and
              operated by Azazel Audio, developer of Suckerpunch and VisualComp.
            </p>
            <p>
              Ownership creates a commercial interest. We disclose it wherever
              relevant, distinguish education from testing, and do not disguise
              promotion as independent evaluation.
            </p>
            <a href="/editorial-policy">How our editorial process works</a>
          </>
        )}
        {path === "/editorial-policy" && (
          <>
            <h2>Evidence before claims</h2>
            <p>
              We distinguish verified vendor specifications, editorial analysis,
              and firsthand observations. A genuine review must document the
              tested version, host, operating system, methodology and
              limitations. Our current guides use official documentation and
              educational analysis; they do not claim hands-on testing.
            </p>
            <h2>How we select products</h2>
            <p>
              We select tools to illustrate distinct production needs:
              transparent dynamics, character, synthesis, modulation and
              practical free workflows. Order is editorial organization, not a
              measured performance ranking. We identify free editions, paid
              upgrades and restrictions separately.
            </p>
            <h2>Verification and updates</h2>
            <p>
              Product features, availability and licensing are checked against
              the linked official developer pages. Each new guide records its
              source-check date. Pricing and compatibility can change; where a
              fact cannot be established we say so, omit the claim, and direct
              readers to the developer. Recommendations are reviewed when
              documentation, products or material reader corrections change.
            </p>
            <h2>Publication and corrections</h2>
            <p>
              Drafts require human fact-checking and approval. Publication dates
              reflect actual publication, not draft creation. Material
              corrections are noted with the date and reason. AI assisted the
              site implementation, research and article drafting. This
              assistance does not constitute product testing. The five original
              drafts remain unpublished; the four new guides are published at
              the owner's request with source and evidence limits disclosed.
            </p>
            <h2>Commercial independence</h2>
            <p>
              We label owned products and affiliate relationships near relevant
              links. Commercial relationships must not determine conclusions or
              manufacture rankings. We publish no star ratings without
              documented review evidence.
            </p>
            <a href="/contact">Report a factual issue</a>
          </>
        )}
        {path === "/disclosures" && (
          <>
            <h2>Azazel Audio owns this publication</h2>
            <p>
              Azazel Audio develops Suckerpunch and VisualComp and has a
              commercial interest in visits to its website. Links to Azazel
              Audio include campaign parameters that identify this publication
              and the article.
            </p>
            <h2>Affiliate links</h2>
            <p>
              No affiliate partnerships or commission rates are asserted at
              launch. Future affiliate links must be individually labeled with
              an adjacent disclosure and marked sponsored. Independent vendor
              links do not imply sponsorship.
            </p>
          </>
        )}
        {path === "/privacy" && (
          <>
            <h2>What this site collects</h2>
            <p>
              This version has no analytics tracking, advertising cookies, user
              accounts or functioning email collection. Search runs in your
              browser. Our hosting provider may process technical request logs
              for service delivery and security under its own policies.
            </p>
            <h2>Your theme preference</h2>
            <p>
              Choosing Light or Dark in Settings stores only that preference in
              your browser's localStorage. It is not sent to an analytics
              service. Light is the default until you choose otherwise.
            </p>
            <h2>External services</h2>
            <p>
              Following external links sends you to another service with its own
              privacy policy. Videos connect to YouTube only after you choose to
              load them. Audio is requested only when supplied media is loaded.
              Campaign parameters on owned product links identify the referring
              article, not you.
            </p>
            <p>
              If a newsletter is enabled later, this policy and the consent flow
              must be updated before collecting addresses. We will require
              explicit consent and provider-supported double opt-in.
            </p>
          </>
        )}
        {path === "/terms" && (
          <>
            <h2>Educational material</h2>
            <p>
              Content provides general music-production information, not a
              guarantee of a particular result. Use safe monitoring levels, keep
              backups, and verify plugin compatibility and licensing with the
              original developer.
            </p>
            <h2>Rights and external resources</h2>
            <p>
              Article content belongs to its respective rights holders. Product
              names identify their owners and do not imply endorsement. External
              availability, pricing and terms may change. Contact the editorial
              team for permission requests or corrections.
            </p>
          </>
        )}
        {path === "/contact" && (
          <>
            <h2>Corrections and editorial inquiries</h2>
            <p>
              Include the article URL, the statement in question, and a primary
              source where possible. Do not send passwords, license keys or
              personal project files.
            </p>
            <p>
              Until a dedicated editorial inbox is configured, contact the
              publication through the{" "}
              <a href="https://azazelaudio.com/" rel="noopener noreferrer">
                official Azazel Audio website
              </a>
              .
            </p>
          </>
        )}
        {path.startsWith("/authors/") && (
          <>
            <h2>Azazel Audio Editorial</h2>
            <p>
              A team attribution for the supplied educational articles. No
              individual biography, credentials, testing history or independent
              reviewer identity is claimed.
            </p>
            <p>
              The team works within an Azazel Audio-owned publication.
              Individual author identities and testing credentials must be
              verified before adding them.
            </p>
            <h2>Published work</h2>
            {data.articles
              .filter((a) => a.status === "published")
              .map((a) => (
                <p key={a.slug}>
                  <a href={`/articles/${a.slug}`}>{a.title}</a>
                </p>
              ))}
            {!data.articles.some((a) => a.status === "published") && (
              <p>No articles have been approved for publication yet.</p>
            )}
          </>
        )}
        {path === "/free-tools" && (
          <>
            <h2>Note to frequency</h2>
            <p>
              Equal temperament, A4 = 440 Hz. A reference for a stable tone; a
              kick's moving pitch does not require tuning its entire envelope to
              one note.
            </p>
            <label>
              MIDI note{" "}
              <input
                type="number"
                min="0"
                max="127"
                value={note}
                onChange={(e) =>
                  setNote(Math.max(0, Math.min(127, Number(e.target.value))))
                }
              />
            </label>
            <p>
              <output className="frequency">
                {(440 * 2 ** ((note - 69) / 12)).toFixed(2)} Hz
              </output>
            </p>
            <table>
              <thead>
                <tr>
                  <th>Note</th>
                  <th>Frequency</th>
                  <th>Period</th>
                </tr>
              </thead>
              <tbody>
                {[24, 28, 31, 36, 40, 43, 48].map((n) => (
                  <tr key={n}>
                    <td>
                      {
                        [
                          "C",
                          "C♯",
                          "D",
                          "D♯",
                          "E",
                          "F",
                          "F♯",
                          "G",
                          "G♯",
                          "A",
                          "A♯",
                          "B",
                        ][n % 12]
                      }
                      {Math.floor(n / 12) - 1}
                    </td>
                    <td>{(440 * 2 ** ((n - 69) / 12)).toFixed(2)} Hz</td>
                    <td>
                      {(1000 / (440 * 2 ** ((n - 69) / 12))).toFixed(2)} ms
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p>
              Period = 1,000 ÷ frequency. These are mathematical references, not
              measured plugin results.
            </p>
          </>
        )}
      </div>
    </>
  );
}
export function Site({ path, data }: { path: string; data: Data }) {
  const article = articleAt(path, data);
  const schema = article
    ? {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: article.title,
        description: article.description,
        ...(!data.preview
          ? {
              datePublished: article.date,
              dateModified: article.updated ?? article.date,
            }
          : {}),
        author: {
          "@type": "Organization",
          name: article.author,
          url: data.siteUrl + "/authors/azazel-audio-editorial",
        },
        publisher: {
          "@type": "Organization",
          name: "VST Plugin Review",
          parentOrganization: { "@type": "Organization", name: "Azazel Audio" },
        },
        ...(article.heroImage
          ? { image: data.siteUrl + article.heroImage }
          : {}),
        mainEntityOfPage: data.siteUrl + "/articles/" + article.slug,
      }
    : {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "VST Plugin Review",
        url: data.siteUrl,
        parentOrganization: { "@type": "Organization", name: "Azazel Audio" },
      };
  return (
    <>
      <ImageLightbox />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <a className="brand" href="/">
          <span className="brand-icon" aria-hidden="true">
            ∿
          </span>
          <span>
            VST <span className="brand-light">PLUGIN</span>
            <br />
            <small>REVIEW</small>
          </span>
        </a>
        <nav aria-label="Main navigation">
          <a
            href="/articles"
            aria-current={path === "/articles" ? "page" : undefined}
          >
            Articles
          </a>
          <a
            href="/tutorials"
            aria-current={path === "/tutorials" ? "page" : undefined}
          >
            Tutorials
          </a>
          <a
            href="/reviews"
            aria-current={path === "/reviews" ? "page" : undefined}
          >
            Reviews
          </a>
          <a
            href="/free-tools"
            aria-current={path === "/free-tools" ? "page" : undefined}
          >
            Free tools
          </a>
          <ThemeSettings />
        </nav>
        <a className="header-search" href="/articles#article-search">
          Search{" "}
          <span aria-hidden="true">
            <Arrow />
          </span>
        </a>
      </header>
      {data.preview && (
        <div className="preview-banner">
          EDITORIAL PREVIEW · Unpublished content · Not indexed · Publication
          requires owner approval
        </div>
      )}
      <main id="main">
        {path === "/" ? (
          <EditorialHome articles={data.articles} />
        ) : article ? (
          <ArticleLayout a={article} data={data} />
        ) : pages[path] ? (
          <Info path={path} data={data} />
        ) : (
          <Directory path={path} data={data} />
        )}
      </main>
      <footer>
        <div className="footer-top">
          <div>
            <a className="brand" href="/">
              VST PLUGIN REVIEW
            </a>
            <p>Evidence, sound, and workflow over hype.</p>
          </div>
          <nav aria-label="Publication information">
            {[
              ["/about", "About"],
              ["/authors/azazel-audio-editorial", "Authors"],
              ["/editorial-policy", "Editorial policy"],
              ["/disclosures", "Disclosures"],
              ["/contact", "Contact"],
              ["/privacy", "Privacy"],
              ["/terms", "Terms"],
              ["/rss.xml", "RSS"],
            ].map(([href, label]) => (
              <a href={href} key={href}>
                {label}
              </a>
            ))}
          </nav>
        </div>
        <div className="footer-bottom">
          <span>Owned and operated by Azazel Audio.</span>
          <span>Independent thinking. Disclosed interests.</span>
        </div>
      </footer>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
      {article && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: data.siteUrl,
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Articles",
                  item: data.siteUrl + "/articles",
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: article.title,
                  item: data.siteUrl + "/articles/" + article.slug,
                },
              ],
            }).replace(/</g, "\\u003c"),
          }}
        />
      )}
    </>
  );
}
