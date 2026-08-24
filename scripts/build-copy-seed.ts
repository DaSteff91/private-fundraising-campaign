/**
 * Dump bundled i18n Copy objects to pocketbase/copy-seed.json for the PB seed script.
 * Run: npx vite-node scripts/build-copy-seed.ts
 */
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { de } from "../src/i18n/de";
import { en } from "../src/i18n/en";
import { es } from "../src/i18n/es";
import { pt } from "../src/i18n/pt";

const out = resolve(import.meta.dirname, "../pocketbase/copy-seed.json");
writeFileSync(out, `${JSON.stringify({ de, en, pt, es }, null, 2)}\n`);
process.stdout.write(`wrote ${out}\n`);
