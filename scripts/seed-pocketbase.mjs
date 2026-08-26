#!/usr/bin/env node
/**
 * Upsert settings, donations, and translations into PocketBase.
 * Schema is applied by migrations (`npm run pb:migrate`), not by this script.
 *
 * Usage:
 *   PB_ADMIN_EMAIL=… PB_ADMIN_PASSWORD=… npm run seed:pb
 *
 * Optional:
 *   POCKETBASE_URL=http://127.0.0.1:5789
 *   CLOSE_DATE=2026-12-31
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const baseUrl = (process.env.POCKETBASE_URL || "http://127.0.0.1:5789").replace(/\/$/, "");
const email = process.env.PB_ADMIN_EMAIL?.trim();
const password = process.env.PB_ADMIN_PASSWORD?.trim();
const closeDate = process.env.CLOSE_DATE?.trim() || "2026-12-31";

if (!email || !password) {
  console.error("Set PB_ADMIN_EMAIL and PB_ADMIN_PASSWORD");
  process.exit(1);
}

const PHASES = ["collecting", "funds_sent", "funds_delivered", "closed"];

async function api(path, { method = "GET", token, body, formData } = {}) {
  const headers = {};
  if (token) headers.Authorization = token;
  let payload = undefined;
  if (formData) {
    payload = formData;
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }
  const res = await fetch(`${baseUrl}${path}`, { method, headers, body: payload });
  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }
  if (!res.ok) {
    const msg = typeof data === "object" ? JSON.stringify(data) : String(data);
    throw new Error(`${method} ${path} → ${res.status}: ${msg}`);
  }
  return data;
}

async function authToken() {
  try {
    const data = await api("/api/collections/_superusers/auth-with-password", {
      method: "POST",
      body: { identity: email, password },
    });
    return data.token;
  } catch {
    const data = await api("/api/admins/auth-with-password", {
      method: "POST",
      body: { identity: email, password },
    });
    return data.token;
  }
}

async function listAll(token, collection) {
  const data = await api(`/api/collections/${collection}/records?perPage=200`, { token });
  return data.items || [];
}

async function upsertSettings(token, campaign) {
  const phase = PHASES.includes(campaign.phase) ? campaign.phase : "collecting";
  const amountLocalRaw =
    campaign.amountLocal !== undefined ? campaign.amountLocal : campaign.amountPesos;
  const amountLocal =
    typeof amountLocalRaw === "number" && Number.isFinite(amountLocalRaw)
      ? amountLocalRaw
      : Number(amountLocalRaw) || 0;
  const body = {
    closeDate,
    phase,
    updatedAt: campaign.updatedAt || closeDate,
    amountLocal,
  };
  const rows = await listAll(token, "settings");
  if (rows.length === 0) {
    await api("/api/collections/settings/records", { method: "POST", token, body });
    console.log("created settings");
  } else {
    await api(`/api/collections/settings/records/${rows[0].id}`, {
      method: "PATCH",
      token,
      body,
    });
    console.log("updated settings");
  }
}

async function replaceDonations(token, donations) {
  const rows = await listAll(token, "donations");
  for (const row of rows) {
    await api(`/api/collections/donations/records/${row.id}`, { method: "DELETE", token });
  }
  for (const d of donations) {
    const rawAmount = d.amount !== undefined ? d.amount : d.amountEur;
    const body = {
      date: d.date,
      amount: typeof rawAmount === "number" ? rawAmount : Number(rawAmount) || 0,
      captionDe: d.caption?.de || "",
      captionEn: d.caption?.en || "",
      captionPt: d.caption?.pt || "",
      captionEs: d.caption?.es || "",
    };
    const created = await api("/api/collections/donations/records", {
      method: "POST",
      token,
      body,
    });
    if (d.image && typeof d.image === "string") {
      const localPath = d.image.startsWith("/live/")
        ? resolve(root, d.image.slice(1))
        : resolve(root, "live", d.image);
      if (existsSync(localPath)) {
        const form = new FormData();
        const blob = new Blob([readFileSync(localPath)]);
        const name = localPath.split("/").pop() || "proof.webp";
        form.append("image", blob, name);
        await api(`/api/collections/donations/records/${created.id}`, {
          method: "PATCH",
          token,
          formData: form,
        });
      } else {
        console.warn(`skip missing image ${localPath}`);
      }
    }
  }
  console.log(`seeded ${donations.length} donations`);
}

async function upsertTranslations(token, copies) {
  const rows = await listAll(token, "translations");
  const byLang = new Map(rows.map((r) => [r.lang, r]));
  for (const [lang, payload] of Object.entries(copies)) {
    const existing = byLang.get(lang);
    if (existing) {
      await api(`/api/collections/translations/records/${existing.id}`, {
        method: "PATCH",
        token,
        body: { lang, payload },
      });
    } else {
      await api("/api/collections/translations/records", {
        method: "POST",
        token,
        body: { lang, payload },
      });
    }
    console.log(`upserted translation ${lang}`);
  }
}

function loadCampaignFile() {
  const path = resolve(root, "live/campaign.json");
  if (!existsSync(path)) {
    return {
      updatedAt: closeDate,
      phase: "collecting",
      amountLocal: 0,
      donations: [],
    };
  }
  return JSON.parse(readFileSync(path, "utf8"));
}

function loadCopySeed() {
  const path = resolve(root, "pocketbase/copy-seed.json");
  if (!existsSync(path)) {
    throw new Error("Missing pocketbase/copy-seed.json — run npm run seed:pb:copy first");
  }
  return JSON.parse(readFileSync(path, "utf8"));
}

const token = await authToken();
const campaign = loadCampaignFile();
await upsertSettings(token, campaign);
const donations = Array.isArray(campaign.donations)
  ? campaign.donations
  : Array.isArray(campaign.updates)
    ? campaign.updates
    : [];
await replaceDonations(token, donations.filter((d) => d && typeof d.date === "string"));
await upsertTranslations(token, loadCopySeed());
console.log("seed complete");
