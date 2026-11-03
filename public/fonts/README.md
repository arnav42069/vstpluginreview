# Self-hosted editorial fonts

Downloaded from Google Fonts on 2026-11-03 with Latin-language coverage. Space Grotesk and Inter were subset to Latin, Latin Extended-A and editorial punctuation. IBM Plex Mono is the unmodified official Google Fonts Latin WOFF2 distribution, preserving its Reserved Font Name. Original font family names are retained. Each family is distributed under its included SIL Open Font License; copyright/notice tables remain inside the WOFF2 files.

- Space Grotesk: display/headline, weights 500 and 700. Source: https://fonts.google.com/specimen/Space+Grotesk; license https://github.com/google/fonts/tree/main/ofl/spacegrotesk.
- Inter: editorial/UI body, weights 400 and 600. Source: https://fonts.google.com/specimen/Inter; license https://github.com/google/fonts/tree/main/ofl/inter.
- IBM Plex Mono: selective metadata/specification labels, weight 400. Source: https://fonts.google.com/specimen/IBM+Plex+Mono; license https://github.com/google/fonts/tree/main/ofl/ibmplexmono.

The CSS declares only these five files. Above-the-fold body and headline fonts are preloaded from this origin; `font-display: swap` provides immediate readable fallbacks. No visitor request goes to Google Fonts. No font tooling is required at website build/runtime.
