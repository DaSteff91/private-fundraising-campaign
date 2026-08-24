// SPDX-License-Identifier: MIT
import { GALLERY, type GalleryItem } from "./gallery";
import type { Copy } from "./i18n";

function enlargeLabel(copy: Copy): string {
  return copy.lightbox.enlarge;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function altFor(copy: Copy, item: GalleryItem, at: number): string {
  if (item.kind === "photo") {
    const photoIndex = GALLERY.slice(0, at).filter((row) => row.kind === "photo").length;
    return copy.hero.photoAlts[photoIndex] ?? "";
  }
  const videoIndex = GALLERY.slice(0, at).filter((row) => row.kind === "video").length;
  return copy.hero.videoAlts[videoIndex] ?? "";
}

export function wrapZoomable(img: HTMLImageElement, href: string, copy: Copy): HTMLAnchorElement {
  const existing = img.closest("a.zoomable");
  if (existing instanceof HTMLAnchorElement) {
    existing.href = href;
    existing.setAttribute("aria-label", enlargeLabel(copy));
    return existing;
  }
  const link = document.createElement("a");
  link.className = "zoomable";
  link.href = href;
  link.setAttribute("aria-haspopup", "dialog");
  link.setAttribute("aria-label", enlargeLabel(copy));
  if (img.parentNode) img.replaceWith(link);
  link.append(img);
  return link;
}

export function enhanceImages(copy: Copy): void {
  const label = enlargeLabel(copy);
  document.querySelectorAll("main img").forEach((node) => {
    if (!(node instanceof HTMLImageElement) || !node.src) return;
    if (node.closest("#lightbox, .hero-gallery, .gallery-video")) return;
    const parent = node.closest("a.zoomable");
    if (parent instanceof HTMLAnchorElement) {
      parent.setAttribute("aria-label", label);
      return;
    }
    wrapZoomable(node, node.currentSrc || node.src, copy);
  });
}

export function setupLightbox(getCopy: () => Copy): void {
  const dialog = document.querySelector("#lightbox");
  const picture = dialog?.querySelector("img");
  const video = dialog?.querySelector("video");
  const closeBtn = dialog?.querySelector(".lightbox-close");
  const prevBtn = dialog?.querySelector(".lightbox-prev");
  const nextBtn = dialog?.querySelector(".lightbox-next");
  if (
    !(dialog instanceof HTMLDialogElement) ||
    !(picture instanceof HTMLImageElement) ||
    !(video instanceof HTMLVideoElement) ||
    !(closeBtn instanceof HTMLButtonElement) ||
    !(prevBtn instanceof HTMLButtonElement) ||
    !(nextBtn instanceof HTMLButtonElement)
  ) {
    return;
  }

  let index: number | null = null;

  const teardownVideo = (): void => {
    video.pause();
    video.removeAttribute("src");
    video.load();
  };

  const close = (): void => {
    if (dialog.open) dialog.close();
  };

  const showNav = (gallery: boolean): void => {
    prevBtn.hidden = !gallery;
    nextBtn.hidden = !gallery;
  };

  const paint = (item: GalleryItem, alt: string): void => {
    if (item.kind === "photo") {
      teardownVideo();
      video.hidden = true;
      picture.hidden = false;
      picture.src = item.src;
      picture.alt = alt;
      return;
    }
    picture.removeAttribute("src");
    picture.alt = "";
    picture.hidden = true;
    teardownVideo();
    video.hidden = false;
    video.poster = item.poster;
    video.src = item.src;
    video.setAttribute("aria-label", alt);
    if (!prefersReducedMotion()) {
      void video.play().catch(() => undefined);
    }
  };

  const openGallery = (at: number): void => {
    const wrapped = (at + GALLERY.length) % GALLERY.length;
    const item = GALLERY[wrapped];
    if (!item) return;
    index = wrapped;
    const copy = getCopy();
    closeBtn.setAttribute("aria-label", copy.lightbox.close);
    prevBtn.setAttribute("aria-label", copy.lightbox.prev);
    nextBtn.setAttribute("aria-label", copy.lightbox.next);
    showNav(true);
    paint(item, altFor(copy, item, wrapped));
    document.body.style.overflow = "hidden";
    if (!dialog.open) dialog.showModal();
  };

  const openSingle = (img: HTMLImageElement): void => {
    index = null;
    teardownVideo();
    video.hidden = true;
    picture.hidden = false;
    picture.src = img.currentSrc || img.src;
    picture.alt = img.alt;
    showNav(false);
    closeBtn.setAttribute("aria-label", getCopy().lightbox.close);
    document.body.style.overflow = "hidden";
    if (!dialog.open) dialog.showModal();
  };

  dialog.addEventListener("close", () => {
    document.body.style.overflow = "";
    index = null;
    teardownVideo();
    picture.removeAttribute("src");
    picture.alt = "";
  });

  document.addEventListener("click", (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = event.target;
    if (!(target instanceof Element) || target.closest("#lightbox")) return;
    const galleryHit = target.closest("[data-gallery-index]");
    if (galleryHit instanceof HTMLElement && galleryHit.dataset.galleryIndex !== undefined) {
      event.preventDefault();
      openGallery(Number(galleryHit.dataset.galleryIndex));
      return;
    }
    const link = target.closest("a.zoomable");
    if (!(link instanceof HTMLAnchorElement) || !link.querySelector("img")) return;
    event.preventDefault();
    const img = link.querySelector("img");
    if (img instanceof HTMLImageElement) openSingle(img);
  });

  prevBtn.addEventListener("click", () => {
    if (index === null) return;
    openGallery(index - 1);
  });
  nextBtn.addEventListener("click", () => {
    if (index === null) return;
    openGallery(index + 1);
  });

  document.addEventListener("keydown", (event) => {
    if (!dialog.open || index === null) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      openGallery(index - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      openGallery(index + 1);
    }
  });

  closeBtn.addEventListener("click", close);
  picture.addEventListener("click", close);
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) close();
  });
}
