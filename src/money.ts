// SPDX-License-Identifier: MIT
import type { Lang } from "./i18n/types";

const ISO4217 = /^[A-Z]{3}$/;

export function localeFor(lang: Lang): string {
  return lang === "de" ? "de-DE" : lang === "pt" ? "pt-BR" : lang === "es" ? "es-ES" : "en-US";
}

/** Normalize and validate an ISO 4217 currency code. */
export function normalizeCurrency(raw: string, fallback = "EUR"): string {
  const code = raw.trim().toUpperCase();
  return ISO4217.test(code) ? code : fallback;
}

/** Empty or invalid → "" (caller hides local total). */
export function optionalCurrency(raw: string): string {
  const code = raw.trim().toUpperCase();
  return ISO4217.test(code) ? code : "";
}

export function formatMoney(amount: number, currency: string, lang: Lang): string {
  const code = normalizeCurrency(currency);
  return new Intl.NumberFormat(localeFor(lang), {
    style: "currency",
    currency: code,
  }).format(amount);
}

/** Compact preset label, e.g. "25 €" or "25 US$". */
export function formatPresetLabel(amount: number, currency: string, lang: Lang): string {
  return formatMoney(amount, currency, lang);
}
