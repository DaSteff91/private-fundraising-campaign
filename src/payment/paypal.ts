// SPDX-License-Identifier: MIT
/** PayPal.Me outbound URL. No SDK, no CDN — just a link paypal.com hosts. */

import { formatAmount } from "./epc";

const HANDLE = /^[A-Za-z0-9]{1,20}$/;

/** Strip a handle or a pasted paypal.me / paypal.com/paypalme URL to the handle. */
export function paypalMeHandle(raw: string): string {
  let value = raw.trim();
  if (!value) throw new Error("PayPal.Me handle is required");

  value = value.replace(/^https?:\/\//i, "");
  value = value.replace(/^www\./i, "");
  value = value.replace(/^(?:paypal\.me|paypal\.com\/paypalme)\//i, "");
  value = value.replace(/^@/, "");
  value = value.split(/[/?#]/)[0] ?? "";

  if (!HANDLE.test(value)) {
    throw new Error("Invalid PayPal.Me handle");
  }
  return value;
}

export function paypalMeBaseUrl(handleOrUrl: string): string {
  return `https://www.paypal.com/paypalme/${paypalMeHandle(handleOrUrl)}`;
}

export function paypalMeUrl(handleOrUrl: string, amountEur: number): string {
  return `${paypalMeBaseUrl(handleOrUrl)}/${formatAmount(amountEur)}EUR`;
}
