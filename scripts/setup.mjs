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
Next steps (Path B — local):
  1. Edit .env if you are not using the demo placeholders
       (PAYEE_*, OPERATOR_*, CAMPAIGN_*, DONATION_CURRENCY, PayPal / Wise).
  2. npm run pb:migrate
  3. Terminal A: npm run pb:serve
  4. Terminal B:
       npm run pb:superuser
       npm run demo:seed
  5. npm run dev
       → http://127.0.0.1:7890

Or Path A (Docker), after editing .env:
  npm run demo:docker
  then npm run pb:superuser && npm run demo:seed
  → http://127.0.0.1:7890

Demo admin (local try-out only — change before go-live):
  email    demo@example.test
  password demopassword-change-me

Agents: see AGENTS.md
`);
