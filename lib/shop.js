import { buscarNaApi } from "./api-servidor";

/**
 * Capa da página Comprar.
 *
 * O cliente fechou o padrão das capas: "CONTEUDO - SOMENTE TITULO E 2 BOTOES
 * CTA COMPRAR E VENDER". Comprar é capa junto com a Home, então perde o
 * subtítulo e ganha o par de CTAs.
 *
 * O texto que estava no subtítulo não se perdeu: é o subtítulo do bloco de
 * introdução logo abaixo (`shopIntro`), que é onde ele tem espaço para ser
 * lido em vez de disputar a atenção com os botões.
 *
 * "Comprar" aponta para o grid da própria página, porque quem chegou aqui já
 * escolheu comprar — mandá-lo para outra rota seria um círculo.
 */
export const shopHero = {
  title: "Ativos selecionados para obras, empresas e novos projetos",
  actions: [
    { label: "Comprar", href: "#comprar", variant: "solid" },
    { label: "Vender", href: "/vender", variant: "ghost" },
  ],
};

/**
 * Cards de categoria da página Comprar — os cards MAIORES.
 *
 * Revisão do cliente (item 1): os cards com subcategorias saíram da home e
 * vieram para cá. E, como ele autorizou ("os cards menores e maiores podem
 * usar as mesmas imagens dos produtos que vc fez"), as três imagens são as
 * mesmas da home — antes as três repetiam um único JPG genérico, o que fazia
 * os cards parecerem placeholders.
 *
 * `brand` também veio da home: cada frente com a sua cor de contorno. As três
 * páginas passam a ler como o mesmo sistema.
 *
 * Esta lista é a RESERVA: `getShopCategories()` prefere o que a API devolve.
 * Ela existe para a página renderizar no servidor mesmo com a API fora do ar —
 * uma página de catálogo sem as três frentes visíveis é pior que uma com a
 * lista de ontem.
 */
export const shopCategories = [
  {
    name: "RED Construção",
    description: "Materiais e componentes para obras, reformas, manutenção e instalações.",
    cta: "Explorar Construção",
    href: "/categoria-produto/red-construcao",
    image: "/images/2026/08/ChatGPT-Image-3-de-ago.-de-2026-10_35_06.png",
    brand: "red",
    subcategories: [
      "Hidráulica",
      "Elétrica",
      "Pisos e Revestimentos",
      "Louças, Metais e Sanitários",
      "Ferragens e Acessórios",
    ],
  },
  {
    name: "RED Equipamentos",
    description:
      "Máquinas, ferramentas e equipamentos técnicos, operacionais, industriais e comerciais.",
    cta: "Explorar Equipamentos",
    href: "/categoria-produto/red-equipamentos",
    image: "/images/2026/07/Catraca-fundo-branco-.png",
    brand: "green",
    subcategories: [
      "Cozinha Industrial",
      "Refrigeração e Conservação",
      "Climatização e Ventilação",
      "Iluminação",
      "TI, Automação e Telefonia",
    ],
  },
  {
    name: "RED Mobiliário",
    description: "Mobiliário corporativo, hoteleiro, residencial e operacional.",
    cta: "Explorar Mobiliário",
    href: "/categoria-produto/red-mobiliario",
    image: "/images/2026/07/Sofa-fundo-branco-01.png",
    brand: "purple",
    subcategories: [
      "Escritório",
      "Hotelaria",
      "Comércio e Varejo",
      "Residencial",
      "Áreas Externas",
    ],
  },
];

/** Título e subtítulo que abrem a página Comprar, logo abaixo do banner.
 *
 * Item 29: o cliente pediu título abaixo do banner e os cards depois dele.
 * A copy é a que estava na home (bloco de categorias) — ela informa quem já
 * está decidindo a compra, e tirá-la da home é parte do "deixar a home mais
 * leve" do item 1.
 */
export const shopIntro = {
  title: "Encontre ativos para obras, empresas e novos projetos.",
  subtitle:
    "Materiais, equipamentos e mobiliário provenientes de estoques, obras, reformas, desmobilizações e operações corporativas.",
};

/**
 * As três frentes com as subcategorias reais do catálogo.
 *
 * As subcategorias vêm da API (`GET /catalog/categories` traz `subcategorias`)
 * e não de uma lista escrita à mão: quando a curadoria criar uma frente nova,
 * o card a mostra sem deploy. O que a API não tem — imagem, cor da marca e
 * texto do CTA — continua sendo decisão de layout, e vem daqui.
 *
 * O casamento é por `slug`, não por nome: nome é texto editável no painel e
 * quebraria o de-para no primeiro acento corrigido.
 *
 * Assíncrona e chamada no componente de servidor: se a API falhar,
 * `buscarNaApi` devolve null e caímos na lista de reserva acima — a página
 * renderiza igual, sem erro de servidor.
 */
const APRESENTACAO_POR_SLUG = {
  "red-construcao": { image: shopCategories[0].image, brand: "red", cta: "Explorar Construção" },
  "red-equipamentos": {
    image: shopCategories[1].image,
    brand: "green",
    cta: "Explorar Equipamentos",
  },
  "red-mobiliario": { image: shopCategories[2].image, brand: "purple", cta: "Explorar Mobiliário" },
};

export async function getShopCategories() {
  const daApi = await buscarNaApi("/catalog/categories");

  if (!Array.isArray(daApi) || daApi.length === 0) return shopCategories;

  return daApi
    // Só as frentes que este layout sabe apresentar: uma categoria nova criada
    // no painel sem imagem definida entraria como card quebrado.
    .filter((cat) => APRESENTACAO_POR_SLUG[cat.slug])
    .map((cat) => {
      const visual = APRESENTACAO_POR_SLUG[cat.slug];
      const reserva = shopCategories.find((c) => c.href.endsWith(cat.slug));
      return {
        name: cat.name,
        // A descrição da API é a mesma copy aprovada; a de reserva cobre o caso
        // de a categoria vir sem descrição preenchida.
        description: cat.description || reserva?.description || "",
        cta: visual.cta,
        href: `/categoria-produto/${cat.slug}`,
        image: visual.image,
        brand: visual.brand,
        subcategories: (cat.subcategorias ?? [])
          // "Outros" é destino de catálogo, não frente de produto que valha
          // anunciar no card.
          .filter((sub) => sub.name !== "Outros")
          .map((sub) => sub.name),
      };
    });
}

/**
 * Jornada de compra resumida — 4 etapas (itens 6 e 31 da revisão).
 *
 * Eram cinco. O cliente pediu quatro cards, com o processo completo só na
 * página Como Funciona — que não depende desta lista (ela lê `lib/pages.js`),
 * então nada de lá se perde no corte.
 *
 * Qual etapa saiu: "CONFIRMAÇÃO" deixou de ser card próprio e virou a segunda
 * frase de "INTERESSE". Foi a escolhida porque é a única que não acontece em
 * toda compra — na compra direta não existe confirmação a validar. As outras
 * quatro acontecem sempre, e omitir qualquer uma delas seria mentir por
 * omissão: sem escolha não há pedido, sem pedido não há retirada. Mantida como
 * texto, o resumo continua avisando que grandes lotes passam por validação.
 */
export const buyingSteps = [
  {
    title: "ESCOLHA",
    description: "Encontre o ativo e consulte suas informações.",
    image: "/images/2026/08/cloud-computing.png",
  },
  {
    title: "INTERESSE",
    description:
      "Compre diretamente ou solicite confirmação. Quando necessário, disponibilidade, quantidade e condições comerciais são validadas pela RED.",
    image: "/images/2026/08/list.png",
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
