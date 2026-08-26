#!/usr/bin/env node
/**
 * Apply checked-in PocketBase migrations (Path B).
 * Docker Path A runs migrate on container start.
 */
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { pocketBaseBin } from "./pb-bin.mjs";

const root = resolve(import.meta.dirname, "..");
const bin = pocketBaseBin();
const result = spawnSync(
  bin,
  [
    "migrate",
    "up",
    `--dir=${resolve(root, "pb_data")}`,
    `--migrationsDir=${resolve(root, "pocketbase/pb_migrations")}`,
  ],
  { cwd: root, stdio: "inherit" },
);
process.exit(result.status ?? 1);
