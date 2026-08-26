// SPDX-License-Identifier: MIT
import { CAMPAIGN_NAME, DONATION_CURRENCY, LOCAL_CURRENCY } from "./config";
import { copyFor, isLang, type Copy, type Lang } from "./i18n";
import { loadAllCopies } from "./i18n/loadCopy";
import {
  captionFor,
  donationsWithImages,
  loadCampaign,
  type Campaign,
} from "./live";
import { enhanceImages, setupLightbox, wrapZoomable } from "./lightbox";
import { formatMoney } from "./money";

const STORAGE_KEY = "pfc-lang";

function readLang(): Lang {
  const fromUrl = new URL(window.location.href).searchParams.get("lang");
  if (isLang(fromUrl)) return fromUrl;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (isLang(stored)) return stored;
  return "de";
}

function setLang(lang: Lang): void {
  const url = new URL(window.location.href);
  url.searchParams.set("lang", lang);
  history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  localStorage.setItem(STORAGE_KEY, lang);
}

function deepGet(copy: Copy, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, copy);
}

function applyCopy(copy: Copy): void {
  document.title = `${copy.thanks.title} · ${CAMPAIGN_NAME}`;
  const description = document.querySelector('meta[name="description"]');
  description?.setAttribute("content", copy.thanks.lead);
  const ogTitle = document.querySelector('meta[property="og:title"]');
  ogTitle?.setAttribute("content", document.title);
  const ogDesc = document.querySelector('meta[property="og:description"]');
  ogDesc?.setAttribute("content", copy.thanks.lead);

  document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((el) => {
    const value = deepGet(copy, el.dataset.i18n ?? "");
    if (typeof value === "string") el.textContent = value;
  });
  document.querySelectorAll<HTMLElement>("[data-i18n-aria]").forEach((el) => {
    const value = deepGet(copy, el.dataset.i18nAria ?? "");
    if (typeof value === "string") el.setAttribute("aria-label", value);
  });
  document.querySelectorAll<HTMLElement>("[data-i18n-list]").forEach((el) => {
    const value = deepGet(copy, el.dataset.i18nList ?? "");
    if (!Array.isArray(value)) return;
    el.replaceChildren(
      ...value.map((paragraph) => {
        const p = document.createElement("p");
        p.textContent = String(paragraph);
        return p;
      }),
    );
  });
}

const state = {
  lang: readLang(),
  campaign: null as Campaign | null,
  copies: null as Record<Lang, Copy> | null,
};

function currentCopy(): Copy {
  return state.copies?.[state.lang] ?? copyFor(state.lang);
}

function renderThanks(): void {
  const copy = currentCopy();
  const campaign = state.campaign;
  const primaryEl = document.querySelector("#collected-primary");
  const localEl = document.querySelector("#collected-local");
  const localFigure = document.querySelector("#thanks-local");
  const gallery = document.querySelector("#thanks-gallery");
  if (!campaign || !primaryEl || !gallery) return;

  primaryEl.textContent = formatMoney(campaign.collected, DONATION_CURRENCY, state.lang);

  if (localEl && localFigure) {
    if (LOCAL_CURRENCY) {
      localFigure.removeAttribute("hidden");
      localEl.textContent = formatMoney(campaign.amountLocal, LOCAL_CURRENCY, state.lang);
    } else {
      localFigure.setAttribute("hidden", "");
    }
  }

  const proofs = donationsWithImages(campaign.donations);
  if (proofs.length === 0) {
    gallery.replaceChildren();
    return;
  }

  gallery.replaceChildren(
    ...proofs.map((row) => {
      const li = document.createElement("li");
      const figure = document.createElement("figure");
      const captionText = captionFor(row.caption, state.lang);
      const img = document.createElement("img");
      img.src = row.image!;
      img.alt = captionText || copy.thanks.proofsTitle;
      img.decoding = "async";
      img.loading = "lazy";
      figure.append(wrapZoomable(img, row.image!, copy));
      if (captionText) {
        const cap = document.createElement("figcaption");
        cap.textContent = captionText;
        figure.append(cap);
      }
      li.append(figure);
      return li;
    }),
  );
}

function applyLang(lang: Lang): void {
  state.lang = lang;
  document.documentElement.lang =
    lang === "de" ? "de-DE" : lang === "en" ? "en-US" : lang === "pt" ? "pt-BR" : "es-ES";
  setLang(lang);
  const copy = currentCopy();
  applyCopy(copy);
  document.querySelectorAll(".langs a").forEach((link) => {
    link.setAttribute("aria-current", link.getAttribute("data-lang") === lang ? "page" : "false");
  });
  const skip = document.querySelector(".skip");
  if (skip) skip.textContent = copy.nav.skip;
  const cta = document.querySelector(".thanks-cta");
  if (cta instanceof HTMLAnchorElement) {
    const url = new URL(cta.href, window.location.origin);
    url.searchParams.set("lang", lang);
    cta.href = `${url.pathname}${url.search}`;
  }
  renderThanks();
  enhanceImages(copy);
}

function setupLangNav(): void {
  document.querySelectorAll(".langs a").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const lang = link.getAttribute("data-lang");
      if (isLang(lang)) applyLang(lang);
    });
  });
}

async function boot(): Promise<void> {
  setupLangNav();
  setupLightbox(() => currentCopy());
  const [loaded, copies] = await Promise.all([loadCampaign(), loadAllCopies()]);
  state.campaign = loaded.campaign;
  state.copies = copies;
  applyLang(state.lang);
}

void boot();
