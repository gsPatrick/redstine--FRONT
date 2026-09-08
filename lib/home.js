export const introText =
  "A RED transforma materiais, equipamentos e mobiliário em novas oportunidades de negócio, gerando receita para quem disponibiliza, economia para quem compra e mais controle sobre a destinação dos ativos.";

export const introHighlights = [
  "Curadoria especializada",
  "Ativos selecionados",
  "Operação comercial assistida",
];

export const categoryCards = [
  {
    name: "RED Construção",
    description:
      "Materiais excedentes, componentes reaproveitáveis e itens para obras, reformas e manutenção.",
    cta: "Explorar Construção",
    href: "/categoria-produto/red-construcao",
    // provisorio: foto real do catalogo ate o cliente enviar as definitivas
    image: "/images/2026/08/ChatGPT-Image-3-de-ago.-de-2026-10_35_06.png",
    brand: "red",
  },
  {
    name: "RED Equipamentos",
    description:
      "Máquinas, ferramentas e equipamentos técnicos, operacionais e comerciais.",
    cta: "Explorar Equipamentos",
    href: "/categoria-produto/red-equipamentos",
    image: "/images/2026/07/Catraca-fundo-branco-.png",
    brand: "green",
  },
  {
    name: "RED Mobiliário",
    description:
      "Mobiliário corporativo, hoteleiro, residencial e operacional.",
    cta: "Explorar Mobiliário",
    href: "/categoria-produto/red-mobiliario",
    image: "/images/2026/07/Sofa-fundo-branco-01.png",
    brand: "purple",
  },
];

export const participation = [
  {
    kicker: "QUER COMPRAR?",
    description:
      "Encontre materiais, equipamentos e mobiliário disponíveis para sua obra, empresa ou projeto.",
    cta: "Explorar Ativos",
    href: "/shop",
    image: "/images/2026/07/poltrona_zon_797_1_68ebad8ecfd7fdddd4869472441fab4d.webp",
  },
  {
    kicker: "QUER VENDER?",
    description:
      "Envie seus ativos para avaliação e descubra o modelo comercial mais adequado à sua operação.",
    cta: "Enviar Ativos",
    href: "/vender",
    image:
      "/images/2026/07/quanto-custa-para-comprar-caixas-de-papelao-em-grande-volume.jpg",
  },
];

export const efficiency = [
  {
    title: "COMPRA MAIS EFICIENTE",
    description:
      "Acesso a ativos selecionados por valores competitivos em relação a produtos equivalentes.",
  },
  {
    title: "INFORMAÇÃO ORGANIZADA",
    description:
      "Condição, quantidade, localização e características reunidas para facilitar a decisão.",
  },
  {
    title: "GESTÃO COMERCIAL",
    description:
      "Atendimento, propostas e negociações conduzidos e centralizados pela equipe da RED.",
  },
  {
    title: "CONTROLE E DESTINAÇÃO",
    description:
      "Mais organização, transparência e rastreabilidade sobre os ativos disponíveis.",
  },
];

export const processSteps = [
  {
    title: "Envio ou Identificação",
    description: "O fornecedor apresenta os ativos ou solicita apoio para identificá-los.",
    image: "/images/2026/08/cloud-computing.png",
  },
  {
    title: "Avaliação e Curadoria",
    description:
      "A RED analisa condição, quantidade, potencial comercial, documentação e logística.",
    image: "/images/2026/08/list.png",
  },
  {
    title: "Organização e Publicação",
    description:
      "Os ativos aprovados têm suas informações padronizadas e são publicados no catálogo.",
    image: "/images/2026/08/products.png",
  },
  {
    title: "Comercialização",
    description: "A RED conduz atendimento, propostas e negociações.",
    image: "/images/2026/08/handshake.png",
  },
  {
    title: "Resultado",
    description:
      "Venda, retirada e repasse seguem as condições comerciais previamente acordadas.",
    image: "/images/2026/08/bar-chart.png",
  },
];

export const curationPoints = [
  { label: "Avaliação especializada", tone: "deep", shape: "left" },
  { label: "Informações padronizadas", tone: "bright", shape: "right" },
  { label: "Publicação controlada", tone: "deep", shape: "left" },
  { label: "Gestão comercial centralizada", tone: "bright", shape: "right" },
];

export const commercialModels = [
  {
    title: "RED Estoque",
    description:
      "O ativo fica no estoque da RED, que assume armazenamento, exposição e comercialização.",
    cta: "RED Estoque",
    href: "/entenda-os-modelos#estoque",
    image:
      "/images/2026/07/208303-de-que-modo-o-layout-do-armazem-pode-fazer-diferenca.jpg",
  },
  {
    title: "RED Catálogo",
    description:
      "O ativo permanece com o fornecedor enquanto a RED conduz sua comercialização pelo catálogo on-line.",
    cta: "RED Catálogo",
    href: "/entenda-os-modelos#catalogo",
    // Produto em fundo branco: lê como anúncio de catálogo, não como estoque
    // físico — que é o que o cliente pediu para este modelo. O ideal continua
    // sendo uma captura do próprio catálogo do site, quando existir.
    image: "/images/2026/07/Difusor-plenum-linerar-fundo-branco-01-.png",
  },
];

export const audiences = [
  { prefix: "Vendedores:", words: ["empresas", "profissionais qualificados"] },
  { prefix: "Compradores:", words: ["empresas", "profissionais", "consumidores"] },
];

export const circularity = {
  title: "Quem compra hoje pode disponibilizar amanhã.",
  subtitle:
    "Materiais, equipamentos e mobiliário podem passar por diferentes operações e permanecer produtivos por mais tempo, reduzindo perdas e ampliando seu aproveitamento.",
  items: [
    "Maior aproveitamento",
    "Redução de perdas",
    "Destinação organizada",
    "Novos ciclos de uso",
    "Circularidade aplicada",
  ],
  cta: null,
};

// Rascunho de copy — o cliente disse "precos ate 50% do preco de mercado,
// isso nao pode deixar de ser percebido pelo usuario", com a restricao
// "sem splash de preco". Texto sujeito a revisao dele.
export const priceClaim = {
  kicker: "Condição comercial",
  lead: "Ativos por até",
  figure: "50%",
  trail: "do preço de mercado",
  support:
    "Cada ativo passa pela curadoria RED antes de entrar no catálogo. Preço competitivo, procedência verificada e condição informada.",
  cta: { label: "Explorar Ativos", href: "/shop" },
};

/**
 * Bloco "Operação Real" — grid de fotos reais de operações e produtos.
 *
 * Duas linhas de quatro. São fotos do próprio acervo: operações, materiais
 * armazenados e produtos comercializados. Quando o cliente enviar o material
 * definitivo, troca-se esta lista e nada mais.
 */
export const realOperation = [
  { src: "/images/2026/07/Fundo-galpao-01-3-768x576.png", alt: "Materiais paletizados no galpão" },
  { src: "/images/2026/07/Fundo-Galpao-01-4.png", alt: "Lote conferido e identificado" },
  { src: "/images/2026/07/Catraca-fundo-galpao-01.png", alt: "Equipamento de controle de acesso" },
  { src: "/images/2026/07/Cooler-axial-fundo-galpao-01-.png", alt: "Cooler axial industrial" },
  { src: "/images/2026/07/DIFUSOR-LINEAR-142x12-fundo-galpao-01-.png", alt: "Difusores lineares em lote" },
  { src: "/images/2026/07/Cadeira-estofada-preta-fundo-galpao-01.png", alt: "Mobiliário corporativo desmobilizado" },
  { src: "/images/2026/07/Cama-box-de-viuva-fundo-galpao-01.png", alt: "Mobiliário hoteleiro armazenado" },
  { src: "/images/2026/07/Difusor-plenum-linear-fundo-galpao-01-.png", alt: "Plenum linear pronto para retirada" },
];

/**
 * Ecossistema de parceiros.
 *
 * Lista vazia até o cliente enviar os logotipos — a estrutura é escalável e
 * aceita fornecedores, compradores e operadores sem mudar. Com a lista vazia o
 * bloco mostra os espaços reservados, para o layout ficar visível sem inventar
 * marcas que não participam do ecossistema.
 */
export const partners = [];

/**
 * Grid de operação real da página Sobre a RED.
 *
 * Fotos DIFERENTES das da home, como pedido — o mesmo conjunto nas duas
 * páginas faria a segunda parecer repetição em vez de acervo.
 */
export const aboutOperation = [
  { src: "/images/2026/07/Catraca-fundo-galpao-02.png", alt: "Controle de acesso armazenado" },
  { src: "/images/2026/07/Fundo-galpao-01-1.png", alt: "Lote identificado no galpão" },
  { src: "/images/2026/07/Cadeira-Fundo-Galpao-01.png", alt: "Mobiliário corporativo em estoque" },
  { src: "/images/2026/07/GRELHA-AH-106x36-fundo-galpao-01-.png", alt: "Grelhas em lote" },
  { src: "/images/2026/07/Toalheiro-fundo-Gaolao-01.png", alt: "Itens hoteleiros separados" },
  { src: "/images/2026/07/Fundo-galpao-01-10.png", alt: "Materiais paletizados" },
  { src: "/images/2026/07/Pedra-Sinterizada-fundo-Galpao-01-.png", alt: "Revestimentos armazenados" },
  { src: "/images/2026/07/Fundo-galpao-01-11.png", alt: "Conferência de material" },
];
