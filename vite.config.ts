import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv, type Plugin } from "vite";
import { paypalMeBaseUrl, paypalMeHandle } from "./src/payment/paypal";

const rootDir = fileURLToPath(new URL(".", import.meta.url));

const REQUIRED = [
  "SITE_URL",
  "PAYEE_NAME",
  "PAYEE_IBAN",
  "PAYEE_BIC",
  "WISE_REQUEST_URL",
  "PAYPAL_ME_HANDLE",
  "OPERATOR_NAME",
  "OPERATOR_STREET",
  "OPERATOR_ZIP",
  "OPERATOR_CITY",
  "OPERATOR_EMAIL",
  "CAMPAIGN_NAME",
  "CAMPAIGN_REMITTANCE",
] as const;

const DEFAULT_POCKETBASE_URL = "http://127.0.0.1:5789";

function collectEnv(mode: string): Record<string, string> {
  const loaded = loadEnv(mode, process.cwd(), "");
  const env: Record<string, string> = {};
  for (const key of REQUIRED) {
    env[key] = loaded[key]?.trim() ?? "";
  }
  // Missing key → local default. Empty POCKETBASE_URL= → same-origin (/api via server or Vite proxy).
  env.POCKETBASE_URL =
    loaded.POCKETBASE_URL === undefined
      ? DEFAULT_POCKETBASE_URL
      : loaded.POCKETBASE_URL.trim().replace(/\/$/, "");
  return env;
}

function assertComplete(env: Record<string, string>, command: string): void {
  const missing = REQUIRED.filter((key) => !env[key]);
  if (missing.length > 0) {
    throw new Error(
      `${command} requires a complete .env (copy .env.example). Missing: ${missing.join(", ")}`,
    );
  }
  const iban = env.PAYEE_IBAN.replace(/\s+/g, "").toUpperCase();
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/.test(iban)) {
    throw new Error("PAYEE_IBAN does not look like an IBAN");
  }
  try {
    paypalMeHandle(env.PAYPAL_ME_HANDLE);
  } catch {
    throw new Error("PAYPAL_ME_HANDLE must be a PayPal.Me handle or paypal.me URL");
  }
}

function injectHtml(env: Record<string, string>): Plugin {
  const replacements: Record<string, string> = {
    "%SITE_URL%": env.SITE_URL.replace(/\/$/, ""),
    "%PAYEE_NAME%": env.PAYEE_NAME,
    "%PAYEE_IBAN%": env.PAYEE_IBAN.replace(/\s+/g, "").toUpperCase(),
    "%PAYEE_BIC%": env.PAYEE_BIC.toUpperCase(),
    "%WISE_REQUEST_URL%": env.WISE_REQUEST_URL,
    "%PAYPAL_ME_URL%": paypalMeBaseUrl(env.PAYPAL_ME_HANDLE),
    "%OPERATOR_NAME%": env.OPERATOR_NAME,
    "%OPERATOR_STREET%": env.OPERATOR_STREET,
    "%OPERATOR_ZIP%": env.OPERATOR_ZIP,
    "%OPERATOR_CITY%": env.OPERATOR_CITY,
    "%OPERATOR_EMAIL%": env.OPERATOR_EMAIL,
    "%CAMPAIGN_NAME%": env.CAMPAIGN_NAME,
    "%CAMPAIGN_REMITTANCE%": env.CAMPAIGN_REMITTANCE,
  };

  return {
    name: "pfc-env-html",
    transformIndexHtml(html) {
      let next = html;
      for (const [token, value] of Object.entries(replacements)) {
        next = next.replaceAll(token, value);
      }
      return next;
    },
  };
}

/** Pretty `/thanks` → `thanks.html` in Vite dev and preview. */
function thanksRewrite(): Plugin {
  const rewrite = (req: { url?: string }) => {
    const raw = req.url || "/";
    const q = raw.indexOf("?");
    const path = q === -1 ? raw : raw.slice(0, q);
    const search = q === -1 ? "" : raw.slice(q);
    if (path === "/thanks" || path === "/thanks/") {
      req.url = `/thanks.html${search}`;
    }
  };
  return {
    name: "pfc-thanks-rewrite",
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        rewrite(req);
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, _res, next) => {
        rewrite(req);
        next();
      });
    },
  };
}

export default defineConfig(({ command, mode }) => {
  const env = collectEnv(mode);
  assertComplete(env, command);

  const payeeIban = env.PAYEE_IBAN.replace(/\s+/g, "").toUpperCase();
  const payeeBic = env.PAYEE_BIC.toUpperCase();
  const paypalHandle = paypalMeHandle(env.PAYPAL_ME_HANDLE);

  const sameOriginPb = env.POCKETBASE_URL === "";
  const pbDevProxy = {
    "/api": {
      target: process.env.POCKETBASE_UPSTREAM || "http://127.0.0.1:5789",
      changeOrigin: true,
    },
  };

  return {
    plugins: [injectHtml(env), thanksRewrite()],
    server: {
      port: 7890,
      strictPort: true,
      proxy: sameOriginPb ? pbDevProxy : undefined,
    },
    preview: {
      port: 7890,
      strictPort: true,
      proxy: sameOriginPb ? pbDevProxy : undefined,
    },
    build: {
      rollupOptions: {
        input: {
          main: resolve(rootDir, "index.html"),
          thanks: resolve(rootDir, "thanks.html"),
        },
      },
    },
    define: {
      __SITE_URL__: JSON.stringify(env.SITE_URL.replace(/\/$/, "")),
      __PAYEE_NAME__: JSON.stringify(env.PAYEE_NAME),
      __PAYEE_IBAN__: JSON.stringify(payeeIban),
      __PAYEE_BIC__: JSON.stringify(payeeBic),
      __WISE_REQUEST_URL__: JSON.stringify(env.WISE_REQUEST_URL),
      __PAYPAL_ME_HANDLE__: JSON.stringify(paypalHandle),
      __OPERATOR_NAME__: JSON.stringify(env.OPERATOR_NAME),
      __OPERATOR_STREET__: JSON.stringify(env.OPERATOR_STREET),
      __OPERATOR_ZIP__: JSON.stringify(env.OPERATOR_ZIP),
      __OPERATOR_CITY__: JSON.stringify(env.OPERATOR_CITY),
      __OPERATOR_EMAIL__: JSON.stringify(env.OPERATOR_EMAIL),
      __POCKETBASE_URL__: JSON.stringify(env.POCKETBASE_URL),
      __CAMPAIGN_NAME__: JSON.stringify(env.CAMPAIGN_NAME),
      __CAMPAIGN_REMITTANCE__: JSON.stringify(env.CAMPAIGN_REMITTANCE),
    },
  };
});
