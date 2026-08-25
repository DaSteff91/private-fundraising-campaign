# Security

## Reporting a vulnerability

Please **do not** open a public GitHub issue for security reports.

Prefer [GitHub private vulnerability reporting](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing-information-about-vulnerabilities/privately-reporting-a-security-vulnerability) on this repository (Security → Report a vulnerability), or open a private advisory if that flow is available.

We will acknowledge reports and work on a fix before any public disclosure.

## In scope

Examples of issues worth reporting:

- Cross-site scripting (XSS) or other client-side injection in the campaign UI
- Server-side request forgery or unsafe proxy behavior in `server.mjs`
- Accidental leakage of secrets or sensitive payee data through build output or the public repo

## Out of scope / intentional

- PocketBase collections that are **public-read by design** for this template
- Fictional MIT demo content (“Sam’s Workshop”) and placeholder `.env.example` values

Operator deploy hardening (admin lockdown, HTTPS, registration off, proof-photo privacy) is documented in the README and is separate from this reporting policy.
