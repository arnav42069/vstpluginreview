Build the standalone VST Plugin Review publication for vstpluginreview.com. The README's remaining merge markers are removed while preserving the product documentation. All five supplied articles are imported in full as MDX and remain `ready`; public routes, search, RSS and sitemap exclude them, and production rejects preview requests even with the preview environment flag enabled.

The implementation includes a responsive dark editorial design, TanStack Start SSR, React/TypeScript/Tailwind, validated build-time MDX, search and topic/skill/plugin filters, article TOC and reading progress, related articles, author/ownership/policy pages, canonical/social metadata, PNG social artwork, structured data, RSS, sitemap and robots. Real-media components support audio controls, level-matched comparisons and click-to-load YouTube; absent media is hidden. Owned links carry disclosures and campaign parameters. Newsletter is explicitly unavailable until a real provider and consent/rate-limiting integration are configured; analytics events stay local.

Validation:

- Frozen installation with `npm ci` and production dependency audit (0 vulnerabilities).
- Content validation: five full drafts, zero published; duplicate metadata, links and asset checks.
- TypeScript and ESLint pass.
- 15 Vitest tests pass, including production preview gating and published-feed fixtures.
- 11 Playwright tests pass: navigation, all five previews, full-text search, metadata, production isolation, no-JavaScript SSR, keyboard access, five widths (360–1440px), and automated WCAG checks on representative pages.
- Node production build and local Vercel Build Output generation pass. Nothing was deployed.

Editorial approval and vendor fact-checking are still required. No reviews, ratings, audio recordings, testimonials or testing results were fabricated. The current Nitro Vite adapter is pinned to its available 3.0 release candidate; real Vercel runtime and field performance validation remain post-authorization checks. See docs/PUBLISHING.md for operation and approval instructions.

Do not merge, deploy, or publish the articles until the owner approves.

Final validation notes:

- The final local Lighthouse mobile homepage run scored Performance 100, Accessibility 100, SEO 100. These lab scores are not field performance guarantees.
- Broader WCAG checks include WCAG 2.1 A accessible-name matching. Decorative card art does not duplicate navigation links; visible arrows use SVG instead of font-dependent glyphs.
- ESLint 10 is used with a minimatch >=11.0.1 override to address the actual development-tooling advisory GHSA-g3hv-75wg-m249. Lint passes against this resolution, and the complete dependency audit reports zero vulnerabilities. Keep the override until upstream constraints allow the fixed release.
- The feature branch is `feat/editorial-website`. Git pushes work, but the environment's GitHub API has returned Forbidden for PR creation. This is an external delivery blocker, separate from the passing implementation checks. No PR, merge or deployment is claimed by this report.
