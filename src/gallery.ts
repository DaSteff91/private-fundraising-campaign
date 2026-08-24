// SPDX-License-Identifier: MIT
import type { Copy } from "./i18n";

export type GalleryPhoto = {
  kind: "photo";
  src: string;
  width: number;
  height: number;
};

export type GalleryVideo = {
  kind: "video";
  src: string;
  poster: string;
  width: number;
  height: number;
};

export type GalleryItem = GalleryPhoto | GalleryVideo;

/** Demo placeholders only — replace with your own media when forking. */
export const GALLERY: readonly GalleryItem[] = [
  { kind: "photo", src: "/media/photo-01.svg", width: 640, height: 480 },
  { kind: "photo", src: "/media/photo-02.svg", width: 640, height: 480 },
  { kind: "photo", src: "/media/photo-03.svg", width: 640, height: 480 },
];

function photoAlt(copy: Copy, photoIndex: number): string {
  return copy.hero.photoAlts[photoIndex] ?? "";
}

function videoAlt(copy: Copy, videoIndex: number): string {
  return copy.hero.videoAlts[videoIndex] ?? "";
}

function playMark(): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  svg.classList.add("play-icon");
  const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
  polygon.setAttribute("points", "9 6 9 18 19 12");
  svg.append(polygon);
  return svg;
}

function photoTile(
  item: GalleryPhoto,
  index: number,
  photoIndex: number,
  copy: Copy,
  featured: boolean,
): HTMLLIElement {
  const li = document.createElement("li");
  if (featured) li.className = "is-featured";
  const link = document.createElement("a");
  link.className = "zoomable";
  link.href = item.src;
  link.setAttribute("aria-haspopup", "dialog");
  link.setAttribute("aria-label", copy.lightbox.enlarge);
  link.dataset.galleryIndex = String(index);
  const img = document.createElement("img");
  img.src = item.src;
  img.width = item.width;
  img.height = item.height;
  img.alt = photoAlt(copy, photoIndex);
  img.decoding = "async";
  if (featured) {
    img.loading = "eager";
    img.fetchPriority = "high";
  } else {
    img.loading = "lazy";
  }
  link.append(img);
  li.append(link);
  return li;
}

function videoTile(
  item: GalleryVideo,
  index: number,
  videoIndex: number,
  copy: Copy,
): HTMLLIElement {
  const li = document.createElement("li");
  const button = document.createElement("button");
  button.type = "button";
  button.className = "gallery-video";
  button.setAttribute("aria-haspopup", "dialog");
  button.setAttribute("aria-label", copy.lightbox.play);
  button.dataset.galleryIndex = String(index);
  const img = document.createElement("img");
  img.src = item.poster;
  img.width = item.width;
  img.height = item.height;
  img.alt = videoAlt(copy, videoIndex);
  img.loading = "lazy";
  img.decoding = "async";
  const badge = document.createElement("span");
  badge.className = "play-badge";
  badge.append(playMark());
  button.append(img, badge);
  li.append(button);
  return li;
}

function block(
  label: string,
  listClass: string,
  items: HTMLLIElement[],
): HTMLDivElement {
  const wrap = document.createElement("div");
  wrap.className = "gallery-block";
  const heading = document.createElement("h2");
  heading.className = "visually-hidden";
  heading.textContent = label;
  const list = document.createElement("ul");
  list.className = listClass;
  list.setAttribute("role", "list");
  list.append(...items);
  wrap.append(heading, list);
  return wrap;
}

export function renderGallery(copy: Copy): void {
  const host = document.querySelector("#hero-gallery");
  if (!(host instanceof HTMLElement)) return;

  const photoItems: HTMLLIElement[] = [];
  const videoItems: HTMLLIElement[] = [];
  let photoIndex = 0;
  let videoIndex = 0;

  GALLERY.forEach((item, index) => {
    if (item.kind === "photo") {
      photoItems.push(photoTile(item, index, photoIndex, copy, photoIndex === 0));
      photoIndex += 1;
      return;
    }
    videoItems.push(videoTile(item, index, videoIndex, copy));
    videoIndex += 1;
  });

  host.replaceChildren(
    block(copy.gallery.photos, "gallery-photos-grid", photoItems),
    block(copy.gallery.videos, "gallery-videos-grid", videoItems),
  );
}
