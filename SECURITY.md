# Security

This template intentionally publishes payee details (IBAN, name) and public-read CMS
data. Harden the *host*, not the story.

## Before go-live

- [ ] Use a real `.env`; never commit it. Rebuild after payee, Impressum, currency, or campaign env changes (`npm run build` bakes them into `dist/`).
- [ ] Set `DONATION_CURRENCY` / optional `LOCAL_CURRENCY` (ISO 4217). Do not rely on demo admin passwords in production.
- [ ] Production build: leave `POCKETBASE_URL` empty; set `SITE_URL=https://…`.
- [ ] Put TLS (Caddy / nginx) in front of the app on port `7890`. Do not expose Node or PocketBase raw to the internet.
- [ ] Keep PocketBase admin off the public internet. Compose already binds `127.0.0.1:5789`. For remote admin, use an SSH tunnel or VPN only.
- [ ] Superuser: strong unique password (not the README demo credentials). In PocketBase Settings, disable public user registration.
- [ ] Confirm collection rules: list/view public; create/update/delete admin-only.
- [ ] Back up `pb_data/` regularly (Compose mounts `./pb_data`).
- [ ] Proof photos: crop to amount + date only; strip EXIF before upload (`exiftool -all=` — see README).

## Threat model (short)

- **Public by design:** IBAN / payee name, donations, proof files, campaign copy.
- **Must protect:** admin UI, writes, `pb_data/`, `.env`, and the machine that runs `npm run build`.
- The app proxy allows GET/HEAD only to PocketBase. That is not enough on its own — keep the admin UI off the WAN.

## Reporting a vulnerability

Please **do not** open a public GitHub issue for security reports.

Prefer [GitHub private vulnerability reporting](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing-information-about-vulnerabilities/privately-reporting-a-security-vulnerability) on this repository (Security → Report a vulnerability), or open a private advisory if that flow is available.

We will acknowledge reports and work on a fix before any public disclosure.

### In scope

Examples of issues worth reporting:

- Cross-site scripting (XSS) or other client-side injection in the campaign UI
- Server-side request forgery or unsafe proxy behavior in `server.mjs`
- Accidental leakage of secrets or sensitive payee data through build output or the public repo

### Out of scope / intentional

- PocketBase collections that are **public-read by design** for this template
- Fictional MIT demo content (“Sam’s Workshop”) and placeholder `.env.example` values
