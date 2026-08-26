import type { Copy } from "./types";

export const es: Copy = {
  meta: {
    title: "Taller de Sam — campaña privada",
    description:
      "Campaña privada para ayudar a Sam a reconstruir el taller tras una tormenta. No es una ONG ni una donación desgravable.",
  },
  nav: {
    skip: "Saltar al contenido",
    imprint: "Impressum",
    privacy: "Privacidad",
    credit: "Plantilla open source: private-fundraising-campaign",
  },
  hero: {
    title: "¡Ayuda para el taller de Sam!",
    lead: "Una tormenta de finales de verano dañó el pequeño taller de alguien que conozco: Sam. Esta página reúne un poco de dinero para el tejado y las herramientas.",
    toDonate: "Ir a la donación",
    photoAlts: [
      "Ilustración de un pequeño taller",
      "Ilustración de herramientas en un banco de trabajo",
      "Ilustración de nubes de tormenta sobre una ladera",
    ],
    videoAlts: [],
  },
  gallery: {
    photos: "Fotos",
    videos: "Vídeos",
  },
  lightbox: {
    enlarge: "Ampliar imagen",
    close: "Cerrar",
    prev: "Medio anterior",
    next: "Siguiente medio",
    play: "Reproducir vídeo",
  },
  story: {
    title: "¿Quién es Sam?",
    body: [
      "Sam lleva un taller diminuto del barrio: reparaciones, chapuzas, el sitio donde alguien llega con una silla rota. Tras la tormenta, el tejado gotaba y varias herramientas quedaron inservibles. Esta campaña de demostración muestra cómo puede verse una página de ayuda privada; sustituye la historia por la tuya.",
    ],
    photoAlt: "Ilustración de una persona en el banco de trabajo dentro de un taller",
  },
  location: {
    title: "¿Dónde ocurrió?",
    body: "Un pueblo costero ficticio: cámbialo por tu lugar real al hacer fork.",
    photoAlt: "Mapa sencillo de marcador de posición para la ubicación de la demo",
  },
  purpose: {
    title: "Cómo se usará el dinero",
    body: [
      "Las aportaciones llegan primero a la cuenta de quien opera la página. Luego se reenvía la suma a Sam (o a una persona de confianza in situ) para tejado, herramientas y material. No se publican nombres de quienes aportan.",
      "Importante: no es una donación desgravable. No hay recibo. Está organizada de forma privada: no es una ONG.",
    ],
    leftover:
      "Si quedan unos céntimos tras la conversión de divisa, van a una fracción de un café. ¿Te parece bien?",
  },
  pay: {
    title: "Cómo ayudar",
    intro:
      "Elige importe, elige método, listo. Deja el concepto bancario tal como aparece en los datos de la transferencia.",
    stepAmount: "1. Elegir importe",
    stepMethod: "2. Elegir método",
    stepDetails: "3. Pagar",
    methodListLabel: "Método de pago",
    methodPaypal: "PayPal",
    methodBank: "Transferencia",
    methodWise: "Wise",
    amountLabel: "Importe en euro",
    custom: "Otro importe",
    qrHint:
      "Escanea el código QR con la app del banco, o copia los datos directamente.",
    copyName: "Copiar nombre",
    copyIban: "Copiar IBAN",
    copyBic: "Copiar BIC",
    copyAmount: "Copiar importe",
    copyPurpose: "Copiar concepto",
    copied: "Copiado",
    fieldsLegend: "Datos de la transferencia",
    recipient: "Destinatario",
    iban: "IBAN",
    bic: "BIC",
    purpose: "Concepto",
    amount: "Importe",
    closed: "La recaudación ha terminado. Gracias.",
    paypalTitle: "PayPal",
    paypalBody:
      "Abre paypal.com con tu importe. Envíalo como pago entre amigos en euro (saldo o banco).",
    paypalButton: "Abrir PayPal",
    paypalExternal: "Esto abre paypal.com",
    wiseTitle: "Wise",
    wiseBody:
      "Para transferencias internacionales, o si ya usas Wise. Abre wise.com; no hace falta cuenta Wise. Este sitio no acepta tarjeta.",
    wiseButton: "Abrir Wise",
    wiseExternal: "Esto abre wise.com",
  },
  progress: {
    title: "Progreso",
    collected: "recaudado hasta ahora",
    updated: "Actualizado",
    unknown: "Estado desconocido",
    empty: "Aún no hay ingresos publicados.",
    phases: {
      collecting: "Recaudación abierta hasta el 31 de diciembre de 2026.",
      funds_sent: "El dinero va de camino a Sam, o ya llegó al contacto local.",
      funds_delivered: "El dinero se ha entregado a Sam.",
      closed: "Recaudación cerrada.",
    },
  },
  timeline: {
    title: "Qué pasa después",
    items: [
      "Hasta el 31 de diciembre de 2026: aportaciones a la cuenta del operador (PayPal, transferencia o Wise).",
      "Después: se reenvía la suma a Sam para reparar el taller.",
      "Más adelante pueden aparecer comprobantes opcionales (solo importe + fecha).",
    ],
  },
  imprint: {
    title: "Impressum",
    accordingTo: "Información según el § 5 DDG",
  },
  privacy: {
    title: "Privacidad",
    body: [
      "Esta página no usa cookies de análisis ni carga scripts de terceros. La elección de idioma puede guardarse en el almacenamiento del navegador.",
      "Si transfieres por banco, tu banco trata los datos del pago. Si usas el enlace de PayPal o Wise, aplica su aviso de privacidad. Los correos que me envías se guardan para poder responder.",
    ],
  },
  thanks: {
    title: "GRACIAS",
    lead: "La recaudación ha cerrado. Juntos reunimos un importe que ya se ha reenviado.",
    collectedLabel: "recaudado",
    localLabel: "reenviado (moneda local)",
    toCampaign: "Ver la página de la campaña",
    backHome: "Volver al agradecimiento",
    proofsTitle: "Comprobantes",
  },
};
