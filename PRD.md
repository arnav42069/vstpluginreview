# Product Requirements Document — Plugin Signal (working title)
Version: 1.0 | 2026-11-01 | Status: Build specification

> Working title only. Brand/domain approval is outstanding. Never deploy under a purchased or asserted domain without configuration.

## 1. Executive summary
Build a fast, editorially credible, SEO-friendly music-production publication dedicated to plugin reviews, sound design, kick/bass production, and technical tutorials. It should become an owned audience-acquisition channel for Azazel Audio (Suckerpunch and VisualComp), while publishing useful and fair coverage of competitors. The publication must clearly disclose that it is owned/operated by Azazel Audio. The experience combines rich written content, playable audio demos, embedded YouTube videos, searchable guides, and email subscriptions.

### Goals
1. Publish five launch articles through MDX with robust discoverability and excellent reading UX.
2. Provide a maintainable editorial content system for 50+ articles without database migrations.
3. Track qualified outbound clicks to Azazel Audio separately from organic readership.
4. Capture opt-in email subscribers with compliant, consent-based flows.
5. Support legitimate affiliate partnerships with per-link disclosures.
6. Keep Core Web Vitals excellent and accessibility WCAG 2.2 AA as a target.

### Non-goals for v1
- User accounts, community forum, paid memberships, e-commerce, scraped plugin price feeds, automatically fabricated reviews, automatic content publication by LLMs, public comments, rating aggregation, AI chatbots.
- Claiming first-hand plugin testing where none occurred.

## 2. Audience and value proposition
- **Primary**: EDM, psytrance, house, hip-hop producers seeking practical, audible production results.
- **Secondary**: Beginner/intermediate producers comparing synths, compressors, drum tools, and free VSTs.
- **Tertiary**: Advanced producers who appreciate DSP discussion, reproducible test methods, and sound examples.

Brand promise: *Evidence, sound, and workflow over hype.* Every product review must distinguish verified features, independent analysis, and actual tested performance.

## 3. Brand and design
Working name: **Plugin Signal**. Domain via `SITE_URL` env var. Design: sophisticated dark-first editorial publication, not a generic SaaS landing page. Near-black navy backgrounds, subtle waveform/grid motifs, high-contrast typography, electric mint accents plus a restrained violet secondary. Clear editorial hierarchy, large readable headings, generous margins, 72–78 character article line length, readable paragraph spacing, responsive side rail on desktop. Light-mode optional, support `prefers-reduced-motion`.

Do not copy another site’s branding, code, artwork or photography. SVG illustrations may be generated locally for diagrams and abstract waveform ornaments; do not fake plugin screenshots.

## 4. Site architecture and routes
- `/` — editorial homepage: hero feature, latest articles, category navigation, tutorials, editorial picks, newsletter, small disclosure/footer.
- `/articles` — article directory, searchable and filterable with category, skill-level, plugin type and sort.
- `/articles/:slug` — SEO-ready full reading view; sticky table of contents on desktop, reading progress, metadata, related articles, demo module, contextual CTAs.
- `/categories/:slug` — topic landing pages and explainers.
- `/reviews` — reviews/comparisons index (only actual reviewed pieces tagged appropriately).
- `/tutorials` — how-to articles index.
- `/free-tools` — landing for free resources; v1 can contain a useful public kick-frequency reference table or calculators; do not promote unavailable downloads.
- `/about` — mission, ownership and editorial independence.
- `/editorial-policy` — methodology, disclosure, affiliate policy, corrections process.
- `/privacy`, `/terms`, `/contact`, `/disclosures`.
- `/rss.xml`, `/sitemap.xml`, `/robots.txt`.
- `/404` / not-found.

## 5. Core features and acceptance criteria
### 5.1 Editorial content
**Format**: MDX files in `content/articles/`, parsed at build time and validated against a Zod schema. Use frontmatter fields:
`title, description, slug, date, updated, author, category, tags, skillLevel, readingMinutes(optional computed), heroImage(optional), heroAlt(optional), seoTitle(optional), seoDescription(optional), status(draft|ready|published), featured, relatedSlugs, disclosures, sources`.

- Only `status: published` articles render publicly or enter sitemap/RSS/search index.
- Drafts/ready content shown only in local preview (never indexed).
- Automatic heading anchors, TOC, safe external links, inline code, lists, tables, figure captions, callouts, link cards and audio components.
- Validated internal link targets; build errors on duplicate slugs, broken imports or missing required metadata.
- Article pages show real author, publication/update dates, ownership disclosure near affiliate/product CTAs, references and correction link.
- Article listing works without JS; client search enhancement allowed.

### 5.2 Discovery
- Keyboard-accessible full-text article search (client-side indexed metadata + excerpt), no paid search vendor needed.
- Topic/category chips, latest/featured sort, related article modules based on tags.
- Appropriate editorial breadcrumbs and at least 2 meaningful internal links where relevant.

### 5.3 Audio and video content
- Accessible custom audio-player with play/pause, timeline, elapsed/total time, volume, waveform optional progressive enhancement. Native HTML audio fallback; no fake audio.
- A/B player for *actual supplied*, level-matched recordings only; labels identify source and processing. If assets do not exist, hide the demo rather than show dead UI.
- YouTube embeds lazy-load on user interaction; accessible link fallback and video transcripts when supplied.
- Support `public/media/articles/{slug}/...` and caption/credits. Never auto-play media.

### 5.4 Conversion
- Reusable `ProductMention` with clear name, reason for relevance, affiliate relationship / ownership disclosure and an external link. Show Azazel Audio related products contextually, never as interstitials or manipulated 'best' rankings.
- Outbound link event captures article slug, target domain, context, content group; do **not** collect names, emails, IPs or sensitive identifiers through analytics events.
- Newsletter form with explicit consent and double opt-in when provider supports it; display actual completion/error states, spam protections/rate limiting. If credentials absent, render a disabled/informational state rather than pretending subscriptions work.
- UTM parameters on outgoing Azazel Audio links: `utm_source=plugin_signal&utm_medium=editorial&utm_campaign={article_slug}`; use safe URL handling.

### 5.5 SEO
- SSR/SSG for all crawlable pages; canonical absolute URLs from `SITE_URL`; unique title/description; OpenGraph and Twitter cards; properly sized OG image fallback.
- XML sitemap includes published canonical pages and accurate lastmod; robots.txt references sitemap; non-production deployments `noindex` where appropriate.
- JSON-LD Article/BlogPosting + BreadcrumbList, Organization and Person with **true** fields only. Product/Review schema only where genuine reviewed content exists; never create fabricated stars or rating snippets.
- Semantic HTML; heading hierarchy; descriptive internal anchor text; optimized image sizes and alt text.
- No keyword stuffing, cloaking, doorway content, fake update dates, or auto-generated thin content.
- Include editorial sources/firsthand methodology and real author profiles; disclose AI assistance when materially used.
- Search Console verification slot via env; GA4/Plausible optional, loaded only when configured and consistent with consent policy.

### 5.6 Accessibility/performance
- Mobile-first, no layout shift, lazy-loaded imagery, optimized font loading, reduced motion preference, keyboard navigation, visible focus states.
- Targets on representative production pages: Lighthouse Performance >=90, Accessibility >=95, SEO >=95; LCP <2.5s, CLS <0.1, INP <200ms on good field conditions. Targets are not guarantees.
- Test at 360/390/768/1024/1440 widths, light/dark if implemented, keyboard + screen reader semantics.

## 6. Stack and engineering approach
Preferred: existing repository stack if present. If new repo, **TanStack Start + React + TypeScript + Tailwind CSS + MDX** for continuity with Azazel Audio’s site; use stable, compatible library releases, checking the installed versions before implementation. Deploy on Vercel; adapt framework filesystem/routing to its actual conventions. If MDX is awkward with installed TanStack Start version, compile MDX at build time with an explicit documented approach rather than migrating frameworks without approval.

Use package scripts: `dev`, `build`, `preview`, `lint`, `typecheck`, `test`, `test:e2e`, `content:validate` where feasible. Zod validation, Vitest, Playwright (at least navigation/search/article/social meta smoke tests), ESLint. Add `.env.example`; secrets server-only; never commit credentials. Keep content git-based with a future CMS adapter boundary but don't build a CMS now.

## 7. Data and components
Types:
- Article { frontmatter, body, headings, excerpt, computedReadingTime, links }
- Category {slug, label, description}
- ExternalLink { href, sponsorType: 'owned'|'affiliate'|'independent', label }
- AnalyticsEvent { eventName, articleSlug?, targetDomain?, placement? }

Core components: AppShell, Header, Search, ArticleCard, FeaturedStory, CategoryTabs, ArticleLayout, TableOfContents, ReadingProgress, AuthorCard, SourceList, DisclosureNotice, ProductMention, NewsletterForm, AudioPlayer, AudioABComparison, YouTubeEmbed, RelatedArticles, Breadcrumbs, Footer, EmptyState.

## 8. Editorial governance (critical)
- Publish useful how-to articles now. Reviews and feature assertions require factual verification against official documentation and testing before claiming first-hand impressions.
- All five supplied articles have `status: ready`, not `published`, by default. A human approval step changes that to published. The Codex prompt below instructs build and staging; launch publication can be triggered by changing statuses after review.
- Never assert numerical benchmarks, plugin performance, affiliate commission percentages, price or availability without primary source and observation date.
- Independent editorial decisions must be documented despite Azazel Audio ownership. Self-promotion must be labeled, not disguised.
- No placeholder images, fabricated audio tests, empty ratings or fake download CTAs on live pages.

## 9. KPI definitions and measurement
North-star: **qualified attributed visits to Azazel Audio product pages per 1,000 unique editorial sessions**.
Supporting: Google Search clicks/impressions by landing page, organic sessions, article-to-product CTR, email signup conversion, actual sample download conversions, video-assisted sessions, published articles that earn impressions, sales attributed through UTMs and checkout analytics.

Instrument: `article_view`, `search_performed` (aggregate term analytics only if allowed by privacy policy), `audio_play`, `video_open`, `product_cta_click`, `affiliate_link_click`, `newsletter_signup_success` (no email in analytics), `related_article_click`.

90-day goals are *hypotheses*, not guarantees: publish 5 high-quality launch articles, expand to ~12-16 reviewed pieces, ship ~8 accompanying videos if feasible, establish baseline search indexing and conversion tracking. Do not optimize for vanity traffic alone.

## 10. Delivery phases
**P0 Build:** shell, home, indexes, detail pages, MDX parser, five articles, metadata, responsive styles, policy pages, basic search, sitemap, RSS, preview and build validation.
**P1 Conversion/QA:** product mentions, opt-in newsletter integration (only with actual provider config), analytics (configured), audio + YouTube, accessibility and e2e test coverage.
**P2 Growth:** free utility modules, editor dashboard/CMS after genuine need, advanced comparisons, contributor workflow, expanded content.

## 11. Definition of done
- Five supplied content pieces import and display correctly in local and staging builds.
- Editorial review gate prevents unfinished/uncited claims from appearing as tested reviews.
- All public routes return correct status and rich meta; draft pages excluded from RSS/sitemap.
- No secrets leaked; all env vars documented.
- Search, filters, related links, RSS and sitemap pass tests; 404 handles invalid article slug.
- Product affiliate/owned disclosures visibly displayed.
- `npm run build`, typecheck, lint, test and a Playwright smoke suite pass, or any unavailable prerequisites are explicitly reported.
- Production publish requires user approval and a confirmed destination domain.
