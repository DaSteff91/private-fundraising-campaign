// SPDX-License-Identifier: MIT
import {
  AMOUNT_PRESETS,
  CAMPAIGN_REMITTANCE,
  DONATION_CURRENCY,
  GIROCODE_AVAILABLE,
  PAYEE,
  PAYPAL_ME_HANDLE,
  WISE_REQUEST_URL,
} from "./config";
import { copyFor, isLang, type Copy, type Lang } from "./i18n";
import { loadAllCopies } from "./i18n/loadCopy";
import { captionFor, loadCampaign, type Campaign } from "./live";
import { renderGallery } from "./gallery";
import { enhanceImages, setupLightbox, wrapZoomable } from "./lightbox";
import { formatMoney, formatPresetLabel } from "./money";
import { buildEpcPayload, formatAmount } from "./payment/epc";
import { paypalMeUrl } from "./payment/paypal";
import { girocodeSvg } from "./payment/qr";

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
  document.title = copy.meta.title;
  const description = document.querySelector('meta[name="description"]');
  description?.setAttribute("content", copy.meta.description);
  const ogTitle = document.querySelector('meta[property="og:title"]');
  ogTitle?.setAttribute("content", copy.meta.title);
  const ogDesc = document.querySelector('meta[property="og:description"]');
  ogDesc?.setAttribute("content", copy.meta.description);

  document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((el) => {
    const value = deepGet(copy, el.dataset.i18n ?? "");
    if (typeof value === "string") el.textContent = value;
  });
  document.querySelectorAll<HTMLElement>("[data-i18n-aria]").forEach((el) => {
    if (el.classList.contains("is-copied")) return;
    const value = deepGet(copy, el.dataset.i18nAria ?? "");
    if (typeof value === "string") el.setAttribute("aria-label", value);
  });
  document.querySelectorAll<HTMLImageElement>("[data-i18n-alt]").forEach((el) => {
    const value = deepGet(copy, el.dataset.i18nAlt ?? "");
    if (typeof value === "string") el.alt = value;
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
  document.querySelectorAll<HTMLElement>("[data-i18n-items]").forEach((el) => {
    const value = deepGet(copy, el.dataset.i18nItems ?? "");
    if (!Array.isArray(value)) return;
    el.replaceChildren(
      ...value.map((item) => {
        const li = document.createElement("li");
        li.textContent = String(item);
        return li;
      }),
    );
  });
}

function formatDonation(amount: number, lang: Lang): string {
  return formatMoney(amount, DONATION_CURRENCY, lang);
}

function formatIban(iban: string): string {
  return iban.replace(/(.{4})/g, "$1 ").trim();
}

function formatDay(iso: string, lang: Lang): string {
  const date = new Date(`${iso}T00:00:00`);
  return new Intl.DateTimeFormat(
    lang === "de" ? "de-DE" : lang === "pt" ? "pt-BR" : lang === "es" ? "es-ES" : "en-US",
    { dateStyle: "medium" },
  ).format(date);
}

function collectionOpen(campaign: Campaign): boolean {
  if (campaign.phase !== "collecting") return false;
  const today = new Date().toISOString().slice(0, 10);
  return today <= campaign.closeDate;
}

function parseAmount(raw: string): number | null {
  const normalized = raw.replace(",", ".").trim();
  const value = Number(normalized);
  if (!Number.isFinite(value) || value < 0.01) return null;
  return Math.round(value * 100) / 100;
}

async function copyText(value: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    const area = document.createElement("textarea");
    area.value = value;
    document.body.append(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  }
}

function renderQr(amount: number): void {
  const host = document.querySelector("#qr");
  if (!(host instanceof HTMLElement)) return;
  if (!GIROCODE_AVAILABLE) {
    host.replaceChildren();
    return;
  }
  try {
    const payload = buildEpcPayload({
      bic: PAYEE.bic,
      name: PAYEE.name,
      iban: PAYEE.iban,
      amountEur: amount,
      remittance: CAMPAIGN_REMITTANCE,
    });
    host.innerHTML = girocodeSvg(payload);
  } catch {
    host.replaceChildren();
  }
}

const state = {
  lang: readLang(),
  amount: 1,
  method: "paypal" as "paypal" | "bank" | "wise",
  campaign: null as Campaign | null,
  live: false,
  copies: null as Record<Lang, Copy> | null,
};

const flashTimers = new WeakMap<HTMLButtonElement, number>();

function restoreCopyLabel(button: HTMLButtonElement): void {
  const value = deepGet(currentCopy(), button.dataset.i18nAria ?? "");
  if (typeof value === "string") button.setAttribute("aria-label", value);
}

function flash(button: HTMLButtonElement, label: string): void {
  const previous = flashTimers.get(button);
  if (previous !== undefined) window.clearTimeout(previous);
  button.classList.add("is-copied");
  button.setAttribute("aria-label", label);
  const id = window.setTimeout(() => {
    button.classList.remove("is-copied");
    restoreCopyLabel(button);
    flashTimers.delete(button);
  }, 1400);
  flashTimers.set(button, id);
}

function currentCopy(): Copy {
  return state.copies?.[state.lang] ?? copyFor(state.lang);
}

function syncAmountUi(): void {
  document.querySelectorAll<HTMLButtonElement>("#amount-presets button").forEach((btn) => {
    const value = Number(btn.dataset.amount);
    btn.setAttribute("aria-pressed", String(value === state.amount));
  });
  const amountEl = document.querySelector("#field-amount");
  if (amountEl) amountEl.textContent = formatDonation(state.amount, state.lang);
  renderQr(state.amount);
  const paypal = document.querySelector(".paypal-btn");
  if (paypal instanceof HTMLAnchorElement) {
    paypal.href = paypalMeUrl(PAYPAL_ME_HANDLE, state.amount, DONATION_CURRENCY);
  }
  const custom = document.querySelector("#amount-custom");
  if (custom instanceof HTMLInputElement && Number(custom.value) !== state.amount) {
    if (!AMOUNT_PRESETS.includes(state.amount as (typeof AMOUNT_PRESETS)[number])) {
      custom.value = String(state.amount);
    }
  }
}

function renderProgress(): void {
  const copy = currentCopy();
  const campaign = state.campaign;
  const collected = document.querySelector("#collected");
  const phase = document.querySelector("#phase");
  const updated = document.querySelector("#updated");
  const list = document.querySelector("#updates");
  if (!campaign || !collected || !phase || !updated || !list) return;

  collected.textContent = formatDonation(campaign.collected, state.lang);
  phase.textContent = copy.progress.phases[campaign.phase];
  updated.textContent = state.live
    ? `${copy.progress.updated}: ${formatDay(campaign.updatedAt, state.lang)}`
    : copy.progress.unknown;

  const items = campaign.donations.filter((row) => row.amount > 0 || Boolean(row.image));
  if (items.length === 0) {
    const empty = document.createElement("li");
    empty.textContent = copy.progress.empty;
    list.replaceChildren(empty);
  } else {
    list.replaceChildren(
      ...items.map((row) => {
        const li = document.createElement("li");
        const figure = document.createElement("figure");
        const captionText = captionFor(row.caption, state.lang);
        const amount = formatDonation(row.amount, state.lang);
        const day = formatDay(row.date, state.lang);
        if (row.image) {
          const img = document.createElement("img");
          img.src = row.image;
          img.alt = captionText || (row.amount > 0 ? `${amount}, ${day}` : day);
          figure.append(wrapZoomable(img, row.image, copy));
        } else {
          figure.classList.add("is-text-only");
        }
        const cap = document.createElement("figcaption");
        if (row.amount > 0) {
          cap.textContent = captionText
            ? `${day} — ${amount} · ${captionText}`
            : `${day} — ${amount}`;
        } else {
          cap.textContent = captionText ? `${day} — ${captionText}` : day;
        }
        figure.append(cap);
        li.append(figure);
        return li;
      }),
    );
  }

  const open = collectionOpen(campaign);
  document.querySelector("#pay-open")?.toggleAttribute("hidden", !open);
  document.querySelector("#pay-closed")?.toggleAttribute("hidden", open);
  document.querySelector(".hero-donate")?.toggleAttribute("hidden", !open);
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
  const backHome = document.querySelector(".back-home a");
  if (backHome instanceof HTMLAnchorElement) {
    const url = new URL(backHome.href, window.location.origin);
    url.searchParams.set("lang", lang);
    backHome.href = `${url.pathname}${url.search}`;
  }
  syncAmountUi();
  renderProgress();
  renderGallery(copy);
  enhanceImages(copy);
}

function setupAmounts(): void {
  const row = document.querySelector("#amount-presets");
  if (!(row instanceof HTMLElement)) return;
  row.replaceChildren(
    ...AMOUNT_PRESETS.map((value) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.amount = String(value);
      button.textContent = formatPresetLabel(value, DONATION_CURRENCY, state.lang);
      button.addEventListener("click", () => {
        state.amount = value;
        const custom = document.querySelector("#amount-custom");
        if (custom instanceof HTMLInputElement) custom.value = String(value);
        syncAmountUi();
      });
      return button;
    }),
  );
  const custom = document.querySelector("#amount-custom");
  custom?.addEventListener("input", () => {
    if (!(custom instanceof HTMLInputElement)) return;
    const parsed = parseAmount(custom.value);
    if (parsed) {
      state.amount = parsed;
      syncAmountUi();
    }
  });
}

function syncMethodUi(): void {
  const tabs = document.querySelectorAll<HTMLButtonElement>(".method-tab");
  tabs.forEach((tab) => {
    const selected = tab.dataset.method === state.method;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  document.querySelectorAll<HTMLElement>(".method-panel").forEach((panel) => {
    const match = panel.id === `panel-${state.method}`;
    panel.toggleAttribute("hidden", !match);
  });
}

function setupMethods(): void {
  const tabs = [...document.querySelectorAll<HTMLButtonElement>(".method-tab")];
  if (tabs.length === 0) return;

  const bankTab = document.querySelector("#tab-bank");
  const bankPanel = document.querySelector("#panel-bank");
  if (!GIROCODE_AVAILABLE) {
    bankTab?.setAttribute("hidden", "");
    bankPanel?.setAttribute("hidden", "");
    if (state.method === "bank") state.method = "paypal";
  }

  const select = (method: string): void => {
    if (method !== "paypal" && method !== "bank" && method !== "wise") return;
    if (method === "bank" && !GIROCODE_AVAILABLE) return;
    state.method = method;
    syncMethodUi();
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      select(tab.dataset.method ?? "");
    });
    tab.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      event.preventDefault();
      const visible = tabs.filter((t) => !t.hasAttribute("hidden"));
      const current = visible.indexOf(tab);
      if (current < 0) return;
      const delta = event.key === "ArrowRight" ? 1 : -1;
      const next = visible[(current + delta + visible.length) % visible.length];
      next?.focus();
      select(next?.dataset.method ?? "");
    });
  });

  syncMethodUi();
}

function setupCopy(): void {
  document.querySelectorAll<HTMLButtonElement>("button.copy").forEach((button) => {
    button.addEventListener("click", async () => {
      const kind = button.dataset.copy;
      const values: Record<string, string> = {
        name: PAYEE.name,
        iban: PAYEE.iban,
        bic: PAYEE.bic,
        amount: formatAmount(state.amount),
        purpose: CAMPAIGN_REMITTANCE,
      };
      const text = kind ? values[kind] : "";
      if (!text) return;
      const ok = await copyText(text);
      if (ok) flash(button, currentCopy().pay.copied);
    });
  });
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

function paintStaticFields(): void {
  const name = document.querySelector("#field-name");
  const iban = document.querySelector("#field-iban");
  const bic = document.querySelector("#field-bic");
  const purpose = document.querySelector("#field-purpose");
  if (name) name.textContent = PAYEE.name;
  if (iban) iban.textContent = formatIban(PAYEE.iban);
  if (bic) bic.textContent = PAYEE.bic;
  if (purpose) purpose.textContent = CAMPAIGN_REMITTANCE;
  const wise = document.querySelector(".wise-btn");
  if (wise instanceof HTMLAnchorElement) wise.href = WISE_REQUEST_URL;
}

async function boot(): Promise<void> {
  paintStaticFields();
  setupAmounts();
  setupMethods();
  setupCopy();
  setupLangNav();
  setupLightbox(() => currentCopy());
  const [loaded, copies] = await Promise.all([loadCampaign(), loadAllCopies()]);
  state.campaign = loaded.campaign;
  state.live = loaded.live;
  state.copies = copies;
  applyLang(state.lang);
}

void boot();
