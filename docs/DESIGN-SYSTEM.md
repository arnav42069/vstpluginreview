# VST Plugin Review — editorial design system

Implemented 3 November 2026. The existing TanStack Start application, public routes, publication boundaries, article prose, images, source credits, SEO data and theme preference storage are preserved.

## Typographic identity

Space Grotesk (500 / 700) is used for headlines and the masthead; Inter (400 / 600) for technical long-form prose and interface text; IBM Plex Mono (400) for selective publication metadata, categories, dates and specifications. Fonts are self-hosted WOFF2 with bundled SIL OFL notices. Headline and body fonts are preloaded, other weights load only when used, and all have immediate readable fallbacks. No visitor requests go to a font CDN. No runtime dependencies were added.

CSS tokens define display/body/mono families; fluid display, section and story scales; small/deck/body roles; spacing; a 72ch reading measure; and semantic light/dark colors. `Typography.tsx` exposes `EditorialHeading` and `MetaLine` so editorial hierarchy remains consistent across homepage and article templates. Ordinary prose has no artificial tracking. Headlines use controlled tight spacing and balanced wrapping.

## Editorial patterns

- Compact sticky masthead with preserved mark, restrained navigation, current-page states, persistent Settings theme controls and Search linking to the actual directory search field.
- A publication strap and asymmetrical introductory masthead preserve “Better tools. More deliberate music.” while connecting it directly to the lead story through a deep-green rule and a small audio-inspired signal mark.
- One lead story, one image-led secondary feature, two compact side stories, separate tools/free-guide desks, and typography-led tutorial rows. Topic index and policy/newsletter modules use the same rhythm.
- Standard, compact and wide story variants share real category, date and reading-time metadata. Author information is optional. Typography and image scale establish importance instead of enclosing every story in the same bordered card.
- Article headlines and decks are larger; long-form text sits directly on the canvas without an enclosing card. Sticky contents, anchored headings, quotation/callout styling, overflow-safe comparison tables, figure captions, credited full-image enlargement and related stories remain intact.

## Palette and accessibility

The light theme uses a nuanced gray-green canvas, softly warm surfaces, near-black text and deep green accents. The dark theme uses charcoal-green surfaces, soft off-white text and a lighter green accent. Images keep their authentic colors. All interactive controls retain visible focus; reduced-motion preferences remove smooth scrolling and hover motion. Mobile navigation stays visible, Settings remains operable, and wide article content remains contained.

## Verification

Content validation, TypeScript, ESLint and 15 unit tests passed. The 21-browser-test suite covers 360–1440px layouts, new magazine patterns, local font loading without Google requests, search, heading visibility below the sticky masthead, comfortable text measure, both-theme automated WCAG checks, persisted preference, article metadata, draft isolation, SSR without JavaScript, image provenance/load and keyboard lightbox behavior. Node and Vercel production builds are checked before pushing.

## Git push workflow

The user-requested reusable skill is `.agents/skills/gitpush/SKILL.md`. It reviews task-owned changes, runs relevant checks, commits, verifies fast-forward ancestry, pushes only to the session-authorized destination, and checks the resulting deployment. It prohibits force pushes, unrelated staging, secret inclusion and unverified deployment claims.

The newer responsive-image delivery commit on main was integrated before pushing. Its srcset manifests, optimized image variants and full-resolution enlargement were preserved; the new compact and featured story patterns declare matching image sizes.
