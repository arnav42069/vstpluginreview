import { responsiveImage } from "../lib/images";
import { useEffect, useId, useRef, useState } from "react";

export type EditorialImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  credit?: string;
  source?: string;
  license?: string;
  position?: string;
};

function localImage(src: string) {
  return (
    src.startsWith("/media/articles/") &&
    !src.includes("..") &&
    !src.includes("\\") &&
    /\.(?:avif|webp|png|jpe?g|svg)$/i.test(src)
  );
}

/** Metadata-driven article images retain a useful full-image link without JS. */
export function ArticleGallery({ images }: { images?: EditorialImage[] }) {
  if (!images?.length) return null;
  return (
    <section className="article-gallery" aria-label="Article image gallery">
      {images.map((image) => {
        if (
          !localImage(image.src) ||
          !image.alt.trim() ||
          image.width <= 0 ||
          image.height <= 0
        )
          throw Error(
            "Gallery images require a local image, alt text and dimensions",
          );
        return (
          <figure className="article-image gallery-image" key={image.src}>
            <a
              href={image.src}
              data-enlarge-image=""
              data-image-alt={image.alt}
              data-image-caption={image.caption}
              data-image-credit={image.credit}
              aria-label={`Enlarge image: ${image.alt}`}
            >
              <img
                {...responsiveImage(image.src)}
                alt={image.alt}
                width={image.width}
                height={image.height}
                loading="lazy"
                decoding="async"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  objectFit: "contain",
                  objectPosition: image.position || "center",
                }}
              />
            </a>
            <figcaption>
              {image.caption && <span>{image.caption}</span>}
              {(image.credit || image.license || image.source) && (
                <small className="image-provenance">
                  {image.credit && <span>{image.credit}</span>}
                  {image.license && <span> · {image.license}</span>}
                  {image.source?.startsWith("https://") && (
                    <>
                      {" · "}
                      <a href={image.source} rel="noopener noreferrer">
                        Image source
                      </a>
                    </>
                  )}
                </small>
              )}
            </figcaption>
          </figure>
        );
      })}
    </section>
  );
}

type EnlargedImage = Pick<EditorialImage, "src" | "alt" | "caption" | "credit">;

/** One delegated listener also enhances images inside precompiled MDX HTML. */
export function ImageLightbox() {
  const [image, setImage] = useState<EnlargedImage | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const captionId = useId();

  useEffect(() => {
    function enlarge(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        !(event.target instanceof Element) ||
        !dialog.current ||
        typeof dialog.current.showModal !== "function"
      )
        return;
      const link = event.target.closest<HTMLAnchorElement>(
        "a[data-enlarge-image]",
      );
      const src = link?.getAttribute("href");
      if (!link || !src || !localImage(src)) return;
      event.preventDefault();
      returnFocus.current = link;
      const thumbnail = link.querySelector("img");
      setImage({
        src,
        alt:
          link.dataset.imageAlt || thumbnail?.alt || "Enlarged article image",
        caption: link.dataset.imageCaption,
        credit: link.dataset.imageCredit,
      });
    }
    document.addEventListener("click", enlarge);
    return () => document.removeEventListener("click", enlarge);
  }, []);

  useEffect(() => {
    if (!image || !dialog.current) return;
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (!element.open) element.showModal();
    closeButton.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      if (element.open) element.close();
    };
  }, [image]);

  function closed() {
    setImage(null);
    if (returnFocus.current?.isConnected) returnFocus.current.focus();
    returnFocus.current = null;
  }

  return (
    <dialog
      ref={dialog}
      className="image-lightbox"
      aria-labelledby={titleId}
      aria-describedby={image?.caption || image?.credit ? captionId : undefined}
      onClose={closed}
      onClick={(event) => {
        if (event.target === event.currentTarget) dialog.current?.close();
      }}
      style={{
        maxWidth: "96vw",
        maxHeight: "96vh",
        padding: "1rem",
        borderRadius: "0.75rem",
      }}
    >
      <div className="image-lightbox-toolbar">
        <h2 id={titleId} style={{ margin: "0 0 1rem", fontSize: "1.1rem" }}>
          Enlarged article image
        </h2>
        <button
          type="button"
          ref={closeButton}
          onClick={() => dialog.current?.close()}
          aria-label="Close enlarged image"
        >
          Close
        </button>
      </div>
      {image && (
        <figure style={{ margin: 0 }}>
          <img
            src={image.src}
            alt={image.alt}
            style={{
              display: "block",
              maxWidth: "90vw",
              maxHeight: "80vh",
              width: "auto",
              height: "auto",
              objectFit: "contain",
              margin: "auto",
            }}
          />
          {(image.caption || image.credit) && (
            <figcaption id={captionId}>
              {image.caption}
              {image.credit && <small> {image.credit}</small>}
            </figcaption>
          )}
        </figure>
      )}
    </dialog>
  );
}
