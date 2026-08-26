#!/usr/bin/env node
/**
 * Resolve the local PocketBase binary path (Path B).
 */
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const unix = resolve(root, "pocketbase/bin/pocketbase");
const win = resolve(root, "pocketbase/bin/pocketbase.exe");

export function pocketBaseBin() {
  if (existsSync(unix)) return unix;
  if (existsSync(win)) return win;
  throw new Error("PocketBase binary missing — run npm run setup or npm run pb:fetch");
}
