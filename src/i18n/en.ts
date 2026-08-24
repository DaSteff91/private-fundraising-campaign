import type { Copy } from "./types";

export const en: Copy = {
  meta: {
    title: "Sam's Workshop — private fundraiser",
    description:
      "A private appeal to help Sam rebuild a workshop after a storm. Not a charity, not a tax-deductible donation.",
  },
  nav: {
    skip: "Skip to content",
    imprint: "Imprint (Impressum)",
    privacy: "Privacy",
    credit: "Open-source template: private-fundraising-campaign",
  },
  hero: {
    title: "Help for Sam's workshop!",
    lead: "A late-summer storm damaged the small workshop of someone I know: Sam. This page collects a little money so tools and a roof can be replaced.",
    toDonate: "Go to donation",
    photoAlts: [
      "Illustration of a small workshop building",
      "Illustration of tools on a workbench",
      "Illustration of storm clouds over a hillside",
    ],
    videoAlts: [],
  },
  gallery: {
    photos: "Photos",
    videos: "Videos",
  },
  lightbox: {
    enlarge: "Enlarge image",
    close: "Close",
    prev: "Previous media",
    next: "Next media",
    play: "Play video",
  },
  story: {
    title: "Who is Sam?",
    body: [
      "Sam runs a tiny neighbourhood workshop — repairs, odd jobs, the kind of place people drop by with a broken chair. After the storm, the roof leaked and several tools were ruined. This demo campaign shows how a private help page can look; replace the story with yours.",
    ],
    photoAlt: "Illustration of a person at a workbench inside a workshop",
  },
  location: {
    title: "Where did this happen?",
    body: "A fictional coastal town — swap this for your real place when you fork the template.",
    photoAlt: "Simple map placeholder for the demo campaign location",
  },
  purpose: {
    title: "How the money will be used",
    body: [
      "Contributions land in the operator's account first. The sum is then forwarded to Sam (or a trusted person on the ground) for roofing, tools, and materials. Names of donors are not published.",
      "Important: this is not a tax-deductible donation. There is no donation receipt. It is privately organised — not a charity.",
    ],
    leftover:
      "If a few cents remain after currency conversion, they go toward a fraction of a coffee. Fair enough?",
  },
  pay: {
    title: "How to help",
    intro:
      "Pick an amount, choose how to pay, done. Please leave the bank payment reference as shown in the transfer details.",
    stepAmount: "1. Choose amount",
    stepMethod: "2. Choose method",
    stepDetails: "3. Pay",
    methodListLabel: "Payment method",
    methodPaypal: "PayPal",
    methodBank: "Bank transfer",
    methodWise: "Wise",
    amountLabel: "Amount in euro",
    custom: "Other amount",
    qrHint:
      "Scan the generated QR code with your banking app, or copy the details directly.",
    copyName: "Copy name",
    copyIban: "Copy IBAN",
    copyBic: "Copy BIC",
    copyAmount: "Copy amount",
    copyPurpose: "Copy payment reference",
    copied: "Copied",
    fieldsLegend: "Transfer details",
    recipient: "Recipient",
    iban: "IBAN",
    bic: "BIC",
    purpose: "Payment reference",
    amount: "Amount",
    closed: "This collection has ended. Thank you.",
    paypalTitle: "PayPal",
    paypalBody:
      "Opens paypal.com with your amount. Please send as a friends-and-family payment in euro (balance or bank).",
    paypalButton: "Open PayPal",
    paypalExternal: "This opens paypal.com",
    wiseTitle: "Wise",
    wiseBody:
      "For international transfers, or if you already use Wise. Opens wise.com — a Wise account is not required. This site does not take card payments.",
    wiseButton: "Open Wise",
    wiseExternal: "This opens wise.com",
  },
  progress: {
    title: "Progress",
    collected: "collected so far",
    updated: "Updated",
    unknown: "Status unknown",
    empty: "No incoming transfers published yet.",
    phases: {
      collecting: "Collection open until 31 December 2026.",
      funds_sent: "The money is on its way to Sam, or has arrived with the on-the-ground contact.",
      funds_delivered: "The money has been passed on to Sam.",
      closed: "Collection closed.",
    },
  },
  timeline: {
    title: "What happens next",
    items: [
      "Until 31 December 2026: contributions to the operator account (PayPal, bank transfer, or Wise).",
      "Then: the sum is forwarded to Sam for workshop repairs.",
      "Optional proof crops (amount + date only) may appear here later.",
    ],
  },
  imprint: {
    title: "Imprint (Impressum)",
    accordingTo: "Information according to section 5 DDG",
  },
  privacy: {
    title: "Privacy",
    body: [
      "This page does not set analytics cookies and does not load third-party scripts. Your language choice may stay in your browser storage.",
      "If you transfer by bank, your bank processes the payment data. If you use the PayPal or Wise link, that company's privacy notice applies. Emails you send me are stored so I can reply.",
    ],
  },
  thanks: {
    title: "THANK YOU",
    lead: "The collection has closed. Together we raised an amount that has now been forwarded.",
    eurLabel: "collected in euro",
    copLabel: "forwarded (local currency)",
    toCampaign: "Visit the campaign page",
    backHome: "Back to thank-you",
    proofsTitle: "Proof",
  },
};
