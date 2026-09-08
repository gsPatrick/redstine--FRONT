export const mainNav = [
  { label: "Início", href: "/" },
  {
    label: "Comprar",
    href: "/shop",
    columns: [
      {
        label: "RED Construção",
        href: "/categoria-produto/red-construcao",
        items: [
          { label: "Hidráulica", href: "#" },
          { label: "Elétrica", href: "#" },
          { label: "Pisos e Revestimentos", href: "#" },
          { label: "Louças, Metais e Sanitários", href: "#" },
          { label: "Ferragens e Acessórios", href: "#" },
          { label: "Outros", href: "#" },
        ],
      },
      {
        label: "RED Equipamentos",
        href: "/categoria-produto/red-equipamentos",
        items: [
          { label: "Cozinha Industrial", href: "#" },
          { label: "Refrigeração e Conservação", href: "#" },
          { label: "Climatização e Ventilação", href: "#" },
          { label: "Iluminação", href: "#" },
          { label: "TI, Automação e Telefonia", href: "#" },
          { label: "Outros", href: "#" },
        ],
      },
      {
        label: "RED Mobiliário",
        href: "/categoria-produto/red-mobiliario",
        items: [
          { label: "Escritório", href: "#" },
          { label: "Hotelaria", href: "#" },
          { label: "Comércio e Varejo", href: "#" },
          { label: "Residencial", href: "#" },
          { label: "Áreas Externas", href: "#" },
          { label: "Outros", href: "#" },
        ],
      },
    ],
  },
  { label: "Vender", href: "/vender" },
  { label: "Como Funciona", href: "/como-funciona" },
  { label: "Sobre a RED", href: "/sobre-a-red" },
];

export const mobileTabs = [
  { label: "Início", href: "/", icon: "home" },
  { label: "Favoritos", href: "/lista-de-desejos", icon: "heart" },
  { label: "Comprar", href: "/shop", icon: "truck" },
  { label: "Vender", href: "/vender", icon: "account" },
  { label: "Conta", href: "/painel", icon: "user" },
];

export const categories = [
  {
    slug: "red-construcao",
    name: "RED Construção",
    description:
      "Materiais excedentes, componentes reaproveitáveis e itens para obras, reformas e manutenção predial.",
    cta: "Explorar Construção",
  },
  {
    slug: "red-equipamentos",
    name: "RED Equipamentos",
    description:
      "Máquinas, ferramentas e equipamentos técnicos, operacionais e comerciais.",
    cta: "Explorar Equipamentos",
  },
  {
    slug: "red-mobiliario",
    name: "RED Mobiliário",
    description:
      "Mobiliário corporativo, hoteleiro, residencial e operacional.",
    cta: "Explorar Mobiliário",
  },
];
