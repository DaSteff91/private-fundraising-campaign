# PocketBase schema (private-fundraising-campaign)

Local admin UI: http://127.0.0.1:5789/_/

Create the superuser on first visit (or via `superuser upsert`). Disable public user
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
| `amountPesos` | number | Optional local-currency total (>= 0); shown on the thank-you page |

## `donations` (base, many)

| Field | Type | Notes |
| --- | --- | --- |
| `date` | text | ISO date `YYYY-MM-DD` |
| `amountEur` | number | >= 0 (not required — PocketBase treats `0` as blank when required) |
| `image` | file | optional proof crop (also used for thank-you gallery when `amountEur` is 0) |
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
# Local (PocketBase binary already fetched via npm run setup / pb:fetch)
npm run pb:migrate
./pocketbase/bin/pocketbase serve --http=127.0.0.1:5789 --dir=./pb_data --migrationsDir=./pocketbase/pb_migrations --automigrate=false
npm run seed:pb:copy   # writes pocketbase/copy-seed.json from src/i18n
PB_ADMIN_EMAIL=… PB_ADMIN_PASSWORD=… npm run seed:pb
```

Or with Docker (migrations run on container start):

```bash
docker compose up -d pocketbase
npm run seed:pb:copy
PB_ADMIN_EMAIL=… PB_ADMIN_PASSWORD=… npm run seed:pb
```

`seed:pb` only upserts data (settings, donations from `live/campaign.json`, translations).
It does **not** create or patch collections.

### Existing local `pb_data`

If you already created collections via the old seed script, the init migration may fail
with “already exists”. Stop PocketBase, delete `./pb_data`, then serve / `npm run pb:migrate`
again (demo data can be re-seeded).

### Admin: local currency + proof photos without re-seed

1. **settings** → set `amountPesos` and `phase` (e.g. `closed`).
2. **donations** → add a row with `amountEur` 0, upload `image`, fill captions — these appear on the thank-you gallery and under campaign `#stand`.
3. Browser loads files from `/api/files/...` (same-origin proxy in production).
