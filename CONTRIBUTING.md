# Contributing

Thanks for helping improve this template. By participating, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Prerequisites

- Node.js ≥ 20
- Follow the README **Quick start** for `npm install`, `npm run setup`, local PocketBase, and seeding

Do not duplicate campaign-specific payee or operator values into the repo. Never commit `.env`.

## Development loop

```bash
npm test
npm run build   # needs a local .env; CI copies .env.example
npm run dev
```

PRs targeting `main` should keep CI green (`npm test` and `npm run build`).

## What belongs in a PR vs a fork

| In this repo (PRs welcome) | Keep in your fork / deployment |
| --- | --- |
| Template code, scripts, docs | Real `.env` / payee / Impressum |
| Shared demo / placeholder content | Your campaign media and live seed data |
| Bug fixes and features for all adopters | Operator-only deploy config |

Never commit real bank details, PayPal/Wise credentials, or uncropped proof photos that show names, IBANs, or other PII.

## Pull requests

1. Describe the change and why it helps the template.
2. Call out breaking env, schema, or PocketBase pin changes in the PR description.
3. For notable user-facing or contract changes, add a bullet under `[Unreleased]` in [CHANGELOG.md](CHANGELOG.md).
4. Leave version bumps and git tags to maintainers — see README **Versioning & releases**.

## Security

Report vulnerabilities privately — see [SECURITY.md](SECURITY.md). Do not open a public issue for security reports.
