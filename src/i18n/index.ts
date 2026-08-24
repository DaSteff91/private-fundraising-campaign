import { de } from "./de";
import { en } from "./en";
import { es } from "./es";
import { pt } from "./pt";
import { LANGS, type Copy, type Lang } from "./types";

export type { Copy, Lang } from "./types";
export { LANGS };

const copies: Record<Lang, Copy> = { de, en, pt, es };

export function isLang(value: string | null | undefined): value is Lang {
  return value !== null && value !== undefined && (LANGS as readonly string[]).includes(value);
}

export function copyFor(lang: Lang): Copy {
  return copies[lang];
}
