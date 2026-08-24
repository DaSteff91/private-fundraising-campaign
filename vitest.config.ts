import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";
import { paypalMeHandle } from "./src/payment/paypal";

const DEFAULT_POCKETBASE_URL = "http://127.0.0.1:5789";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const payeeIban = (env.PAYEE_IBAN || "DE89370400440532013000").replace(/\s+/g, "").toUpperCase();
  const paypalHandle = (() => {
    try {
      return paypalMeHandle(env.PAYPAL_ME_HANDLE || "example");
    } catch {
      return "example";
    }
  })();

  return {
    test: {
      environment: "node",
      include: ["src/**/*.test.ts"],
    },
    define: {
      __SITE_URL__: JSON.stringify((env.SITE_URL || "http://127.0.0.1:7890").replace(/\/$/, "")),
      __PAYEE_NAME__: JSON.stringify(env.PAYEE_NAME || "Max Mustermann"),
      __PAYEE_IBAN__: JSON.stringify(payeeIban),
      __PAYEE_BIC__: JSON.stringify((env.PAYEE_BIC || "BYLADEM1001").toUpperCase()),
      __WISE_REQUEST_URL__: JSON.stringify(env.WISE_REQUEST_URL || "https://wise.com/pay/me/example"),
      __PAYPAL_ME_HANDLE__: JSON.stringify(paypalHandle),
      __OPERATOR_NAME__: JSON.stringify(env.OPERATOR_NAME || "Max Mustermann"),
      __OPERATOR_STREET__: JSON.stringify(env.OPERATOR_STREET || "Musterstrasse 1"),
      __OPERATOR_ZIP__: JSON.stringify(env.OPERATOR_ZIP || "80331"),
      __OPERATOR_CITY__: JSON.stringify(env.OPERATOR_CITY || "Muenchen"),
      __OPERATOR_EMAIL__: JSON.stringify(env.OPERATOR_EMAIL || "demo@example.test"),
      __POCKETBASE_URL__: JSON.stringify(
        env.POCKETBASE_URL === undefined
          ? DEFAULT_POCKETBASE_URL
          : env.POCKETBASE_URL.trim().replace(/\/$/, ""),
      ),
      __CAMPAIGN_NAME__: JSON.stringify(env.CAMPAIGN_NAME || "Sam's Workshop"),
      __CAMPAIGN_REMITTANCE__: JSON.stringify(env.CAMPAIGN_REMITTANCE || "Sams Workshop"),
    },
  };
});
