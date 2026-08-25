# Private fundraising campaign

Open-source **template** for a private (non-charity) help landing page: SEPA GiroCode, PayPal.Me, Wise, multilingual copy, and a PocketBase CMS for status and donations.

The bundled demo (“Sam’s Workshop”) is fictional placeholder content under MIT. Replace the story, media, and `.env` values with yours.

## Quick start

```bash
git clone <your-fork-or-this-repo>.git
cd private-fundraising-campaign
npm install
npm run setup          # copies .env.example → .env, downloads PocketBase
# edit .env
npm test
```

Then in two terminals:

```bash
./pocketbase/bin/pocketbase serve --http=127.0.0.1:5789 --dir=./pb_data --automigrate=false
./pocketbase/bin/pocketbase superuser upsert you@example.test 'your-password' --dir=./pb_data
npm run seed:pb:copy
PB_ADMIN_EMAIL=you@example.test PB_ADMIN_PASSWORD='your-password' npm run seed:pb
npm run dev            # http://127.0.0.1:7890
```

Admin UI: http://127.0.0.1:5789/_/ — disable public user registration.

Production-shaped static server:

```bash
npm run build
npm start              # http://127.0.0.1:7890
```

Full stack with Docker (after `npm run pb:fetch` and `npm run build`):

```bash
docker compose up --build
```

## What belongs in `.env`

| Variable | Notes |
| --- | --- |
| `CAMPAIGN_NAME` | Display name (thank-you brand, titles). |
| `CAMPAIGN_REMITTANCE` | SEPA / GiroCode payment reference (ASCII preferred). |
| `PAYEE_NAME` | Must match the account-holder name **exactly** (SEPA Verification of Payee). |
| `PAYEE_IBAN` | Your IBAN, no spaces. |
| `PAYEE_BIC` | Your bank BIC. |
| `WISE_REQUEST_URL` | Reusable Wise “from anyone” / Wisetag link, **no fixed amount**. |
| `PAYPAL_ME_HANDLE` | Personal PayPal.Me handle (or a pasted `paypal.me/…` URL). |
| `OPERATOR_*` | Impressum / legal operator details. |
| `SITE_URL` | Public URL. Locally `http://127.0.0.1:7890`. |
| `POCKETBASE_URL` | Browser API origin. Local: `http://127.0.0.1:5789`. **Production: leave empty** so the page calls `/api` on the same host; `server.mjs` proxies to PocketBase. |

Runtime (not baked; Docker/env on the server):

| Variable | Notes |
| --- | --- |
| `POCKETBASE_UPSTREAM` | Where `server.mjs` proxies `/api`. Default `http://127.0.0.1:5789`. In Compose: `http://pfc-cms:8090`. |

Never commit `.env`. `npm run build` bakes payee, Impressum, campaign name/remittance, and `POCKETBASE_URL` into `dist/`.

## Update content without a rebuild

Use PocketBase admin:

- **settings** — `phase`, `closeDate`, `updatedAt`, `amountPesos`
- **donations** — one row per payment; optional proof image + captions
- **translations** — `lang` + JSON `payload` (full copy object)

Phases: `collecting` → `funds_sent` → `funds_delivered` → `closed`.

Screenshot rule for proofs: crop to **amount + date**. No names, no IBAN, no other bookings. Strip EXIF before uploading real photos:

```bash
exiftool -all= -overwrite_original path/to/photo.webp
```

Re-seed from the repo:

```bash
npm run seed:pb:copy
PB_ADMIN_EMAIL=… PB_ADMIN_PASSWORD=… npm run seed:pb
```

`live/campaign.json` is only an input for the seed script.

## Customize for your campaign

1. Edit `.env` (payee, operator, `CAMPAIGN_NAME`, `CAMPAIGN_REMITTANCE`).
2. Rewrite copy in `src/i18n/{de,en,pt,es}.ts`, then `npm run seed:pb:copy`.
3. Replace `public/media/*` and update `src/gallery.ts`.
4. Adjust demo donations in `live/campaign.json`.

Pages: `/` is the campaign; `/thanks` is the thank-you page.

## Implementation notes

- **GiroCode / EPC069-12:** version `002`, charset `2` (ISO-8859-1), BIC included, remittance from `CAMPAIGN_REMITTANCE`. QR error correction **M** via `uqr`.
- **VoP:** Banks may check name vs IBAN. Wrong `PAYEE_NAME` does not stop the transfer but scares donors.
- **PayPal.Me:** outbound link only, no JS SDK. Prefer friends-and-family in EUR from balance or linked bank on a personal account.
- **Languages:** DE / EN / PT / ES. Footer keeps **Impressum** and **Datenschutz** as two links.

## Versioning & releases

Source of truth for the template version is `package.json` `"version"`. Git tags are `v` plus that version (e.g. `v0.1.0`). See [CHANGELOG.md](CHANGELOG.md).

Bump meaning for this template:

- **MAJOR** — breaking for operators/forks (env vars removed or renamed, seed/schema contract, required PocketBase major, incompatible build/runtime).
- **MINOR** — backward-compatible features.
- **PATCH** — fixes, docs, or chore with no contract break.

Call out PocketBase pin changes (`PB_VERSION` / `scripts/fetch-pocketbase.mjs`) and schema or env changes in the changelog when they matter to adopters.

To cut a release:

1. Bump `version` in `package.json` (and the matching fields in `package-lock.json`).
2. Move items from `[Unreleased]` in `CHANGELOG.md` into a dated `## [X.Y.Z]` section.
3. Commit, then `git tag vX.Y.Z` and `git push && git push --tags`.
4. Pushing the tag runs the release workflow, which creates a GitHub Release from that changelog section (and fails if the tag does not match `package.json`).

## License

- Software and demo content: [MIT](LICENSE)
- Fraunces font: SIL OFL, see [NOTICE](NOTICE)
