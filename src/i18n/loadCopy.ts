// SPDX-License-Identifier: MIT
import { POCKETBASE_URL } from "../config";
import { copyFor } from "./index";
import { LANGS, type Copy, type Lang } from "./types";

type PbList<T> = { items?: T[] };
type PbTranslation = { lang?: unknown; payload?: unknown };

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Light structural check — full Copy typing stays in TypeScript sources. */
export function isCopyShape(value: unknown): value is Copy {
  if (!isPlainObject(value)) return false;
  if (!isPlainObject(value.meta) || typeof value.meta.title !== "string") return false;
  if (!isPlainObject(value.hero) || typeof value.hero.title !== "string") return false;
  if (!isPlainObject(value.progress) || !isPlainObject(value.progress.phases)) return false;
  if (!isPlainObject(value.timeline) || !Array.isArray(value.timeline.items)) return false;
  if (!isPlainObject(value.thanks) || typeof value.thanks.title !== "string") return false;
  return true;
}

export async function loadCopy(lang: Lang): Promise<Copy> {
  try {
    const base = POCKETBASE_URL.replace(/\/$/, "");
    const filter = encodeURIComponent(`lang="${lang}"`);
    const response = await fetch(
      `${base}/api/collections/translations/records?page=1&perPage=1&filter=${filter}`,
      { cache: "no-store" },
    );
    if (!response.ok) return copyFor(lang);
    const data = (await response.json()) as PbList<PbTranslation>;
    const payload = data.items?.[0]?.payload;
    if (isCopyShape(payload)) return payload;
  } catch {
    /* use fallback */
  }
  return copyFor(lang);
}

export async function loadAllCopies(): Promise<Record<Lang, Copy>> {
  const entries = await Promise.all(
    LANGS.map(async (lang) => [lang, await loadCopy(lang)] as const),
  );
  return Object.fromEntries(entries) as Record<Lang, Copy>;
}
