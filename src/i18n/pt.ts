import type { Copy } from "./types";

export const pt: Copy = {
  meta: {
    title: "Oficina do Sam — campanha particular",
    description:
      "Campanha particular para ajudar o Sam a reconstruir a oficina depois de uma tempestade. Não é uma ONG e não há benefício fiscal.",
  },
  nav: {
    skip: "Saltar para o conteúdo",
    imprint: "Impressum",
    privacy: "Privacidade",
    credit: "Modelo open-source: private-fundraising-campaign",
  },
  hero: {
    title: "Ajuda para a oficina do Sam!",
    lead: "Uma tempestade de fim de verão danificou a pequena oficina de alguém que eu conheço: o Sam. Esta página junta um pouco de dinheiro para telhado e ferramentas.",
    toDonate: "Ir para a doação",
    photoAlts: [
      "Ilustração de uma pequena oficina",
      "Ilustração de ferramentas numa bancada",
      "Ilustração de nuvens de tempestade sobre uma encosta",
    ],
    videoAlts: [],
  },
  gallery: {
    photos: "Fotos",
    videos: "Vídeos",
  },
  lightbox: {
    enlarge: "Ampliar imagem",
    close: "Fechar",
    prev: "Mídia anterior",
    next: "Próxima mídia",
    play: "Reproduzir vídeo",
  },
  story: {
    title: "Quem é o Sam?",
    body: [
      "O Sam tem uma oficina pequenina no bairro — reparos, biscates, o tipo de lugar onde alguém chega com uma cadeira quebrada. Depois da tempestade, o telhado vazava e várias ferramentas estragaram. Esta campanha de demonstração mostra como pode ser uma página de ajuda particular; troque a história pela sua.",
    ],
    photoAlt: "Ilustração de uma pessoa na bancada dentro de uma oficina",
  },
  location: {
    title: "Onde isso aconteceu?",
    body: "Uma cidade costeira fictícia — troque pelo seu lugar real ao fazer o fork.",
    photoAlt: "Mapa simples de placeholder para o local da campanha demo",
  },
  purpose: {
    title: "Como o dinheiro será usado",
    body: [
      "As contribuições chegam primeiro na conta de quem opera a página. Depois a soma é repassada ao Sam (ou a alguém de confiança no local) para telhado, ferramentas e material. Nomes de quem doa não são publicados.",
      "Importante: isto não é uma doação com benefício fiscal. Não há recibo. É organizado de forma particular — não é uma ONG.",
    ],
    leftover:
      "Se sobrarem alguns centavos depois da conversão, vão para uma fração de um café. Justo?",
  },
  pay: {
    title: "Como ajudar",
    intro:
      "Escolha o valor, escolha o método, pronto. Na transferência, deixe a descrição como aparece nos dados de pagamento.",
    stepAmount: "1. Escolher valor",
    stepMethod: "2. Escolher método",
    stepDetails: "3. Pagar",
    methodListLabel: "Método de pagamento",
    methodPaypal: "PayPal",
    methodBank: "Transferência",
    methodWise: "Wise",
    amountLabel: "Valor em euro",
    custom: "Outro valor",
    qrHint:
      "Escaneie o QR gerado com o app do banco, ou copie os dados diretamente.",
    copyName: "Copiar nome",
    copyIban: "Copiar IBAN",
    copyBic: "Copiar BIC",
    copyAmount: "Copiar valor",
    copyPurpose: "Copiar descrição",
    copied: "Copiado",
    fieldsLegend: "Dados da transferência",
    recipient: "Destinatário",
    iban: "IBAN",
    bic: "BIC",
    purpose: "Descrição",
    amount: "Valor",
    closed: "A arrecadação terminou. Obrigado.",
    paypalTitle: "PayPal",
    paypalBody:
      "Abre paypal.com com o seu valor. Envie como pagamento entre amigos em euro (saldo ou banco).",
    paypalButton: "Abrir PayPal",
    paypalExternal: "Isto abre paypal.com",
    wiseTitle: "Wise",
    wiseBody:
      "Para transferências internacionais, ou se você já usa Wise. Abre wise.com — não é obrigatório ter conta Wise. Este site não aceita cartão.",
    wiseButton: "Abrir Wise",
    wiseExternal: "Isto abre wise.com",
  },
  progress: {
    title: "Progresso",
    collected: "arrecadado até agora",
    updated: "Atualizado",
    unknown: "Status desconhecido",
    empty: "Ainda não há transferências publicadas.",
    phases: {
      collecting: "Arrecadação aberta até 31 de dezembro de 2026.",
      funds_sent: "O dinheiro está a caminho do Sam, ou já chegou ao contato local.",
      funds_delivered: "O dinheiro foi entregue ao Sam.",
      closed: "Arrecadação encerrada.",
    },
  },
  timeline: {
    title: "O que acontece depois",
    items: [
      "Até 31 de dezembro de 2026: contribuições na conta de quem opera (PayPal, transferência ou Wise).",
      "Depois: a soma é repassada ao Sam para reparos na oficina.",
      "Comprovantes opcionais (só valor + data) podem aparecer aqui depois.",
    ],
  },
  imprint: {
    title: "Impressum",
    accordingTo: "Informações conforme o § 5 DDG",
  },
  privacy: {
    title: "Privacidade",
    body: [
      "Esta página não usa cookies de análise e não carrega scripts de terceiros. A escolha de idioma pode ficar no armazenamento do navegador.",
      "Se você transferir pelo banco, o banco processa os dados do pagamento. Se usar o link do PayPal ou da Wise, vale a política de privacidade deles. E-mails que você me envia são guardados para eu responder.",
    ],
  },
  thanks: {
    title: "OBRIGADO",
    lead: "A arrecadação terminou. Juntos reunimos um valor que já foi repassado.",
    eurLabel: "arrecadado em euro",
    copLabel: "repassado (moeda local)",
    toCampaign: "Ver a página da campanha",
    backHome: "Voltar ao agradecimento",
    proofsTitle: "Comprovantes",
  },
};
