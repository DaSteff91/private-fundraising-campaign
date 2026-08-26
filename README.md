# Private fundraising campaign

Open-source **template** for a private (non-charity) help landing page: SEPA GiroCode (EUR), PayPal.Me, Wise, multilingual copy, and a PocketBase CMS for status and donations.

The bundled demo (“Sam’s Workshop”) is fictional placeholder content under MIT. Replace the story, media, and `.env` values with yours.

**Agents / Cursor:** see [AGENTS.md](AGENTS.md).

## Prerequisites

- Node.js ≥ 20
- Path A also needs Docker Compose
- Path B downloads a PocketBase binary for your OS (`linux`, `macOS`, or Windows amd64)

## Path A — Docker

```bash
git clone https://github.com/DaSteff91/private-fundraising-campaign.git
cd private-fundraising-campaign
npm install
cp .env.example .env   # or: npm run setup  (also fetches a host PB binary)
# edit .env if you are not using the demo placeholders
npm run demo:docker    # build + compose up
npm run pb:superuser   # demo admin (or create in the admin UI)
npm run demo:seed
```

- Site: http://127.0.0.1:7890  
- Admin (localhost only): http://127.0.0.1:5789/_/  

Demo admin (local try-out only — change before go-live): `demo@example.test` / `demopassword-change-me`.

## Path B — Local

```bash
git clone https://github.com/DaSteff91/private-fundraising-campaign.git
cd private-fundraising-campaign
npm install
npm run setup          # .env + PocketBase binary for this machine
# edit .env if needed
npm run pb:migrate
```

Two terminals:

```bash
npm run pb:serve       # http://127.0.0.1:5789
```

```bash
npm run pb:superuser
npm run demo:seed
npm run dev            # http://127.0.0.1:7890
```

Production-shaped static server (after `npm run build`): `npm start`.

## Make it yours

1. Edit `.env`: payee, operator (Impressum), `CAMPAIGN_NAME`, `CAMPAIGN_REMITTANCE`, PayPal / Wise.
2. Currencies:
   - `DONATION_CURRENCY` — ISO 4217 for UI amounts and PayPal.Me (default `EUR`).
   - `LOCAL_CURRENCY` — optional ISO 4217 for the thank-you “forwarded” total; leave empty to hide it.
   - SEPA GiroCode / bank QR is shown **only when** `DONATION_CURRENCY=EUR` (EPC069-12 is EUR-only).
3. Rewrite copy in `src/i18n/{de,en,pt,es}.ts`, then `npm run demo:seed` (or `npm run seed:pb:copy` + `npm run seed:pb`).
4. Replace `public/media/*` and update `src/gallery.ts`.
5. Adjust demo donations in `live/campaign.json`, then re-seed.

Ongoing updates without a rebuild: PocketBase admin → **settings**, **donations**, **translations**. Phases: `collecting` → `funds_sent` → `funds_delivered` → `closed`.

Proof photos: crop to **amount + date**; strip EXIF (`exiftool -all= -overwrite_original path/to/photo.webp`).

### What belongs in `.env`

| Variable | Notes |
| --- | --- |
| `CAMPAIGN_NAME` | Display name (thank-you brand, titles). |
| `CAMPAIGN_REMITTANCE` | SEPA / GiroCode payment reference (ASCII preferred). |
| `DONATION_CURRENCY` | ISO 4217 (default `EUR`). |
| `LOCAL_CURRENCY` | Optional ISO 4217; empty hides the local total. |
| `PAYEE_NAME` | Must match the account-holder name **exactly** (SEPA VoP). |
| `PAYEE_IBAN` | Your IBAN, no spaces. |
| `PAYEE_BIC` | Your bank BIC. |
| `WISE_REQUEST_URL` | Reusable Wise link, **no fixed amount**. |
| `PAYPAL_ME_HANDLE` | Personal PayPal.Me handle or pasted `paypal.me/…` URL. |
| `OPERATOR_*` | Impressum / legal operator details. |
| `SITE_URL` | Public URL. Locally `http://127.0.0.1:7890`. |
| `POCKETBASE_URL` | Browser API origin. Local: `http://127.0.0.1:5789`. **Production: leave empty** so the page calls `/api` on the same host. |

Runtime (not baked; Docker/env on the server): `POCKETBASE_UPSTREAM` — where `server.mjs` proxies `/api` (Compose: `http://pfc-cms:8090`).

Never commit `.env`. `npm run build` bakes payee, Impressum, campaign name/remittance, currencies, and `POCKETBASE_URL` into `dist/`.

If you already have an older local `./pb_data` from before the `amount` / `amountLocal` schema, stop PocketBase, delete `./pb_data`, migrate/serve again, and re-seed.

## Deploy

1. Set production `.env`: real payee/operator, `SITE_URL=https://…`, **empty** `POCKETBASE_URL`.
2. `npm run build` on a trusted machine, then run Compose (or `npm start` + PocketBase) on the server.
3. Put **TLS** in front of port `7890` (examples below). Do not expose Node or PocketBase raw to the internet.
4. Keep PocketBase admin off the WAN (Compose already binds `127.0.0.1:5789`). Use SSH tunnel or VPN for admin.
5. Follow the checklist in [SECURITY.md](SECURITY.md).

Proxy only the app (`127.0.0.1:7890`). Do **not** reverse-proxy `5789` publicly.

### Caddy

```caddyfile
your.example.com {
  reverse_proxy 127.0.0.1:7890
}
```

### nginx

```nginx
server {
  listen 443 ssl http2;
  server_name your.example.com;

  # ssl_certificate     /path/to/fullchain.pem;
  # ssl_certificate_key /path/to/privkey.pem;

  location / {
    proxy_pass http://127.0.0.1:7890;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

### Apache (`mod_proxy` + `mod_ssl`)

```apache
<VirtualHost *:443>
  ServerName your.example.com
  # SSLEngine on
  # SSLCertificateFile      /path/to/fullchain.pem
  # SSLCertificateKeyFile   /path/to/privkey.pem

  ProxyPreserveHost On
  ProxyPass        / http://127.0.0.1:7890/
  ProxyPassReverse / http://127.0.0.1:7890/
  RequestHeader set X-Forwarded-Proto "https"
</VirtualHost>
```

### Traefik (Docker label sketch)

If the app container is on a Traefik network, point a router at the service on port `7890` (TLS via your usual Traefik cert resolver). Still keep PocketBase published only on `127.0.0.1:5789` — do not attach a public Traefik router to the CMS.

## Notes

- **GiroCode / EPC069-12:** EUR only; version `002`, charset `2`, BIC included, remittance from `CAMPAIGN_REMITTANCE`.
- **VoP:** Wrong `PAYEE_NAME` does not stop the transfer but scares donors.
- **PayPal.Me:** outbound link only; amount + `DONATION_CURRENCY` appended at runtime.
- **Languages:** DE / EN / PT / ES.

## Versioning & releases

Version lives in `package.json`. Tags are `v` + that version. See [CHANGELOG.md](CHANGELOG.md).

- **MAJOR** — breaking for operators/forks (env, seed/schema, PocketBase major).
- **MINOR** — backward-compatible features.
- **PATCH** — fixes, docs, chore.

CI runs tests and production build on `main`. Tag push creates a GitHub Release from the matching changelog section.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) and the [Code of Conduct](CODE_OF_CONDUCT.md). Vulnerabilities: [SECURITY.md](SECURITY.md).

## License

- Software and demo content: [MIT](LICENSE)
- Fraunces font: SIL OFL, see [NOTICE](NOTICE)

---

Created by [Kite-Engineer](https://www.kite-engineer.de) (Stefan Merthan).
