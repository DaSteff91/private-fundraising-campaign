#!/usr/bin/env node
/**
 * Download a PocketBase binary into pocketbase/bin/ for local Path B runs.
 * Docker Path A downloads PocketBase inside the image instead.
 *
 * Override: PB_VERSION, PB_FORCE=1, PB_TARGET=linux_amd64|linux_arm64|darwin_amd64|darwin_arm64|windows_amd64
 */
import { chmodSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";

const PB_VERSION = process.env.PB_VERSION || "0.40.1";
const root = resolve(import.meta.dirname, "..");
const binDir = resolve(root, "pocketbase/bin");

const TARGETS = new Set([
  "linux_amd64",
  "linux_arm64",
  "darwin_amd64",
  "darwin_arm64",
  "windows_amd64",
]);

function detectTarget() {
  if (process.env.PB_TARGET) {
    const forced = process.env.PB_TARGET.trim();
    if (!TARGETS.has(forced)) {
      throw new Error(`Unsupported PB_TARGET=${forced}. Use one of: ${[...TARGETS].join(", ")}`);
    }
    return forced;
  }
  const platform = process.platform;
  const arch = process.arch;
  if (platform === "linux" && arch === "x64") return "linux_amd64";
  if (platform === "linux" && arch === "arm64") return "linux_arm64";
  if (platform === "darwin" && arch === "x64") return "darwin_amd64";
  if (platform === "darwin" && arch === "arm64") return "darwin_arm64";
  if (platform === "win32" && arch === "x64") return "windows_amd64";
  throw new Error(
    `No PocketBase build for ${platform}/${arch}. Set PB_TARGET=… or use Path A (Docker).`,
  );
}

const target = detectTarget();
const isWindows = target.startsWith("windows_");
const binaryName = isWindows ? "pocketbase.exe" : "pocketbase";
const zipUrl = `https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_${target}.zip`;
const zipPath = resolve(binDir, "pocketbase.zip");
const outPath = resolve(binDir, binaryName);

mkdirSync(binDir, { recursive: true });

if (existsSync(outPath) && !process.env.PB_FORCE) {
  console.log(`already have ${outPath} (set PB_FORCE=1 to re-download)`);
  process.exit(0);
}

console.log(`downloading ${zipUrl}`);
const res = await fetch(zipUrl);
if (!res.ok) throw new Error(`download failed: ${res.status}`);
writeFileSync(zipPath, Buffer.from(await res.arrayBuffer()));
execFileSync("unzip", ["-o", zipPath, binaryName, "-d", binDir], { stdio: "inherit" });
if (!isWindows) chmodSync(outPath, 0o755);
console.log(`wrote ${outPath} (${target})`);
