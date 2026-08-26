#!/usr/bin/env node
/**
 * Serve PocketBase locally (Path B).
 * http://127.0.0.1:5789 — admin UI at /_/
 */
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { pocketBaseBin } from "./pb-bin.mjs";

const root = resolve(import.meta.dirname, "..");
const bin = pocketBaseBin();
const result = spawnSync(
  bin,
  [
    "serve",
    "--http=127.0.0.1:5789",
    `--dir=${resolve(root, "pb_data")}`,
    `--migrationsDir=${resolve(root, "pocketbase/pb_migrations")}`,
    "--automigrate=false",
  ],
  { cwd: root, stdio: "inherit" },
);
process.exit(result.status ?? 1);
