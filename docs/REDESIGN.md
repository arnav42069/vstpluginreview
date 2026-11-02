# Editorial redesign — 2 November 2026

This update preserves the TanStack Start/React/TypeScript/Tailwind/build-time MDX stack, brand mark, mint identity, existing routes, preview boundary, structured data, feed and sitemap. No runtime dependencies were added.

## Publication

Four new articles are published under the owner's explicit request. Original five drafts stay ready and are excluded from public data and feeds.

- `/articles/best-compressor-vst-plugins-2026`
- `/articles/best-free-vst-plugins-2026`
- `/articles/modular-synthesis-beginners-guide`
- `/articles/kick-drum-synthesis-guide`

Source-check date is 2 November 2026. These are educational guides and specification-based editorial selections, not hands-on tests. Numbered product coverage does not assert popularity or measured rankings. Linked primary sources and research notes record evidence and uncertainty. Live prices, changing versions/OS support and vendor checkout availability must still be checked by readers before installation or purchase.

## Design and publishing

Light is default even with a dark OS preference. Navigation Settings offers Light/Dark; explicit preference survives routes/reloads and is applied in the document head before paint. Storage errors fall back safely. Privacy copy documents this local preference.

The homepage leads with a real published feature, then latest stories, documented plugin comparisons, tutorials, free recommendations, categories and editorial policy. No fabricated popularity metrics are used.

Article layouts include a sticky scrollable TOC, semantic headings, author/date/read time, source links, ownership notices, related guides and responsive feature artwork. Rich MDX components support comparison tables, feature lists, pros/cons, tutorial steps, credited imagery and real audio. Missing audio is hidden. Tables have keyboard-accessible horizontal overflow. Build validation rejects missing media, absent image alt/dimensions, broken article links and published links to drafts.

Four original 1200×675 PNG/SVG featured illustrations were created with `scripts/editorial-art.mjs`; they are diagrams, not product interfaces. See `public/media/LICENSES.md` for actual screenshot permissions and attribution. Unlicensed vendor screenshots are omitted rather than copied. No performance/audio evidence has been invented.

## SEO and QA

Each article has distinct title/description, canonical, article-specific OG/Twitter artwork and alt text, BlogPosting and BreadcrumbList JSON-LD. Public feeds and sitemap use only published content. Nonproduction remains noindexed; production previews remain inaccessible.

Canonical origin uses `SITE_URL`, then Vercel's production hostname, with the existing live Vercel URL as fallback. Keep any Vercel `SITE_URL` override aligned with the actual domain.

Validation results and any remaining limitations are recorded after the implementation checks. Existing browser coverage is updated for four published guides plus five protected drafts; new checks cover theme persistence, first visit with OS dark mode, article SEO/TOCs/images, JavaScript-disabled rendering, mobile widths, hydration errors and both-theme automated accessibility.

## Verified results

- Content validation: nine valid MDX articles, four published; internal links, heading anchors and referenced image assets validated.
- TypeScript and ESLint passed.
- Vitest: 15 tests passed.
- Playwright: 16 tests passed, including first-visit light mode with dark OS preference, persistence across reload/navigation, all four public guides, five protected drafts, feed/sitemap inclusion, metadata, TOC anchors, real image loads, no-JavaScript SSR, 360–1440px layouts, both-theme automated WCAG checks and no hydration errors.
- Node server production build passed. Vercel adapter output also passed, generating the server function and catch-all route.

## Evidence limits

Suckerpunch's public launch messaging conflicts with its coming-soon/get-notified controls. The article marks purchase availability as unconfirmed and does not assert undocumented sample-analysis or named distortion engines. Its affiliated status is disclosed with the requested exact sentence. Other dated prices and system requirements reflect official source observations, not promises that future checkouts or hosts behave identically.

Only the authentic Surge XT screenshot had documented reusable source licensing. Other proprietary interfaces and noncommercially licensed modular artwork were not copied. Original explanatory graphics supply the remaining featured images and modular diagram. Additional authorized vendor screenshots and actual audio comparisons remain media additions, not simulated tests. A current native Suckerpunch manual and confirmed store/release status are needed before expanding those claims.
