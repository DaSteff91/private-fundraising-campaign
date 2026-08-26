// SPDX-License-Identifier: MIT
import { CLOSE_DATE_ISO, POCKETBASE_URL } from "./config";
import type { CampaignPhase, Lang } from "./i18n/types";

export type LocalizedCaption = { de: string; en: string; pt: string; es: string };

export type Donation = {
  date: string;
  amount: number;
  image?: string;
  caption?: LocalizedCaption;
};

export type Campaign = {
  updatedAt: string;
  collected: number;
  amountLocal: number;
  phase: CampaignPhase;
  closeDate: string;
  donations: Donation[];
};

export const FALLBACK_CAMPAIGN: Campaign = {
  updatedAt: "2026-08-14",
  collected: 0,
  amountLocal: 0,
  phase: "collecting",
  closeDate: CLOSE_DATE_ISO,
  donations: [],
};

const PHASES: CampaignPhase[] = [
  "collecting",
  "funds_sent",
  "funds_delivered",
  "closed",
];

const DATE_ISO = /^\d{4}-\d{2}-\d{2}$/;
const LANGS: Lang[] = ["de", "en", "pt", "es"];

type PbList<T> = { items?: T[] };

type PbSettings = {
  closeDate?: unknown;
  phase?: unknown;
  updatedAt?: unknown;
  amountLocal?: unknown;
};

type PbDonation = {
  id: string;
  collectionId?: string;
  collectionName?: string;
  date?: unknown;
  amount?: unknown;
  image?: unknown;
  captionDe?: unknown;
  captionEn?: unknown;
  captionPt?: unknown;
  captionEs?: unknown;
};

function pocketBaseBase(): string {
  return POCKETBASE_URL.replace(/\/$/, "");
}

function parseCaption(value: unknown): LocalizedCaption | undefined {
  if (typeof value !== "object" || value === null) return undefined;
  const row = value as Record<string, unknown>;
  const caption = {
    de: typeof row.de === "string" ? row.de : "",
    en: typeof row.en === "string" ? row.en : "",
    pt: typeof row.pt === "string" ? row.pt : "",
    es: typeof row.es === "string" ? row.es : "",
  };
  if (!caption.de && !caption.en && !caption.pt && !caption.es) return undefined;
  return caption;
}

export function captionFor(caption: LocalizedCaption | undefined, lang: Lang): string {
  if (!caption) return "";
  return caption[lang] || caption.de || LANGS.map((key) => caption[key]).find(Boolean) || "";
}

export function sumDonations(donations: Donation[]): number {
  return donations.reduce((cents, row) => cents + Math.round(row.amount * 100), 0) / 100;
}

/** Donations that carry a proof/status image (thank-you gallery). */
export function donationsWithImages(donations: Donation[]): Donation[] {
  return donations.filter((row) => Boolean(row.image));
}

function parseAmountLocal(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value) && value >= 0) return value;
  return 0;
}

function parseAmount(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value) && value >= 0) return value;
  // PocketBase may omit 0 when the field is optional / "blank".
  if (value === null || value === undefined || value === "") return 0;
  return null;
}

function parseDonation(value: unknown): Donation | null {
  if (typeof value !== "object" || value === null) return null;
  const row = value as Record<string, unknown>;
  if (typeof row.date !== "string" || !DATE_ISO.test(row.date)) return null;
  const rawAmount = row.amount !== undefined ? row.amount : row.amountEur;
  const amount = parseAmount(rawAmount);
  if (amount === null) return null;

  const donation: Donation = {
    date: row.date,
    amount,
  };

  if (typeof row.image === "string" && row.image.trim()) {
    donation.image = row.image.trim();
  }

  const caption = parseCaption(row.caption);
  if (caption) donation.caption = caption;

  return donation;
}

export function parseCampaign(data: unknown): Campaign | null {
  if (typeof data !== "object" || data === null) return null;
  const row = data as Record<string, unknown>;
  if (typeof row.updatedAt !== "string") return null;
  if (typeof row.phase !== "string" || !PHASES.includes(row.phase as CampaignPhase)) {
    return null;
  }

  const rawList = Array.isArray(row.donations)
    ? row.donations
    : Array.isArray(row.updates)
      ? row.updates
      : null;
  if (!rawList) return null;

  const donations = rawList.map(parseDonation).filter((item): item is Donation => item !== null);
  const closeDate =
    typeof row.closeDate === "string" && DATE_ISO.test(row.closeDate)
      ? row.closeDate
      : CLOSE_DATE_ISO;

  const amountLocalRaw =
    row.amountLocal !== undefined ? row.amountLocal : row.amountPesos;

  return {
    updatedAt: row.updatedAt,
    collected: sumDonations(donations),
    amountLocal: parseAmountLocal(amountLocalRaw),
    phase: row.phase as CampaignPhase,
    closeDate,
    donations,
  };
}

function fileUrl(record: PbDonation, filename: string): string {
  const collection = record.collectionId || record.collectionName || "donations";
  return `${pocketBaseBase()}/api/files/${collection}/${record.id}/${encodeURIComponent(filename)}`;
}

function mapPbDonation(row: PbDonation): Donation | null {
  const caption = parseCaption({
    de: row.captionDe,
    en: row.captionEn,
    pt: row.captionPt,
    es: row.captionEs,
  });
  const imageName =
    typeof row.image === "string" && row.image
      ? row.image
      : Array.isArray(row.image) && typeof row.image[0] === "string"
        ? row.image[0]
        : "";

  return parseDonation({
    date: row.date,
    amount: row.amount,
    image: imageName ? fileUrl(row, imageName) : undefined,
    caption,
  });
}

function mapPbSettings(row: PbSettings | undefined, donations: Donation[]): Campaign | null {
  if (!row) return null;
  return parseCampaign({
    updatedAt: row.updatedAt,
    phase: row.phase,
    closeDate: row.closeDate,
    amountLocal: row.amountLocal,
    donations,
  });
}

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${pocketBaseBase()}${path}`, { cache: "no-store" });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function loadCampaign(): Promise<{ campaign: Campaign; live: boolean }> {
  const [settingsRes, donationsRes] = await Promise.all([
    fetchJson<PbList<PbSettings>>("/api/collections/settings/records?perPage=1"),
    fetchJson<PbList<PbDonation>>(
      "/api/collections/donations/records?perPage=200&sort=date",
    ),
  ]);

  if (!settingsRes || !donationsRes) {
    return { campaign: FALLBACK_CAMPAIGN, live: false };
  }

  const donations = (donationsRes.items || [])
    .map(mapPbDonation)
    .filter((item): item is Donation => item !== null);

  const campaign = mapPbSettings(settingsRes.items?.[0], donations);
  if (!campaign) return { campaign: FALLBACK_CAMPAIGN, live: false };
  return { campaign, live: true };
}
