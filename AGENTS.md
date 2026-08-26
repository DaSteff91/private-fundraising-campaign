# Agent notes — private-fundraising-campaign

This repo is an **open-source template** for a private (non-charity) fundraising landing page. Adopters fork it, put real payee/story data in `.env` and PocketBase, and deploy. The committed demo (“Sam’s Workshop”) is fictional MIT content.

Prefer [README.md](README.md) for human steps. This file is the contract for coding agents.

## Never do

- Commit `.env`, real IBAN/payee data, operator PII meant only for a live campaign, or uncropped proof photos (names, full statements, EXIF).
- Expose PocketBase admin (`/_/`) on the public internet.
- Invent payment-processor SDKs or heavy frameworks; keep the stack lean (Vite + `server.mjs` + PocketBase + `uqr`).

## Paths to a running demo

**Path A — Docker**

```bash
npm install
cp .env.example .env   # or npm run setup
npm run demo:docker    # npm run build + docker compose up --build -d
npm run pb:superuser   # uses docker exec when pfc-cms is up
npm run demo:seed
```

**Path B — Local**

```bash
npm install && npm run setup
npm run pb:migrate
# terminal A: npm run pb:serve
npm run pb:superuser && npm run demo:seed
npm run dev
```

Demo admin (local only): `demo@example.test` / `demopassword-change-me`. Change before go-live.

## Env contract

Baked into `dist/` at `npm run build` / `vite` (see `vite.config.ts`):

| Key | Role |
| --- | --- |
| `PAYEE_*`, `OPERATOR_*`, `CAMPAIGN_NAME`, `CAMPAIGN_REMITTANCE` | Payee + Impressum + labels |
| `DONATION_CURRENCY` | ISO 4217 (default `EUR`) — UI, presets, PayPal.Me suffix |
| `LOCAL_CURRENCY` | Optional ISO 4217; empty → hide thank-you local total |
| `WISE_REQUEST_URL`, `PAYPAL_ME_HANDLE` | Outbound payment links |
| `SITE_URL` | Canonical / OG |
| `POCKETBASE_URL` | Browser API origin. Local: `http://127.0.0.1:5789`. **Production: empty string** → same-origin `/api` |

Runtime only (not baked): `PORT`, `POCKETBASE_UPSTREAM`, `LIVE_DIR`, `HOST`.

## Currencies and GiroCode

- Donation amounts live in PocketBase `donations.amount` (not currency-named).
- Optional forwarded total: `settings.amountLocal`, shown only if `LOCAL_CURRENCY` is set.
- **SEPA GiroCode / EPC069-12 is EUR-only.** Bank QR + bank tab appear only when `DONATION_CURRENCY=EUR`. Do not encode other currencies into the EPC payload.

## CMS / seed order

1. Schema: `npm run pb:migrate` (local) or Docker migrate-on-start.
2. Superuser: `npm run pb:superuser` or admin UI.
3. Data: `npm run demo:seed` (builds `pocketbase/copy-seed.json` from `src/i18n/*`, upserts settings/donations/translations).

Collections (public list/view; admin-only writes): `settings`, `donations`, `translations`. Details: [pocketbase/SCHEMA.md](pocketbase/SCHEMA.md).

Old local DBs with `amountEur` / `amountPesos`: delete `./pb_data` and migrate again.

## Customize vs rebuild

| Change | Action |
| --- | --- |
| Payee, Impressum, currencies, campaign name/remittance | Edit `.env`, then `npm run build` (or `dev`) |
| Story / UI strings | Edit `src/i18n/{de,en,pt,es}.ts`, then re-seed (or edit `translations` in admin) |
| Photos / videos | `public/media/*` + `src/gallery.ts`, rebuild static assets |
| Live donations / phase / local total | PocketBase admin; no rebuild |
| Demo donation seed file | `live/campaign.json` → re-seed |

Pages: `/` campaign, `/thanks` thank-you.

## Fork vs upstream PR

- **PRs here:** template code, scripts, docs, shared demo placeholders.
- **Keep in the fork:** real `.env`, campaign media, live seed data, deploy secrets.

See [CONTRIBUTING.md](CONTRIBUTING.md). Security reports: [SECURITY.md](SECURITY.md) (not public issues).

## Useful scripts

| Script | Purpose |
| --- | --- |
| `npm run setup` | `.env` + host PocketBase binary |
| `npm run demo:docker` | Path A |
| `npm run pb:serve` / `pb:migrate` / `pb:superuser` | Path B CMS |
| `npm run demo:seed` | copy-seed + upsert |
| `npm test` / `npm run build` | CI parity |
