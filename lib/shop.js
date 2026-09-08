export const shopHero = {
  title: "Ativos selecionados para obras, empresas e novos projetos",
  subtitle:
    "Explore materiais de construção, equipamentos e mobiliário excedentes, sem uso, seminovos ou reaproveitáveis.",
  // Um CTA por capa interna, o da ação principal da página — mesmo critério
  // que o cliente definiu para Vender e Como Funciona. "Como Comprar" saiu:
  // é conteúdo da própria página, alcançável por rolagem.
  actions: [{ label: "Explorar Ativos", href: "#comprar", variant: "solid" }],
};

export const shopCategories = [
  {
    name: "RED Construção",
    description: "Materiais e componentes para obras, reformas, manutenção e instalações.",
    cta: "Explorar Construção",
    href: "/categoria-produto/red-construcao",
    image: "/images/2026/07/5-625x510-1.jpg",
  },
  {
    name: "RED Equipamentos",
    description:
      "Máquinas, ferramentas e equipamentos técnicos, operacionais, industriais e comerciais.",
    cta: "Explorar Equipamentos",
    href: "/categoria-produto/red-equipamentos",
    image: "/images/2026/07/5-625x510-1.jpg",
  },
  {
    name: "RED Mobiliário",
    description: "Mobiliário corporativo, hoteleiro, residencial e operacional.",
    cta: "Explorar Mobiliário",
    href: "/categoria-produto/red-mobiliario",
    image: "/images/2026/07/5-625x510-1.jpg",
  },
];

export const buyingSteps = [
  {
    title: "ESCOLHA",
    description: "Encontre o ativo e consulte suas informações.",
    image: "/images/2026/08/cloud-computing.png",
  },
  {
    title: "INTERESSE",
    description: "Compre diretamente ou solicite confirmação, conforme a modalidade.",
    image: "/images/2026/08/list.png",
  },
  {
    title: "CONFIRMAÇÃO",
    description:
      "Disponibilidade, quantidade e condições comerciais são validadas quando necessário.",
    image: "/images/2026/08/products.png",
  },
  {
    title: "PEDIDO OU PROPOSTA",
    description: "A compra é concluída ou a proposta é formalizada.",
    image: "/images/2026/08/handshake.png",
  },
  {
    title: "RETIRADA",
    description: "Carregamento e transporte seguem as condições indicadas para o ativo.",
    image: "/images/2026/08/bar-chart.png",
  },
];

export const buyingModes = [
  {
    title: "COMPRA DIRETA",
    description:
      "Para ativos com preço, quantidade e condições retirada previamente definidos.",
    cta: "Comprar",
    href: "/shop#comprar",
  },
  {
    title: "SOB CONSULTA",
    description:
      "Para grandes lotes, equipamentos, ativos volumosos ou operações sujeitas a confirmação ou logística especial.",
    cta: "Consultar Condições",
    href: "https://wa.me/5521997469757",
  },
];
