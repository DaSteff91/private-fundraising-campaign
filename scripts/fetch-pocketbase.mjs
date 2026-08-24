#!/usr/bin/env node
/**
 * Download the PocketBase linux_amd64 binary into pocketbase/bin/ for Docker builds
 * and optional host runs. Not committed to git.
 */
import { chmodSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";

const PB_VERSION = process.env.PB_VERSION || "0.40.1";
const root = resolve(import.meta.dirname, "..");
const binDir = resolve(root, "pocketbase/bin");
const zipUrl = `https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip`;
const zipPath = resolve(binDir, "pocketbase.zip");
const outPath = resolve(binDir, "pocketbase");

mkdirSync(binDir, { recursive: true });

if (existsSync(outPath) && !process.env.PB_FORCE) {
  console.log(`already have ${outPath} (set PB_FORCE=1 to re-download)`);
  process.exit(0);
}

console.log(`downloading ${zipUrl}`);
const res = await fetch(zipUrl);
if (!res.ok) throw new Error(`download failed: ${res.status}`);
writeFileSync(zipPath, Buffer.from(await res.arrayBuffer()));
execFileSync("unzip", ["-o", zipPath, "pocketbase", "-d", binDir], { stdio: "inherit" });
chmodSync(outPath, 0o755);
console.log(`wrote ${outPath}`);
