export type Lang = "de" | "en" | "pt" | "es";

export const LANGS: readonly Lang[] = ["de", "en", "pt", "es"];

export type CampaignPhase =
  | "collecting"
  | "funds_sent"
  | "funds_delivered"
  | "closed";

export type Copy = {
  meta: { title: string; description: string };
  nav: { skip: string; imprint: string; privacy: string; credit: string };
  hero: {
    title: string;
    lead: string;
    toDonate: string;
    photoAlts: string[];
    videoAlts: string[];
  };
  gallery: { photos: string; videos: string };
  lightbox: { enlarge: string; close: string; prev: string; next: string; play: string };
  story: { title: string; body: string[]; photoAlt: string };
  location: { title: string; body: string; photoAlt: string };
  purpose: { title: string; body: string[]; leftover: string };
  pay: {
    title: string;
    intro: string;
    stepAmount: string;
    stepMethod: string;
    stepDetails: string;
    methodListLabel: string;
    methodPaypal: string;
    methodBank: string;
    methodWise: string;
    amountLabel: string;
    custom: string;
    qrHint: string;
    copyName: string;
    copyIban: string;
    copyBic: string;
    copyAmount: string;
    copyPurpose: string;
    copied: string;
    fieldsLegend: string;
    recipient: string;
    iban: string;
    bic: string;
    purpose: string;
    amount: string;
    closed: string;
    paypalTitle: string;
    paypalBody: string;
    paypalButton: string;
    paypalExternal: string;
    wiseTitle: string;
    wiseBody: string;
    wiseButton: string;
    wiseExternal: string;
  };
  progress: {
    title: string;
    collected: string;
    updated: string;
    unknown: string;
    empty: string;
    phases: Record<CampaignPhase, string>;
  };
  timeline: { title: string; items: string[] };
  imprint: { title: string; accordingTo: string };
  privacy: { title: string; body: string[] };
  thanks: {
    title: string;
    lead: string;
    collectedLabel: string;
    localLabel: string;
    toCampaign: string;
    backHome: string;
    proofsTitle: string;
  };
};
