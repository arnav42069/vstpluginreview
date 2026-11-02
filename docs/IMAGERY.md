# Editorial image system — 2 November 2026

All nine existing articles now use explicit `featuredImage` metadata and individual WebP artwork; original draft statuses remain ready. The four public articles have 26 distinct active assets across their images and draft thumbnails. Current page layouts, light/dark tokens, typography and mint brand accents are preserved.

## Published image sets

- Compressors: authentic FabFilter Pro-C 3 press-kit interface in the cover and full in-body view; original ratio, timing-envelope and parallel-routing diagrams. Four in-body figures.
- Free tools: genuine Surge XT and Dragonfly Hall Reverb screenshot composition, full interfaces in the body, plus original EQ and toolkit-routing diagrams. Four in-body figures. Added a short primary-source description of Dragonfly beside its screenshot.
- Kick synthesis: original DAW-neutral synthetic waveform cover; pitch, amplitude, phase-sum and tail-length illustrations. Four in-body figures. It is explicitly not an Ableton capture or measured plugin output.
- Modular synthesis: original colored audio/CV routing cover, audio-chain and control-routing diagrams, waveform shapes, ADSR contour and the existing original patch schematic. Five in-body figures. These are functional schematics, not reconstructed VCV Rack panels.

## Provenance and missing authentic assets

Machine-readable source manifest: `public/media/asset-sources.json`. Detailed rights/attribution: `public/media/LICENSES.md`. Source PNGs and full GPL licenses remain alongside Surge and Dragonfly assets; FabFilter's original JPEG is retained. Press imagery is used for editorial product coverage, not represented as our own test capture. Colors and controls are unchanged.

Still needed for a later replacement: an authorized Ableton Live Clip View capture of a real kick sample, Suckerpunch and BazzISM interface captures, and commercially reusable VCV Rack full-rack/step-by-step screenshots. Vital's official press image was found but download returned 403; no arbitrary third-party copy was used. No Valhalla or TDR screenshot reuse permission was established. The free cover uses the two licensed authentic alternatives instead. No imaginary software interface has been created.

## Metadata and authoring

Use these fields (legacy `heroImage`/`heroAlt` remain compatible):

```yaml
featuredImage: /media/articles/my-slug/featured.webp
featuredImageAlt: Descriptive account of the actual image
featuredImagePosition: center # or, for example, 55% 35%
featuredImageCredit: Actual creator / manufacturer
featuredImageSource: https://official.example/press
featuredImageLicense: Actual reuse basis
```

The compiler requires all featured-image provenance fields and validates local files. Card, hero and social metadata share the image; focal position is applied consistently. Figures preserve complete controls and intrinsic aspect ratios; cards use 16:9 framing. Only the priority hero is eager/high-priority, with other figures lazy-loaded.

`ArticleImage` accepts src/alt/width/height/caption/credit/source/license/position and optional `enlarge={false}`. Its normal full-image link works without JavaScript; the global lightbox adds a native keyboard-accessible dialog with Escape/close/focus restoration. Optional frontmatter `gallery` accepts the same image metadata for a reusable gallery. Image-text sections can use `editorial-image-text`.

Original mathematical visuals and compositions are reproducible with `python3 scripts/editorial-images.py` (NumPy/Matplotlib/Pillow in the development environment). This is build tooling, not a new website dependency. After media/content edits, run `npm run content:validate` and `node scripts/image-manifest.mjs`; register the actual provenance of new screenshot assets in the manifest helper rather than treating them as original artwork.

## Verification

Content validation, TypeScript, ESLint, 15 unit tests and 18 Playwright tests passed. Browser coverage checks every public image load and source entry, per-article figure counts, mobile overflow, keyboard lightbox opening/closing/focus return, dialog accessibility, both-theme page accessibility, metadata, SSR, publication boundaries and 360–1440px layouts. Node production build passed; Vercel output also passed with a server function and catch-all route.
