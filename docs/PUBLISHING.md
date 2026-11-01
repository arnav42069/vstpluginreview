# Editorial workflow

The canonical website content is `content/articles/*.mdx`. The supplied `articles/*.md` files remain unmodified reference originals. All five imports retain `status: ready`. Dates in these files are draft placeholders, not claims of publication.

## Run and review

Use Node 24 and `npm ci`. Run `EDITORIAL_PREVIEW=true npm run dev` from the repository root. Visit `/preview` to search all five full articles, then open each article. Preview is deliberately separate from the public article directory. Neither public pages nor client bundles contain draft bodies. The server returns preview data only after checking the server's runtime environment. Production rejects `/preview` and unpublished article routes with 404, even when `EDITORIAL_PREVIEW=true`.

`VERCEL_ENV=production` takes precedence over `SITE_ENV`; without Vercel, set `SITE_ENV=production` for a production runtime. Preview deployments must use Vercel Deployment Protection if editorial drafts are confidential. Noindex prevents indexing, not access by someone with the staging URL. Do not run development/preview configuration on the production domain.

## Add or edit an article

Copy an existing MDX frontmatter block and keep a unique stable slug. Required fields are defined in `src/lib/content-schema.ts`. Authors currently resolve to the supplied Azazel Audio Editorial team; adding a real contributor requires a verified profile and schema/author-registry update. Do not invent people or credentials.

Use `##` headings for automatic anchors/TOC; a redundant body `#` heading is removed during compilation so the page has one main heading. GFM tables, lists, external links and inline code work. Trusted repository content is compiled at build time with MDX, never evaluated from a request or user input. MDX imports must resolve at compilation; do not insert scripts or untrusted HTML. Draft bodies live in a generated server-only JSON artifact, excluded from Git and rebuilt by the content command.

`npm run content:validate` rejects invalid metadata, duplicate slugs, broken article links, missing media files, and published articles that link to unpublished articles. Edit related links when publishing a subset. Full-text search is client-side over only the server-authorized selection. Listings and article bodies are server-rendered and readable without JavaScript; interactive filtering needs JavaScript.

Optional media frontmatter (only after real recordings are supplied):

```yaml
audio:
  src: /media/articles/my-slug/original.wav
  label: Original kick recording
  credit: Actual recording contributor and permission
audioAB:
  a: /media/articles/my-slug/dry.wav
  b: /media/articles/my-slug/processed.wav
  levelMatched: true
video:
  id: actual_11_character_YouTube_ID
  title: Actual video title
  transcript: Actual transcript text
```

Use an actual 11-character YouTube ID, not the explanatory placeholder above. Never claim level matching without checking the recordings. Audio uses native controls plus accessible custom controls, with no autoplay. Both recordings and `levelMatched: true` are required for comparison rendering. YouTube connects only after the reader selects Load video. Absent media renders nothing. Store credited assets under `public/media/articles/{slug}/`. No recordings, testimonials, review ratings or screenshots are included in this delivery.

`ProductMention`, `Callout`, and the media components provide reusable UI building blocks. Owned product links in the article body are labeled by the existing ownership notices, receive the specified campaign parameters, and dispatch `editorial:outbound` events locally. No analytics endpoint receives these events. Affiliate use requires an explicitly labeled `ProductMention` with `relationship="affiliate"`; it adds sponsored link semantics. Do not silently convert independent article links into affiliate links.

## Approval gate

1. Owner reviews every checklist item in `ARTICLE_BRIEFS.md`: verify URLs, current vendor claims/free tiers, musical advice, author attribution and disclosures.
2. Supply real media if useful; absence of media is acceptable and does not create a demo placeholder.
3. After explicit publication approval, change only approved articles to `published` and set their actual publication dates. Set `updated` only for real material revisions. Check links to articles that remain unpublished.
4. Run content validation, unit tests, lint, typecheck, production build and browser suite.
5. Review the PR and staging deployment. A separate explicit authorization is required to merge or deploy to production. This implementation does not approve publication.

## Optional integrations

No newsletter provider, subscriber database or analytics service is configured. Newsletter UI is informational and disabled; it submits nothing. No secret is needed to run the website. Before connecting a provider, implement and test the server-only subscription adapter, explicit consent, double opt-in, durable rate limiting/spam protection, success/error responses and revised privacy copy. Never put provider keys in `VITE_*` variables. Analytics events are a local integration boundary; enabling an external destination requires a privacy/consent review and configuration in a later change. Search Console verification can be set with `GOOGLE_SITE_VERIFICATION`.

## Vercel

Use this repository root as the project root, Node 24, build `npm run build`. Nitro auto-detects Vercel; a local compatibility check is `NITRO_PRESET=vercel npm run build`, which generates `.vercel/output` without deploying. Set `SITE_URL=https://vstpluginreview.com`. On protected staging deployments set `EDITORIAL_PREVIEW=true`; production preview is always disabled. `vercel.json` adds security headers. Connect the domain and deploy only after owner approval. No deployment or domain configuration is performed by the setup scripts.

For a local Node production build, run `npm run build`, then `SITE_ENV=production npm run preview`. Every nonproduction page is noindexed, with robots disallowing crawling. Production robots allow public pages and disallow preview. Feeds and sitemap always include only published articles. There are deliberately no last-modification dates on static policy pages because no verified editorial dates were supplied.

The Vite integration uses Nitro's current pinned `3.0.261029-rc` adapter (the available Nitro 3 line is prerelease). Both Node and Vercel output builds are validated locally; an actual protected Vercel preview and field Core Web Vitals still need verification after deployment is authorized. Automated accessibility checks complement, but do not replace, human screen-reader testing.
