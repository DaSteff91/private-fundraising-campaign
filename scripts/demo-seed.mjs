#!/usr/bin/env node
/**
 * Build copy-seed.json and upsert demo campaign data into PocketBase.
 * Uses demo admin defaults unless PB_ADMIN_EMAIL / PB_ADMIN_PASSWORD are set.
 */
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const env = {
  ...process.env,
  PB_ADMIN_EMAIL: process.env.PB_ADMIN_EMAIL?.trim() || "demo@example.test",
  PB_ADMIN_PASSWORD: process.env.PB_ADMIN_PASSWORD?.trim() || "demopassword-change-me",
};

const copy = spawnSync("npx", ["vite-node", "scripts/build-copy-seed.ts"], {
  cwd: root,
  env,
  stdio: "inherit",
  shell: process.platform === "win32",
});
if (copy.status !== 0) process.exit(copy.status ?? 1);

const seed = spawnSync(process.execPath, [resolve(root, "scripts/seed-pocketbase.mjs")], {
  cwd: root,
  env,
  stdio: "inherit",
});
process.exit(seed.status ?? 1);
