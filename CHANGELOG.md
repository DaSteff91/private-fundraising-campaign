# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Equal first-run paths: Docker (`npm run demo:docker`) and local (`pb:migrate` / `pb:serve` / `pb:superuser` / `demo:seed`).
- [AGENTS.md](AGENTS.md) for coding agents (env, CMS, currency invariants).
- `DONATION_CURRENCY` and optional `LOCAL_CURRENCY` (ISO 4217); GiroCode/bank QR only when donation currency is EUR.
- Multi-arch `pb:fetch` (linux/darwin/windows amd64+arm64 where available).
- PocketBase binary downloaded inside the CMS Docker image (no host `pb:fetch` required for Compose).
- Short README deploy section (TLS reverse proxy + admin localhost).
- GitHub Actions CI workflow: `npm test` and `npm run build` on pushes and pull requests to `main`.
- Checked-in PocketBase JS migrations for `settings`, `donations`, and `translations` (`npm run pb:migrate`; Docker applies on start).

### Changed

- Schema fields `donations.amountEur` → `amount`, `settings.amountPesos` → `amountLocal` (delete `./pb_data` and re-migrate if upgrading an old local DB).
- Thank-you copy keys `eurLabel` / `copLabel` → `collectedLabel` / `localLabel`.
- `seed:pb` upserts campaign data only; schema is no longer created or patched by the seed script.
- README restructured for short Path A / Path B steps.

## [0.1.0] - 2026-08-25

### Added

- Initial public template: multilingual fundraising landing page with SEPA GiroCode, PayPal.Me, and Wise.
- PocketBase CMS seed for campaign settings, donations, and translations.
- Local setup scripts, Vite build, static `server.mjs` with `/api` proxy, and Docker Compose stack.
- MIT-licensed fictional demo content (“Sam’s Workshop”).
