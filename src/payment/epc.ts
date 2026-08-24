// SPDX-License-Identifier: MIT
/** EPC069-12 / GiroCode payload. Charset 2 = ISO-8859-1. */

/** Fallback remittance when none is passed (tests / callers). Prefer CAMPAIGN_REMITTANCE from config in the app. */
export const DEFAULT_REMITTANCE = "Sams Workshop";

const NAME_MAX = 70;
const REMITTANCE_MAX = 140;

export type EpcInput = {
  bic: string;
  name: string;
  iban: string;
  amountEur: number;
  remittance?: string;
};

export function formatAmount(amountEur: number): string {
  if (!Number.isFinite(amountEur) || amountEur < 0.01 || amountEur > 999_999_999.99) {
    throw new Error("Amount must be between 0.01 and 999999999.99");
  }
  return amountEur.toFixed(2);
}

export function normalizeIban(iban: string): string {
  return iban.replace(/\s+/g, "").toUpperCase();
}

/** Strip to ISO-8859-1 so charset 2 bank apps do not reject the code. */
export function toIso88591(value: string): string {
  return [...value]
    .map((char) => (char.charCodeAt(0) <= 0xff ? char : "?"))
    .join("");
}

export function buildEpcPayload(input: EpcInput): string {
  const bic = input.bic.trim().toUpperCase();
  const name = toIso88591(input.name.trim()).slice(0, NAME_MAX);
  const iban = normalizeIban(input.iban);
  const remittance = toIso88591(input.remittance ?? DEFAULT_REMITTANCE).slice(
    0,
    REMITTANCE_MAX,
  );

  if (!bic) throw new Error("BIC is required");
  if (!name) throw new Error("Payee name is required");
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/.test(iban)) {
    throw new Error("Invalid IBAN");
  }

  const amount = `EUR${formatAmount(input.amountEur)}`;

  // BCD / version 002 / charset 2 / SCT / BIC / name / IBAN / amount /
  // purpose (empty) / structured ref (empty) / unstructured remittance
  const lines = [
    "BCD",
    "002",
    "2",
    "SCT",
    bic,
    name,
    iban,
    amount,
    "",
    "",
    remittance,
  ];
  return lines.join("\n");
}
