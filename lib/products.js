import { buscarNaApi } from "./api-servidor";

/**
 * Catálogo público.
 *
 * Lê da API. A forma de cada ativo já vem pronta para a vitrine — imagens em
 * `images[].src`, categorias em `categories[]`, condição por extenso e a ficha
 * técnica montada. Nada é remodelado aqui: quem serve o front é a API.
 *
 * Todas as funções são assíncronas. Onde o site antes importava uma constante,
 * agora aguarda o dado — as páginas viraram componentes de servidor `async`.
 */

export const productCategories = [
  { slug: "red-construcao", name: "RED Construção" },
  { slug: "red-equipamentos", name: "RED Equipamentos" },
  { slug: "red-mobiliario", name: "RED Mobiliário" },
];

const qs = (filtros = {}) => {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(filtros)) {
    if (v !== undefined && v !== null && v !== "") p.set(k, v);
  }
  const s = p.toString();
  return s ? `?${s}` : "";
};

/** Lista de ativos publicados. Lista vazia quando a API não responde. */
export async function getProducts(filtros = {}) {
  const r = await buscarNaApi(`/assets${qs({ perPage: 100, ...filtros })}`);
  return r?.data ?? [];
}

/**
 * Catálogo com as opções de filtro que o servidor calcula.
 *
 * Separado de `getProducts` porque aqui o `meta` importa: as facetas vêm da
 * API para que o ativo esgotado saia das opções de filtro sem sair da vitrine.
 * Derivar as facetas dos produtos recebidos — como era feito — tornava as duas
 * coisas incompatíveis: para tirar a marca do filtro seria preciso tirar o
 * ativo da lista, e aí a URL dele passaria a dar 404 a cada esgotamento.
 */
export async function getCatalogo(filtros = {}) {
  const r = await buscarNaApi(`/assets${qs({ perPage: 100, ...filtros })}`);
  return { produtos: r?.data ?? [], filtros: r?.meta?.filtros ?? null };
}

export async function getProduct(slug) {
  return buscarNaApi(`/assets/slug/${encodeURIComponent(slug)}`);
}

export async function getProductsByCategory(slug) {
  return getProducts({ category: slug });
}

/**
 * Destaques do carrossel.
 *
 * A intercalação entre as três categorias acontece na API — o acervo é
 * desbalanceado e pegar os primeiros N encheria a vitrine de uma categoria só.
 */
export async function getFeaturedProducts(limit = 9) {
  return (await buscarNaApi(`/assets/featured?limit=${limit}`)) ?? [];
}

/** Busca por termo. Quem filtra é o banco, não o navegador. */
export async function searchProducts(term) {
  const t = (term || "").trim();
  return getProducts(t ? { search: t } : {});
}

export function formatPrice(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value) || 0);
}
