# Plugin Signal — Codex-ready editorial website starter

This archive contains a full build PRD, a research/publishing brief, a complete Codex implementation prompt and **five full Markdown articles**.

## Files

- `PRD.md`: full product, UX, SEO, data, technical and acceptance requirements.
- `ARTICLE_BRIEFS.md`: SEO search-intent hypotheses, editorial notes, source/asset needs, fact-check checklist.
- `CODEX_PROMPT.md`: paste into Codex after placing this directory in your repo/workspace.
- `articles/01-psytrance-kick.md`: Psytrance kick tutorial.
- `articles/02-phase-alignment.md`: Kick/bass phase troubleshooting.
- `articles/03-free-vsts.md`: Free EDM plugin starter toolkit.
- `articles/04-kick-synth-vs-samples.md`: Comparison / purchase education.
- `articles/05-drum-compression.md`: Drum compression tutorial.

## How to use

1. Extract the archive into a **new website repository** (not into the main Azazel Audio production website).
2. Open Codex in that directory and instruct it to read `CODEX_PROMPT.md`, `PRD.md`, and `ARTICLE_BRIEFS.md` and implement the site.
3. Review and fact-check all five articles. Add real media if available; check product URL/feature claims, current free-tier conditions and ownership disclosures.
4. Change article statuses from `ready` to `published` when you're satisfied, after setting the real `SITE_URL` and production env configuration.
5. Deploy only after reviewing the implementation report, security setup and preview.

## Editorial honesty

The articles are substantive drafts. They do **not** claim that plugins were personally tested, and do not include fabricated results, audio, pricing or screenshots. Actual review content requires hands-on testing and evidence. Article date metadata is a draft placeholder date; set true publication date at publication.

## Source references

- https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- https://developers.google.com/search/docs/appearance/reviews-system
- https://developers.google.com/search/docs/appearance/ai-features
- Official vendor URLs are inside article 03.

## Website development

The standalone website is now implemented with TanStack Start, React, TypeScript, Tailwind CSS and build-time MDX. The configured canonical destination is `https://vstpluginreview.com`; nothing is automatically deployed.

```sh
npm ci
EDITORIAL_PREVIEW=true npm run dev
```

Use Node 24. Public pages contain only approved, published content. All five supplied articles remain `ready` and are accessible at `/preview` only with the nonproduction preview setting above. No audio assets or testing claims have been invented.

```sh
npm run content:validate
npm run typecheck
npm run lint
npm test
npm run build
npm run test:e2e
```

The Playwright suite uses `/usr/bin/chromium` by default in this cloud machine. Elsewhere run `npx playwright install --with-deps chromium` and `CHROMIUM_PATH=bundled npm run test:e2e`, or set `CHROMIUM_PATH` to a local Chromium executable. CI uses the bundled browser. Test screenshots are generated under ignored `test-results/`.

See [publishing, media, environment and Vercel instructions](docs/PUBLISHING.md) and [.env.example](.env.example). Newsletter and analytics remain unconnected; the newsletter clearly states it is not accepting subscriptions. The deployment domain, editorial approval, vendor fact-checking and any future provider credentials remain owner actions.
