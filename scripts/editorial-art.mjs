// Original editorial diagrams, created for this publication. No vendor UI is depicted.
import fs from "node:fs";
import { Resvg } from "@resvg/resvg-js";
const root = "public/media/articles";
const specs = [
  [
    "best-compressor-vst-plugins-2026",
    "DYNAMICS / 01",
    "Make room",
    "for the transient.",
    "COMPRESSION · CHARACTER · CONTROL",
    "compression",
  ],
  [
    "best-free-vst-plugins-2026",
    "THE TOOLKIT / 02",
    "A complete studio.",
    "An open starting point.",
    "SYNTHESIS · SPACE · ANALYSIS",
    "toolkit",
  ],
  [
    "modular-synthesis-beginners-guide",
    "SIGNAL FLOW / 03",
    "One cable.",
    "A new possibility.",
    "OSCILLATOR → FILTER → VCA → OUTPUT",
    "modular",
  ],
  [
    "kick-drum-synthesis-guide",
    "SOUND DESIGN / 04",
    "The anatomy",
    "of a kick.",
    "TRANSIENT · PITCH · ENVELOPE",
    "kick",
  ],
];
for (const [slug, label, line1, line2, caption, kind] of specs) {
  let drawing = "";
  if (kind === "compression") {
    drawing =
      '<path d="M570 500L570 185M570 500H1110" stroke="#75867e" stroke-width="2"/>';
    drawing +=
      '<path d="M590 480L800 270L1090 175" fill="none" stroke="#a8f0d0" stroke-width="5"/><path d="M590 480L1070 40" fill="none" stroke="#fff" opacity=".18" stroke-dasharray="8 10"/>';
    drawing +=
      '<circle cx="800" cy="270" r="9" fill="#a8f0d0"/><text x="835" y="320" fill="#a8f0d0" font-size="18" font-family="monospace">THRESHOLD</text><text x="605" y="540" fill="#a9b6be" font-size="16" font-family="monospace">INPUT → OUTPUT</text>';
  } else if (kind === "toolkit") {
    for (let i = 0; i < 6; i++) {
      let x = 610 + (i % 3) * 165,
        y = 200 + Math.floor(i / 3) * 160;
      drawing += `<rect x="${x}" y="${y}" width="145" height="138" rx="8" fill="#192c24" stroke="#43594e"/><text x="${x + 18}" y="${y + 105}" fill="#a8f0d0" font-family="monospace" font-size="15">${["SYNTH", "EQ", "COMP", "SPACE", "DRIVE", "METER"][i]}</text>`;
      for (let j = 0; j < 7; j++) {
        let h = 15 + Math.abs(Math.sin(j * 1.4 + i)) * 35;
        drawing += `<rect x="${x + 20 + j * 15}" y="${y + 65 - h}" width="6" height="${h}" fill="#a8f0d0" opacity="${0.35 + j * 0.08}"/>`;
      }
    }
  } else if (kind === "modular") {
    for (let i = 0; i < 3; i++) {
      let x = 625 + i * 158;
      drawing += `<rect x="${x}" y="195" width="135" height="320" rx="5" fill="#192c24" stroke="#43594e"/><text x="${x + 20}" y="235" fill="#a8f0d0" font-size="20" font-family="monospace">${["VCO", "VCF", "VCA"][i]}</text><circle cx="${x + 68}" cy="315" r="28" fill="#0b1116" stroke="#a8f0d0"/><path d="M${x + 68} 315v-20" stroke="#fff" stroke-width="3"/><circle cx="${x + 38}" cy="460" r="8" fill="#a8f0d0"/><circle cx="${x + 98}" cy="460" r="8" fill="#a8f0d0"/>`;
      drawing += "</g>";
    }
    drawing +=
      '<path d="M723 460C723 565 821 565 821 460M881 460C881 600 979 600 979 460" fill="none" stroke="#a8f0d0" stroke-width="6"/>';
  } else {
    let points = [];
    for (let i = 0; i <= 520; i++) {
      let x = 610 + i,
        y =
          355 -
          Math.sin(i * 0.07 + 10 * (1 - Math.exp(-i / 25))) *
            145 *
            Math.exp(-i / 170);
      points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    drawing = `<path d="M600 355H1140" stroke="#43594e"/><polyline points="${points.join(" ")}" fill="none" stroke="#a8f0d0" stroke-width="3"/><path d="M610 205C670 365 810 465 1125 480" fill="none" stroke="#bcb0e9" stroke-width="3" stroke-dasharray="8 8"/><text x="635" y="180" fill="#a8f0d0" font-size="17" font-family="monospace">ATTACK</text><text x="930" y="530" fill="#bcb0e9" font-size="17" font-family="monospace">PITCH DECAY</text>`;
  }
  drawing = drawing.replaceAll("</g>", "");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675"><defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#a8f0d0" stroke-opacity=".065"/></pattern></defs><rect width="1200" height="675" fill="#0b1116"/><rect width="1200" height="675" fill="url(#grid)"/><rect x="52" y="58" width="30" height="4" fill="#a8f0d0"/><text x="52" y="105" fill="#a8f0d0" font-size="17" font-family="monospace" letter-spacing="3">${label}</text><text x="52" y="285" fill="#f1f4f5" font-family="Arial, sans-serif" font-size="49" font-weight="700" letter-spacing="-2">${line1}</text><text x="52" y="348" fill="#a8f0d0" font-family="Arial, sans-serif" font-size="43" font-weight="700" letter-spacing="-2">${line2}</text><text x="52" y="405" fill="#a9b6be" font-family="monospace" font-size="13">${caption.replaceAll("&", "&amp;")}</text><path d="M52 572H1148" stroke="#29353d"/><text x="52" y="613" fill="#f1f4f5" font-size="15" font-family="monospace" letter-spacing="2">VST PLUGIN REVIEW</text><text x="845" y="613" fill="#a9b6be" font-size="12" font-family="monospace">ORIGINAL EDITORIAL ILLUSTRATION</text>${drawing}</svg>`;
  const dir = `${root}/${slug}`;
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(`${dir}/featured.svg`, svg);
  fs.writeFileSync(
    `${dir}/featured.png`,
    new Resvg(svg, { font: { loadSystemFonts: true } }).render().asPng(),
  );
}
console.log("Created four original featured graphics (1200 × 675).");
