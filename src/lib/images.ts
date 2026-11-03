import manifest from "./image-variants.json";

type ImageVariants = {
  width: number;
  height: number;
  variants: { src: string; width: number }[];
};
const variants: Record<string, ImageVariants> = manifest;

export const cardImageSizes =
  "(max-width: 767px) calc(100vw - 40px), (max-width: 1024px) calc((100vw - 81px) / 2), 380px";
export const featuredImageSizes =
  "(max-width: 767px) calc(100vw - 40px), (max-width: 1280px) 55vw, 700px";
export const articleImageSizes =
  "(max-width: 767px) calc(100vw - 40px), (max-width: 1024px) calc(100vw - 256px), 760px";
export const heroImageSizes =
  "(max-width: 767px) calc(100vw - 40px), (max-width: 1280px) calc(100vw - 96px), 1184px";

/** Unknown and vector assets use their original source without broken candidates. */
export function responsiveImage(src: string, sizes = articleImageSizes) {
  const image = variants[src];
  if (!image) return { src };
  return {
    src,
    srcSet: image.variants.map((v) => `${v.src} ${v.width}w`).join(", "),
    sizes,
  };
}
