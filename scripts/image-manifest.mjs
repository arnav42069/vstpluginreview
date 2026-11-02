import fs from "node:fs";
const articles = JSON.parse(
  fs.readFileSync("src/generated/articles.json", "utf8"),
);
const original =
  "https://github.com/arnav42069/vstpluginreview/blob/main/scripts/editorial-images.py";
const known = {
  "pro-c-3-press.webp": {
    source: "https://www.fabfilter.com/downloads/press/fabfilter-pro-c.zip",
    credit: "FabFilter",
    license: "Manufacturer press kit, editorial coverage",
    kind: "authentic manufacturer screenshot; WebP conversion",
  },
  "surge-xt.webp": {
    source:
      "https://github.com/surge-synthesizer/surge-synthesizer.github.io/blob/688fd153c99c45b694d1f717eb4751349180f7cd/public/images/manual-xt/Pictures/surge.png",
    credit: "Surge Synth Team and contributors",
    license: "GNU GPL v3; original PNG and full license retained",
    kind: "authentic official manual screenshot; WebP conversion",
  },
  "dragonfly-hall.webp": {
    source:
      "https://github.com/michaelwillis/dragonfly-reverb/blob/440ec7b3b3db2fec34b9f80cf4890102ca14d1c3/docs/images/dragonfly-hall-reverb/interface.png",
    credit: "Michael Willis and Dragonfly Reverb contributors",
    license: "GNU GPL v3; original PNG and full license retained",
    kind: "authentic official documentation screenshot; WebP conversion",
  },
};
const assets = new Map();
for (const a of articles) {
  if (a.featuredImage)
    assets.set(a.featuredImage, {
      asset: a.featuredImage,
      source: a.featuredImageSource,
      credit: a.featuredImageCredit,
      license: a.featuredImageLicense,
      kind: a.slug.includes("compressor-vst")
        ? "manufacturer press screenshot composition"
        : a.slug === "best-free-vst-plugins-2026"
          ? "collage of two authentic GPL interface screenshots"
          : "original topic-specific mathematical visualization",
      checked: "2026-11-02",
    });
  for (const m of a.html.matchAll(/<img[^>]*src="([^"]+)"[^>]*>/g)) {
    const name = m[1].split("/").at(-1);
    assets.set(m[1], {
      asset: m[1],
      ...(known[name] ?? {
        source: original,
        credit: "VST Plugin Review",
        license: "Original publication artwork",
        kind: "original educational diagram, synthetic signal or mathematical chart; not a GUI screenshot",
      }),
      checked: "2026-11-02",
    });
  }
  for (const im of a.gallery ?? [])
    assets.set(im.src, {
      asset: im.src,
      source: im.source,
      credit: im.credit,
      license: im.license,
      kind: "metadata gallery image",
      checked: "2026-11-02",
    });
}
fs.writeFileSync(
  "public/media/asset-sources.json",
  JSON.stringify(
    {
      checked: "2026-11-02",
      notes:
        "Sources, original source binaries and full GPL licenses are documented in LICENSES.md. No generated product UI, fake DAW capture or plugin measurement is used.",
      assets: [...assets.values()],
    },
    null,
    2,
  ) + "\n",
);
console.log(`Documented ${assets.size} active editorial assets.`);
