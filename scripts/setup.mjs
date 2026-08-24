#!/usr/bin/env node
/**
 * First-run helper for clones: copy .env.example, fetch PocketBase binary,
 * print the next steps. Does not start servers or seed (needs your password).
 */
import { copyFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

const root = resolve(import.meta.dirname, "..");
const envPath = resolve(root, ".env");
const examplePath = resolve(root, ".env.example");

if (!existsSync(envPath)) {
  copyFileSync(examplePath, envPath);
  console.log("Created .env from .env.example — edit payee / Impressum / campaign name.");
} else {
  console.log(".env already exists — left unchanged.");
}

const fetch = spawnSync(process.execPath, [resolve(root, "scripts/fetch-pocketbase.mjs")], {
  cwd: root,
  stdio: "inherit",
});
if (fetch.status !== 0) {
  process.exit(fetch.status ?? 1);
}

console.log(`
Next steps:
  1. Edit .env (PAYEE_*, OPERATOR_*, CAMPAIGN_*, PayPal / Wise).
  2. Start PocketBase:
       ./pocketbase/bin/pocketbase serve --http=127.0.0.1:5789 --dir=./pb_data --automigrate=false
  3. Create a superuser (other terminal):
       ./pocketbase/bin/pocketbase superuser upsert you@example.test 'your-password' --dir=./pb_data
  4. Seed demo copy + donations:
       npm run seed:pb:copy
       PB_ADMIN_EMAIL=you@example.test PB_ADMIN_PASSWORD='your-password' npm run seed:pb
  5. Run the app:
       npm run dev
`);
