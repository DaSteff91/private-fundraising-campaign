#!/usr/bin/env node
/**
 * Path A: production build + docker compose up --build.
 * PocketBase is downloaded inside its image; app image needs dist/.
 */
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");

const build = spawnSync("npm", ["run", "build"], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
});
if (build.status !== 0) process.exit(build.status ?? 1);

const compose = spawnSync("docker", ["compose", "up", "--build", "-d"], {
  cwd: root,
  stdio: "inherit",
});
if (compose.status !== 0) process.exit(compose.status ?? 1);

console.log(`
Stack is up.
  Site:  http://127.0.0.1:7890
  Admin: http://127.0.0.1:5789/_/  (localhost only)

First time — create admin + seed:
  npm run pb:superuser
  npm run demo:seed

Demo admin (change before go-live):
  demo@example.test / demopassword-change-me
`);
