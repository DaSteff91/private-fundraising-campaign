# PocketBase schema (private-fundraising-campaign)

Local admin UI: http://127.0.0.1:5789/_/

Create the superuser on first visit (or set `PB_ADMIN_EMAIL` / `PB_ADMIN_PASSWORD` on the
`pocketbase` service). Disable public user registration in Settings.

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

## Seed

```bash
docker compose up -d pocketbase
npm run seed:pb:copy   # writes pocketbase/copy-seed.json from src/i18n
PB_ADMIN_EMAIL=… PB_ADMIN_PASSWORD=… npm run seed:pb
```

`seed:pb` upserts settings (including `amountPesos`), donations (from `live/campaign.json`, with optional image uploads), and translations. Existing collections get missing fields patched in (e.g. `amountPesos`).

### Admin: local currency + proof photos without re-seed

1. **settings** → set `amountPesos` and `phase` (e.g. `closed`).
2. **donations** → add a row with `amountEur` 0, upload `image`, fill captions — these appear on the thank-you gallery and under campaign `#stand`.
3. Browser loads files from `/api/files/...` (same-origin proxy in production).
