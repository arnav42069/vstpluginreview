# Codex Master Implementation Prompt

You are a senior full-stack engineer, technical SEO specialist and accessible editorial-site designer. Build the website defined in `PRD.md` and ingest the five complete article drafts in `articles/`. Consult `ARTICLE_BRIEFS.md` for editorial notes, verification work and media ideas. Do not summarize or rewrite the articles unless correcting an objective error; preserve content and internal links.

## Operating instructions
1. Inspect the current repo structure, scripts, package manager, and README. Preserve existing code and do not overwrite an existing Azazel Audio website. Prefer building this as a new standalone repository unless explicitly operating within a new site scaffold.
2. Implement a responsive, working website—not screenshots, an unconnected mockup or a single static page. Use TanStack Start, React, TypeScript, Tailwind and MDX if no stack exists; follow stable framework conventions and install compatible versions.
3. Follow `PRD.md` in priority order: article publishing pipeline, homepage, listing/search, detail pages, disclosure/policies, SEO, RSS/sitemap, conversion and analytics, automated QA.
4. Import all five article files and transform their supplied YAML frontmatter into the site's required schema. All supplied articles are currently `status: ready`; make them available in preview/staging. Do not make them publicly indexable until editorial approval changes them to `published`.
5. Since this is an Azazel Audio-owned media property, include prominently accessible ownership/editorial and affiliate disclosures. Never present a company promotional article as an independent test.
6. Do not claim tests, audio comparisons, plugin screenshots, user metrics, third-party ratings, free sample packs, awards, partnerships or subscriber counts unless real supplied evidence exists. Hide absent assets gracefully.
7. Add real metadata, schema, canonical URLs, RSS, sitemap, robots and social images from actual article data. Use `SITE_URL` from environment, not invented production domain. Nonproduction site should be noindexed.
8. Add an editorial preview route or local-only mode for ready/draft posts. Build must verify content and internal links. Avoid accidentally exposing drafts via sitemap or site search.
9. Configure optional analytics/newsletter via documented env vars; a missing service should not yield a fake successful subscription.
10. Write tests, run lint/typecheck/build/e2e, repair failures, and provide a concise final implementation report. Include what requires credentials or human editorial approval.

## Design guidance
- Editorial tech publication aesthetic: near-black surfaces, subtle grid/waveform motif, mint accent, violet details, strong typography and generous whitespace.
- Homepage features highlighted editorial picks, browse-by-topic, an accessible search entry, recent articles and clearly labeled newsletter/owned products modules.
- Article view has readable width, automatic TOC, anchor links, references, inline disclosures, prominent related articles and optional true audio demos.
- Full keyboard accessibility, reduced-motion support, mobile-first navigation; avoid animation overload or blocking modals.

## Acceptance testing checklist
- Route and search each of the five posts by slug/title/category.
- Check internal links, article headings, reading time, frontmatter validation, and absent assets.
- Verify unpublished posts excluded from public sitemap/RSS/listing, and preview routes are inaccessible/noindexed in production.
- Validate structured data with a test and ensure no false Product review ratings.
- Check broken links, responsive navigation, keyboard focus, no layout shifts, missing env behavior.
- Confirm outbound owned-product clicks are classified separately from independent and affiliate links.
- Run full available test suite and report results honestly.

## Important final step
**Do not deploy or flip launch content to `published` automatically.** Deliver a runnable local/staging site plus explicit steps for the owner to review each article, configure site domain, connect optional email/analytics and authorize production launch.
