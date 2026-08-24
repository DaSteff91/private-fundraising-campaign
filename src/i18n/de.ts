import type { Copy } from "./types";

export const de: Copy = {
  meta: {
    title: "Sams Werkstatt — privater Spendenaufruf",
    description:
      "Privater Spendenaufruf, um Sam nach einem Sturm beim Wiederaufbau der Werkstatt zu helfen. Keine Hilfsorganisation, keine steuerlich absetzbare Spende.",
  },
  nav: {
    skip: "Zum Inhalt",
    imprint: "Impressum",
    privacy: "Datenschutz",
    credit: "Open-Source-Vorlage: private-fundraising-campaign",
  },
  hero: {
    title: "Hilfe für Sams Werkstatt!",
    lead: "Ein Spätsommersturm hat die kleine Werkstatt von jemandem, den ich kenne, beschädigt: Sam. Diese Seite sammelt etwas Geld für Dach und Werkzeug.",
    toDonate: "Direkt zur Spende",
    photoAlts: [
      "Illustration einer kleinen Werkstatt",
      "Illustration von Werkzeugen auf einer Werkbank",
      "Illustration von Sturmwolken über einem Hang",
    ],
    videoAlts: [],
  },
  gallery: {
    photos: "Fotos",
    videos: "Videos",
  },
  lightbox: {
    enlarge: "Bild vergrößern",
    close: "Schließen",
    prev: "Vorheriges Medium",
    next: "Nächstes Medium",
    play: "Video abspielen",
  },
  story: {
    title: "Wer ist Sam?",
    body: [
      "Sam betreibt eine kleine Nachbarschaftswerkstatt — Reparaturen, Gelegenheitsjobs, der Ort, an dem Leute mit einem kaputten Stuhl vorbeikommen. Nach dem Sturm tropfte das Dach und mehrere Werkzeuge waren hin. Diese Demo-Kampagne zeigt, wie eine private Hilfeseite aussehen kann; ersetze die Geschichte durch deine.",
    ],
    photoAlt: "Illustration einer Person an der Werkbank in einer Werkstatt",
  },
  location: {
    title: "Wo ist das passiert?",
    body: "Eine erfundene Küstenstadt — ersetze das beim Forken durch deinen echten Ort.",
    photoAlt: "Einfacher Karten-Platzhalter für den Ort der Demo-Kampagne",
  },
  purpose: {
    title: "So wird das Geld verwendet",
    body: [
      "Beiträge landen zuerst auf dem Konto der betreibenden Person. Die Summe geht danach an Sam (oder eine Vertrauensperson vor Ort) für Dach, Werkzeug und Material. Namen von Spendenden werden nicht veröffentlicht.",
      "Wichtig: Das ist keine steuerlich absetzbare Spende. Es gibt keine Zuwendungsbestätigung. Es ist privat organisiert — keine Hilfsorganisation.",
    ],
    leftover:
      "Wenn nach der Währungsumrechnung ein paar Cent übrig bleiben, gehen sie an den Bruchteil eines Kaffees. Vertretbar?",
  },
  pay: {
    title: "So kannst du helfen",
    intro:
      "Betrag wählen, Zahlungsweg wählen, fertig. Verwendungszweck bei der Bank bitte unverändert lassen — wie in den Überweisungsdaten angezeigt.",
    stepAmount: "1. Betrag auswählen",
    stepMethod: "2. Methode auswählen",
    stepDetails: "3. Zahlung",
    methodListLabel: "Zahlungsmethode",
    methodPaypal: "PayPal",
    methodBank: "Überweisung",
    methodWise: "Wise",
    amountLabel: "Betrag in Euro",
    custom: "Anderer Betrag",
    qrHint:
      "Den generierten QR Code mit der Banking-App scannen oder die Daten direkt kopieren.",
    copyName: "Name kopieren",
    copyIban: "IBAN kopieren",
    copyBic: "BIC kopieren",
    copyAmount: "Betrag kopieren",
    copyPurpose: "Verwendungszweck kopieren",
    copied: "Kopiert",
    fieldsLegend: "Überweisungsdaten",
    recipient: "Empfänger",
    iban: "IBAN",
    bic: "BIC",
    purpose: "Verwendungszweck",
    amount: "Betrag",
    closed: "Die Sammlung ist beendet. Vielen Dank.",
    paypalTitle: "PayPal",
    paypalBody:
      "Link öffnet paypal.com mit dem gewählten Betrag. Bitte als Freunde:innen-Zahlung in Euro senden (Guthaben oder Bank).",
    paypalButton: "Mit PayPal öffnen",
    paypalExternal: "Öffnet paypal.com",
    wiseTitle: "Wise",
    wiseBody:
      "Für internationale Transfers oder wenn du Wise schon nutzt. Der Link öffnet wise.com — ein Konto ist nicht zwingend nötig. Keine Kartenzahlung auf dieser Seite.",
    wiseButton: "Auf Wise öffnen",
    wiseExternal: "Öffnet wise.com",
  },
  progress: {
    title: "Stand",
    collected: "bisher gesammelt",
    updated: "Stand",
    unknown: "Stand unbekannt",
    empty: "Noch keine Eingänge veröffentlicht.",
    phases: {
      collecting: "Sammlung läuft bis 31.12.2026.",
      funds_sent: "Das Geld ist unterwegs zu Sam bzw. bei der Kontaktperson vor Ort angekommen.",
      funds_delivered: "Das Geld ist bei Sam angekommen.",
      closed: "Sammlung beendet.",
    },
  },
  timeline: {
    title: "Ablauf",
    items: [
      "Bis 31.12.2026: Beiträge auf das Betreiberkonto (PayPal, Überweisung oder Wise).",
      "Danach: Weiterleitung der Summe an Sam für die Werkstatt.",
      "Optional erscheinen später Nachweise (nur Betrag + Datum).",
    ],
  },
  imprint: {
    title: "Impressum",
    accordingTo: "Angaben gemäß § 5 DDG",
  },
  privacy: {
    title: "Datenschutz",
    body: [
      "Diese Seite setzt keine Analyse-Cookies und lädt keine Drittanbieter-Skripte. Die Spracheinstellung kann im Speicher deines Browsers bleiben.",
      "Wenn du per Bank überweist, verarbeitet deine Bank die Zahlungsdaten. Wenn du den PayPal- oder Wise-Link nutzt, gilt die Datenschutzerklärung von PayPal bzw. Wise. Anfragen per E-Mail speichere ich, um zu antworten.",
    ],
  },
  thanks: {
    title: "DANKE",
    lead: "Die Sammlung ist abgeschlossen. Gemeinsam ist ein Betrag zusammengekommen, der weitergeleitet wurde.",
    eurLabel: "gesammelt in Euro",
    copLabel: "weitergeleitet (Lokalwährung)",
    toCampaign: "Zur Kampagnenseite",
    backHome: "Zur Danke-Seite",
    proofsTitle: "Nachweise",
  },
};
