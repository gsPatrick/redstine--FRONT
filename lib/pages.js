const HERO_WAREHOUSE = "/images/2026/07/distribuidora-de-material-de-construcao-1.jpg";
const HERO_STOCK = "/images/2026/07/208303-de-que-modo-o-layout-do-armazem-pode-fazer-diferenca.jpg";
const HERO_NR11 = "/images/2026/07/nr-11-guia-scaled-1.jpeg";

const STEP_ICONS = [
  "/images/2026/08/cloud-computing.png",
  "/images/2026/08/list.png",
  "/images/2026/08/products.png",
  "/images/2026/08/handshake.png",
  "/images/2026/08/bar-chart.png",
];

export const vender = {
  hero: {
    image: HERO_STOCK,
    title: "Transforme ativos em novas oportunidades de receita",
    subtitle:
      "Envie materiais, equipamentos ou mobiliário para avaliação e conte com uma estrutura especializada para sua comercialização.",
    actions: [{ label: "Enviar Ativos", href: "#enviar", variant: "solid" }],
  },
  originsTitle: "Ativos de estoques, obras e operações corporativas",
  origins: [
    {
      title: "RED CONSTRUÇÃO",
      items: [
        "Materiais excedentes",
        "Saldos de obra",
        "Materiais sem uso",
        "Componentes reaproveitáveis",
        "Itens de reformas e manutenção",
        "Lotes de desmobilizações",
      ],
    },
    {
      title: "RED EQUIPAMENTOS",
      items: [
        "Máquinas",
        "Ferramentas",
        "Equipamentos técnicos",
        "Operacionais",
        "Industriais",
        "Comerciais",
        "Ativos substituídos ou desativados",
      ],
    },
    {
      title: "RED MOBILIÁRIO",
      items: [
        "Mobiliário corporativo",
        "Hoteleiro",
        "Residencial",
        "Operacional",
        "Armazenagem e apoio",
        "Lotes de mudanças e desmobilizações",
      ],
    },
  ],
  sourcingTitle: "Captação com procedência profissional e empresarial",
  sourcing:
    "• Construtoras • Incorporadoras • Demolidoras • Hotéis • Indústrias • Redes comerciais • Empresas em mudança ou desmobilização • Administradoras patrimoniais • Escritórios de arquitetura • Arquitetos • Empresas de engenharia • Engenheiros • Profissionais qualificados",
  benefitsTitle: "Uma solução sem precisar criar e gerir uma operação própria",
  benefits: [
    {
      title: "MENOS ESFORÇO COMERCIAL",
      description: "A RED organiza publicação, atendimento e negociação com os interessados.",
    },
    {
      title: "MAIS ORGANIZAÇÃO",
      description:
        "Informações, disponibilidade e condições permanecem estruturadas durante a operação.",
    },
    {
      title: "MAIS CONTROLE",
      description: "Acompanhamento mais claro sobre ativos, propostas e condições acordadas.",
    },
    {
      title: "RECUPERAÇÃO DE VALOR",
      description:
        "Ativos sem uso podem retornar ao mercado por meio de uma operação comercial organizada.",
    },
  ],
  editorNote: "alterar imagens para numeros",
  stepsTitle: "Do envio ao repasse",
  steps: [
    {
      title: "ENVIO",
      description: "Você encaminha informações, fotografias e localização dos ativos.",
      image: STEP_ICONS[0],
    },
    {
      title: "AVALIAÇÃO",
      description: "A RED verifica condição, quantidade, logística e potencial comercial.",
      image: STEP_ICONS[1],
    },
    {
      title: "MODELO E PREÇO",
      description: "Definimos a estrutura comercial e as condições da operação.",
      image: STEP_ICONS[2],
    },
    {
      title: "APROVAÇÃO",
      description: "Você aprova preço, modelo e responsabilidades.",
      image: STEP_ICONS[3],
    },
    {
      title: "PUBLICAÇÃO",
      description: "Os ativos aprovados entram no catálogo.",
      image: STEP_ICONS[4],
    },
    {
      title: "COMERCIALIZAÇÃO",
      description: "A RED conduz atendimento e negociação.",
      image: STEP_ICONS[4],
    },
    {
      title: "VENDA E REPASSE",
      description: "Os valores são distribuídos conforme o modelo acordado.",
      image: STEP_ICONS[4],
    },
  ],
  stepsCta: { label: "Entenda o Processo", href: "/como-funciona" },
  modelsTitle: "Independente do modelo, ativo, e localização. A RED controla a operação",
  models: [
    {
      title: "RED Estoque",
      description: "O ativo permanece no estoque da RED.",
      cta: "RED Estoque",
      href: "/entenda-os-modelos#estoque",
    },
    {
      title: "RED CATÁLOGO",
      description: "O ativo permanece com o fornecedor até a venda.",
      cta: "RED Catálogo",
      href: "/entenda-os-modelos#catalogo",
    },
  ],
  formTitle: "Envie seus ativos para avaliação",
  formNote:
    "* O envio não garante a publicação. Todos os ativos passam por avaliação antes de integrar o catálogo.",
  ctaTitle: "Descubra a estrutura comercial ideal para os seus ativos",
  ctaAction: { label: "Modelos comerciais", href: "/entenda-os-modelos" },
};

export const comoFunciona = {
  hero: {
    image: HERO_NR11,
    title: "Da identificação do ativo à conclusão da venda",
    subtitle:
      "Cada operação segue etapas definidas de avaliação, aprovação, organização, comercialização e destinação.",
    actions: [
      { label: "Modelos Comerciais", href: "/entenda-os-modelos#estoque", variant: "solid" },
    ],
  },
  editorNote: "alterar imagens para numeros",
  stepsTitle: "Um processo estruturado de ponta a ponta",
  steps: [
    {
      title: "IDENTIFICAÇÃO OU ENVIO",
      description: "O fornecedor apresenta os ativos e suas informações iniciais.",
      image: STEP_ICONS[0],
    },
    {
      title: "AVALIAÇÃO",
      description:
        "A RED analisa categoria, condição, quantidade, procedência, documentação, localização, logística e potencial comercial.",
      image: STEP_ICONS[1],
    },
    {
      title: "PRECIFICAÇÃO E MODELO",
      description:
        "Preço e estrutura comercial são recomendados conforme mercado, condição, custos, localização e potencial de giro.",
      image: STEP_ICONS[2],
    },
    {
      title: "APROVAÇÃO",
      description:
        "O fornecedor aprova preço, modelo, responsabilidades e condições da operação.",
      image: STEP_ICONS[3],
    },
    {
      title: "ORGANIZAÇÃO E PUBLICAÇÃO",
      description:
        "A RED classifica os ativos, organiza imagens e informações e publica os itens aprovados.",
      image: STEP_ICONS[4],
    },
    {
      title: "COMERCIALIZAÇÃO",
      description:
        "A RED conduz atendimento, confirmação de disponibilidade, propostas e negociação.",
      image: STEP_ICONS[4],
    },
    {
      title: "RETIRADA E CARREGAMENTO",
      description:
        "Responsabilidades e logística são definidas conforme características e localização do ativo.",
      image: STEP_ICONS[4],
    },
    {
      title: "VENDA E REPASSE",
      description:
        "A operação é registrada e o resultado distribuído conforme as condições acordadas.",
      image: STEP_ICONS[4],
    },
  ],
  curationTitle: "Todos os ativos selecionados foram avaliados e validados",
  curation: [
    {
      title: "ANALISA",
      items: [
        "Condição",
        "Quantidade",
        "Procedência",
        "Localização",
        "Logística",
        "Preço",
        "Potencial comercial",
      ],
    },
    {
      title: "ORGANIZA",
      items: ["Classificação", "Imagens", "Descrição", "Atributos", "Informações comerciais"],
    },
    {
      title: "CONTROLA",
      items: [
        "Publicação",
        "Disponibilidade",
        "Atualizações",
        "Atendimento",
        "Propostas",
        "Negociação",
      ],
    },
  ],
  curationCta: { label: "Enviar Ativos", href: "/painel/vender/enviar" },
  bridgeTitle: "Uma ponte segura de mão dupla entre você e boas oportunidades",
  bridge: [
    {
      kicker: "Se você compra",
      flow: "Explore → Escolha → Confirme → Retire",
      cta: "Comprar",
      href: "/shop",
    },
    {
      kicker: "Se você vende",
      flow: "Envie → Aprove → Acompanhe → Receba",
      cta: "Vender",
      href: "/vender",
    },
  ],
  faqTitle: "Perguntas frequentes – FAQ",
  faq: [
    { q: "Todo ativo enviado será publicado?", a: "Não. Todos passam por avaliação." },
    {
      q: "Preciso transportar o ativo para a RED?",
      a: "Não necessariamente. Depende do modelo comercial.",
    },
    { q: "Quem define o preço?", a: "RED e fornecedor definem em conjunto." },
    { q: "Quem publica os ativos?", a: "A RED." },
    {
      q: "Quem atende e negocia com os compradores?",
      a: "A RED centraliza a gestão comercial.",
    },
    {
      q: "Como funciona a divisão do resultado?",
      a: "A divisão varia conforme o modelo comercial adotado.",
    },
    { q: "Quem cuida da retirada?", a: "Depende do ativo e das condições acordadas." },
    {
      q: "Posso vender apenas parte de um lote?",
      a: "Quando o fracionamento estiver previsto na operação.",
    },
    { q: "A RED garante a venda?", a: "Não." },
    {
      q: "Como começo?",
      a: "Envie os seus ativos para avaliação pelo formulário da página Vender.",
    },
  ],
  ctaTitle: "Comece pela avaliação ou explore os ativos disponíveis",
  ctaActions: [
    { label: "Enviar Ativos", href: "/painel/vender/enviar", variant: "accent" },
    { label: "Explorar Ativos", href: "/shop", variant: "outline" },
  ],
};

export const sobreRed = {
  hero: {
    image: HERO_WAREHOUSE,
    title: "Transformar ativos parados em valor em movimento",
    subtitle:
      "A RED é um ecossistema de circulação de ativos, capaz de criar um ciclo contínuo de recuperação de valor.",
  },
  featureImage: "/images/2026/07/norma-nr-11-movimenta-manuseio-transporte-de-materiais-1200x675-1.webp",
  problemTitle: "Muito valor é perdido até um ativo encontrar um novo destino",
  problem: [
    "Materiais, equipamentos e mobiliário podem permanecer sem uso, perder valor, ser vendidos de forma pouco estruturada ou ser destinados sem controle adequado.",
    "Foi nesse espaço que a RED identificou uma oportunidade de criar uma operação especializada fundamentada em três pilares.",
  ],
  pillarsTitle: "Circularidade, logística reversa e controle patrimonial aplicados",
  pillars: [
    {
      title: "ECONOMIA CIRCULAR",
      description:
        "Manter materiais, equipamentos e mobiliário em circulação por mais tempo.",
    },
    {
      title: "LOGÍSTICA REVERSA",
      description:
        "Organizar o caminho dos ativos entre origem, armazenamento, comercialização e novo uso.",
    },
    {
      title: "PREVENÇÃO E MITIGAÇÃO DE PERDAS",
      description:
        "Identificar e controlar ativos antes de desmontes, reformas e desmobilizações, preservando valor patrimonial.",
    },
  ],
  fieldTitle: "O modelo começou no campo antes de chegar à plataforma.",
  field: [
    "A RED nasceu, foi desenvolvida e validada a partir de experiências reais com inventários, desmontes, retirada, armazenamento, precificação, negociação e destinação de ativos.",
    "Essas operações permitiram compreender e otimizar na prática desafios como:",
  ],
  fieldChain:
    "Identificação – Separação – Armazenamento – Precificação – Logística – Comercialização – Destinação",
  missionTitle: "Reconhecer e circular valor antes que ele seja perdido",
  mission:
    "Desenvolver uma estrutura cada vez mais eficiente para ampliar o reaproveitamento, recuperar valor econômico e melhorar o controle sobre a destinação de ativos.",
  ctaTitle: "Faça parte desse novo ciclo de utilização",
  ctaActions: [
    { label: "Explorar Ativos", href: "/shop", variant: "accent" },
    { label: "Enviar Ativos", href: "/painel/vender/enviar", variant: "outline" },
  ],
};

export const entendaOProcesso = {
  hero: {
    image: HERO_STOCK,
    title: "Um processo organizado do início ao fim.",
    subtitle:
      "A RED acompanha todas as etapas da comercialização para oferecer mais organização, transparência e segurança a compradores e fornecedores.",
  },
  timeline: [
    "Envio do Ativo",
    "Curadoria RED",
    "Publicação",
    "Negociação",
    "Conclusão da Venda",
  ],
  blocks: [
    {
      index: "1",
      title: "Tudo começa pela avaliação",
      description:
        "Cada ativo é analisado antes de ser publicado. A equipe considera condição, demanda, potencial comercial, logística e documentação disponível para definir a melhor estratégia de comercialização.",
    },
    {
      index: "2",
      title: "Publicação e negociação",
      description:
        "Após a aprovação, o ativo passa a integrar o catálogo RED ou o estoque físico, conforme o modelo comercial adotado. A partir desse momento, a RED centraliza o relacionamento com os compradores interessados.",
    },
    {
      index: "3",
      title: "Acompanhamento até a conclusão",
      description:
        "A RED acompanha toda a negociação, organizando as etapas comerciais e mantendo fornecedores e compradores informados durante o processo.",
    },
  ],
  ctaAction: { label: "Conheça os Modelos Comerciais", href: "/entenda-os-modelos" },
};

export const entendaOsModelos = {
  hero: {
    image: HERO_WAREHOUSE,
    title: "Dois modelos comerciais. A mesma gestão especializada",
    subtitle:
      "A estrutura é definida conforme as características do ativo, sua localização, volume, logística e potencial de comercialização.",
    actions: [{ label: "Enviar Ativos", href: "/painel/vender/enviar", variant: "solid" }],
  },
  models: [
    {
      id: "estoque",
      name: "RED Estoque",
      claim: "O ativo permanece no estoque da RED.",
      intro:
        "Indicado para operações em que o recebimento e armazenamento físico pela RED sejam mais adequados.",
      redDuties: [
        "Receber os ativos",
        "Conferir as informações",
        "Organizar o armazenamento",
        "Preservar identificação",
        "Preparar exposição",
        "Publicar e divulgar",
        "Atender compradores",
        "Conduzir negociações",
        "Acompanhar retirada ou entrega conforme acordado",
      ],
      supplierDuties: [
        "Fornecer informações corretas",
        "Comprovar autorização sobre os ativos",
        "Aprovar preço e condições",
        "Disponibilizar os ativos no prazo combinado",
        "Informar limitações relevantes",
      ],
      split: { supplier: "50% FORNECEDOR", red: "50% RED" },
      bestFor: [
        "Ativos com bom potencial de giro",
        "Materiais de fácil armazenagem",
        "Lotes que precisam sair da origem",
        "Ativos compatíveis com a capacidade do estoque",
      ],
    },
    {
      id: "catalogo",
      name: "RED Catálogo",
      claim: "O ativo permanece com o fornecedor até a venda",
      intro:
        "Indicado para operações em que a guarda na origem seja mais eficiente, enquanto a RED assume a gestão comercial.",
      redDuties: [
        "Avaliar e classificar",
        "Organizar informações",
        "Cadastrar e publicar",
        "Divulgar",
        "Atender interessados",
        "Conduzir propostas e negociações",
        "Acompanhar a comercialização",
      ],
      supplierDuties: [
        "Manter a guarda física",
        "Preservar quantidade e condição",
        "Confirmar disponibilidade",
        "Comunicar alterações",
        "Permitir visitas quando acordadas",
        "Liberar os ativos após a venda",
      ],
      split: { supplier: "65% FORNECEDOR", red: "35% RED" },
      bestFor: [
        "Grandes lotes",
        "Equipamentos",
        "Ativos volumosos",
        "Materiais distantes do estoque RED",
        "Operações em que movimentação antecipada aumentaria custos",
      ],
    },
  ],
  pricingTitle: "O preço é definido em conjunto",
  pricingLead: "A RED apresenta uma recomendação considerando:",
  pricingItems: [
    "Condição",
    "Quantidade",
    "Valor de mercado",
    "Localização",
    "Logística",
    "Custos aplicáveis",
    "Potencial comercial",
    "Fracionamento",
    "Prazo disponível",
  ],
  pricingNote: "O fornecedor aprova as condições antes da publicação.",
  pricingWarning: "* Nenhum ativo é comercializado por preço não autorizado.",
  criteriaTitle: "Cada operação exige uma estrutura diferente",
  criteriaLead: "A definição considera principalmente:",
  criteria: [
    { title: "VOLUME E DIMENSÕES", description: "" },
    { title: "LOCALIZAÇÃO", description: "Influencia custo e eficiência logística." },
    {
      title: "LOGÍSTICA",
      description: "Peso, carregamento, desmontagem e transporte são avaliados.",
    },
    { title: "CONDIÇÃO", description: "Determina exigências de guarda e conservação." },
    {
      title: "POTENCIAL DE GIRO",
      description: "Ativos de maior demanda podem justificar estoque físico.",
    },
    {
      title: "CAPACIDADE DO ESTOQUE",
      description: "O RED Estoque depende de espaço e estrutura disponíveis.",
    },
    {
      title: "PRAZO",
      description: "A urgência de retirada da origem também influencia a decisão.",
    },
  ],
  criteriaCta: { label: "Entenda o Processo", href: "/como-funciona" },
  compareTitle: "Compare os modelos",
  compare: {
    columns: ["RED Estoque", "RED Catálogo"],
    rows: [
      { label: "Onde fica o ativo", values: ["Estoque RED", "Fornecedor"] },
      { label: "Quem faz a guarda", values: ["RED", "Fornecedor"] },
      { label: "Gestão comercial", values: ["RED", "RED"] },
      { label: "Resultado fornecedor", values: ["50%", "65%"] },
      { label: "Resultado RED", values: ["50%", "35%"] },
      {
        label: "Mais indicado para",
        values: [
          "Ativos compatíveis com recebimento e armazenamento",
          "Grandes lotes, equipamentos e ativos volumosos",
        ],
      },
    ],
  },
  faqTitle: "Perguntas frequentes sobre os modelos - FAQ",
  faq: [
    {
      q: "Posso escolher livremente qualquer modelo?",
      a: "A preferência é considerada, mas a definição depende da viabilidade comercial, operacional e logística.",
    },
    {
      q: "O modelo pode mudar depois da publicação?",
      a: "Sim, desde que as partes concordem e a alteração seja viável.",
    },
    {
      q: "No RED Catálogo o fornecedor negocia diretamente com o comprador?",
      a: "Não. A guarda permanece com o fornecedor, mas a gestão comercial é conduzida pela RED.",
    },
    {
      q: "Existem outros custos além do percentual?",
      a: "Qualquer custo aplicável deve ser informado e acordado previamente.",
    },
    {
      q: "A divisão é calculada sobre qual valor?",
      a: "Sobre o resultado efetivo da operação, conforme as condições comerciais acordadas.",
    },
    {
      q: "A RED garante a venda?",
      a: "Não. A RED conduz a comercialização, mas não garante prazo ou conclusão.",
    },
    {
      q: "Como descubro qual modelo é adequado?",
      a: "Envie os ativos para avaliação. A RED recomendará a estrutura mais adequada.",
    },
  ],
  ctaTitle: "Descubra qual modelo faz sentido para seus ativos",
  ctaAction: { label: "Enviar Ativos", href: "/painel/vender/enviar" },
};

export const contato = {
  hero: {
    image: HERO_WAREHOUSE,
    title: "Fale com a RED",
    subtitle:
      "Nossa equipe está disponível para orientar compras, avaliar oportunidades comerciais e receber dúvidas, propostas e sugestões.",
  },
  channelsTitle: "Acesse nossos canais de atendimento",
  channels: [
    {
      kicker: "WHATSAPP",
      description: "Para consultas comerciais e atendimento rápido.",
      cta: "Falar pelo WhatsApp",
      href: "https://wa.me/5521997469757",
      external: true,
    },
    {
      kicker: "E-MAIL",
      description: "Para documentos, propostas, parcerias e contatos institucionais.",
      cta: "Enviar e-mail",
      href: "mailto:contato@redestine.com.br",
      external: true,
    },
    { kicker: "LOCALIZAÇÃO", description: "[Cidade / Estado]" },
    { kicker: "HORÁRIO", description: "[Horário oficial de atendimento]" },
  ],
  noticeTitle: "Visitas e retiradas devem ser agendadas",
  notice:
    "Os ativos podem estar no estoque da RED ou permanecer com o fornecedor. Por isso, visitas, inspeções e retiradas devem ser confirmadas previamente.",
  noticeCta: { label: "Fale com a RED", href: "https://wa.me/5521997469757" },
  ctaTitle: "Procura um ativo ou possui uma oportunidade?",
  ctaActions: [
    { label: "Explorar Ativos", href: "/shop", variant: "accent" },
    { label: "Enviar Ativos", href: "/painel/vender/enviar", variant: "outline" },
  ],
};

export const paginaLoja = {
  hero: {
    image: HERO_WAREHOUSE,
    title: "Titulo da loja",
    subtitle: "Descrição",
    actions: [
      { label: "botão", href: "/shop", variant: "solid" },
      { label: "botão", href: "/vender", variant: "ghost" },
    ],
  },
  featuredTitle: "Confira nossas melhores opções",
  assetsTitle: "Ativos em destaque",
  exploreKicker: "explore por",
  exploreTitle: "Categoria",
  exploreCards: [
    {
      name: "RED Construção",
      description: "Materiais novos excedentes, reaproveitados e componentes de obra.",
      cta: "Acessar",
      href: "/categoria-produto/red-construcao",
      image: "/images/2026/07/5-625x510-1.jpg",
    },
    {
      name: "RED Equipamentos",
      description: "Equipamentos técnicos, comerciais, industriais e operacionais.",
      cta: "Acessar",
      href: "/categoria-produto/red-equipamentos",
      image: "/images/2026/07/5-625x510-1.jpg",
    },
    {
      name: "RED Mobiliário",
      description: "Mobiliário corporativo, hotelaria, escritório e itens decorativos.",
      cta: "Acessar",
      href: "/categoria-produto/red-mobiliario",
      image: "/images/2026/07/5-625x510-1.jpg",
    },
  ],
  novelties: [
    { kicker: "novidades em", title: "Construção", slug: "red-construcao" },
    { kicker: "novidades em", title: "Equipamentos", slug: "red-equipamentos" },
    { kicker: "novidades em", title: "Mobiliário", slug: "red-mobiliario" },
  ],
  extraKicker: "extra",
  extraTitle: "Campo Extra",
  extraBoxes: [
    {
      title: "This is the heading",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.",
    },
    {
      title: "This is the heading",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.",
    },
    {
      title: "This is the heading",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.",
    },
  ],
  closingTitle: "campo extra",
  closingText: "descrição",
  closingActions: [
    { label: "botão", href: "/shop", variant: "accent" },
    { label: "botão", href: "/vender", variant: "outline" },
  ],
};
