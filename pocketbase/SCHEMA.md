# PocketBase schema (private-fundraising-campaign)

Local admin UI: http://127.0.0.1:5789/_/

Create the superuser with `npm run pb:superuser` (or via the UI). Disable public user
registration in Settings.

Schema lives in [`pb_migrations/`](pb_migrations/) and is applied with
`npm run pb:migrate` (or automatically when the Docker PocketBase container starts).
`--automigrate=false` keeps admin UI edits from writing new migration files.

API rules for every collection below: **list** and **view** = public (`""`);
**create**, **update**, **delete** = admin only (`null`).

## `settings` (base, one record)

| Field | Type | Notes |
| --- | --- | --- |
| `closeDate` | text | ISO date `YYYY-MM-DD` |
| `phase` | select | `collecting`, `funds_sent`, `funds_delivered`, `closed` |
| `updatedAt` | text | ISO date of last content update |
| `amountLocal` | number | Optional local/forwarded total (>= 0); shown on thank-you when `LOCAL_CURRENCY` is set |

## `donations` (base, many)

| Field | Type | Notes |
| --- | --- | --- |
| `date` | text | ISO date `YYYY-MM-DD` |
| `amount` | number | Donation amount in `DONATION_CURRENCY` (>= 0; not required — PocketBase treats `0` as blank when required) |
| `image` | file | optional proof crop (also used for thank-you gallery when `amount` is 0) |
| `captionDe` | text | optional |
| `captionEn` | text | optional |
| `captionPt` | text | optional |
| `captionEs` | text | optional |

## `translations` (base, four rows)

| Field | Type | Notes |
| --- | --- | --- |
| `lang` | text (unique) | `de`, `en`, `pt`, `es` |
| `payload` | json | full `Copy` object (see `src/i18n/types.ts`) |

## Apply schema + seed

```bash
# Local (PocketBase binary via npm run setup / pb:fetch)
npm run pb:migrate
npm run pb:serve
npm run pb:superuser
npm run demo:seed
```

Or with Docker (migrations run on container start):

```bash
npm run demo:docker
npm run pb:superuser
npm run demo:seed
```

`demo:seed` / `seed:pb` only upserts data (settings, donations from `live/campaign.json`, translations).
It does **not** create or patch collections.

### Existing local `pb_data`

If collections were created with older field names (`amountEur`, `amountPesos`) or the init
migration fails with “already exists”, stop PocketBase, delete `./pb_data`, then migrate /
serve again and re-seed.

### Admin: local currency + proof photos without re-seed

1. Set `.env` `LOCAL_CURRENCY` to an ISO 4217 code and rebuild so the thank-you page shows the figure.
2. **settings** → set `amountLocal` and `phase` (e.g. `closed`).
3. **donations** → add a row with `amount` 0, upload `image`, fill captions — these appear on the thank-you gallery and under campaign `#stand`.
4. Browser loads files from `/api/files/...` (same-origin proxy in production).
