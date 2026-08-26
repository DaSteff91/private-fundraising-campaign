#!/usr/bin/env node
/**
 * Create or update a PocketBase superuser (Path A or B).
 * Defaults are for local demo only — change before go-live.
 *
 *   PB_ADMIN_EMAIL / PB_ADMIN_PASSWORD override defaults.
 *
 * If Docker Compose service `pfc-cms` is running, uses docker exec.
 * Otherwise uses the local binary from npm run pb:fetch / setup.
 */
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { pocketBaseBin } from "./pb-bin.mjs";

const root = resolve(import.meta.dirname, "..");
const email = process.env.PB_ADMIN_EMAIL?.trim() || "demo@example.test";
const password = process.env.PB_ADMIN_PASSWORD?.trim() || "demopassword-change-me";

function dockerCmsRunning() {
  const ps = spawnSync(
    "docker",
    ["inspect", "-f", "{{.State.Running}}", "pfc-cms"],
    { cwd: root, encoding: "utf8" },
  );
  return ps.status === 0 && String(ps.stdout).trim() === "true";
}

let result;
if (dockerCmsRunning()) {
  result = spawnSync(
    "docker",
    [
      "exec",
      "pfc-cms",
      "/pb/pocketbase",
      "superuser",
      "upsert",
      email,
      password,
      "--dir=/pb/pb_data",
    ],
    { cwd: root, stdio: "inherit" },
  );
} else {
  let bin;
  try {
    bin = pocketBaseBin();
  } catch (err) {
    console.error(String(err.message || err));
    console.error("Or start Docker Path A (npm run demo:docker), then re-run this command.");
    process.exit(1);
  }
  result = spawnSync(
    bin,
    ["superuser", "upsert", email, password, `--dir=${resolve(root, "pb_data")}`],
    { cwd: root, stdio: "inherit" },
  );
}

if (result.status === 0) {
  console.log(`superuser ready: ${email}`);
}
process.exit(result.status ?? 1);
