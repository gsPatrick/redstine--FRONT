/**
 * Vocabulário do ativo, num lugar só — espelho de src/config/constants.js.
 *
 * Repetir estas listas em cada tela é como nasce a divergência em que o
 * formulário oferece uma opção que a API recusa.
 */
export const ROTULO_STATUS_ATIVO = {
  rascunho: "Rascunho",
  em_avaliacao: "Em avaliação",
  aguardando_aprovacao: "Aguardando aprovação",
  aprovado: "Aprovado",
  publicado: "Publicado",
  vendido: "Vendido",
  inativo: "Inativo",
};

/**
 * Transições permitidas, iguais às da API.
 *
 * O front usa isto só para não oferecer um botão que a API recusaria — a regra
 * de verdade continua no servidor. Repare que `inativo` não leva a lado nenhum:
 * inativar é definitivo.
 */
export const TRANSICOES_ATIVO = {
  rascunho: ["em_avaliacao", "inativo"],
  em_avaliacao: ["aguardando_aprovacao", "inativo"],
  aguardando_aprovacao: ["aprovado", "em_avaliacao", "inativo"],
  aprovado: ["publicado", "em_avaliacao", "inativo"],
  publicado: ["vendido", "inativo"],
  vendido: ["inativo"],
  inativo: [],
};

/** O que cada transição significa, para o botão não ser só um rótulo de estado. */
export const ACAO_DA_TRANSICAO = {
  em_avaliacao: { label: "Enviar para curadoria", tom: "outline" },
  aguardando_aprovacao: { label: "Enviar ao fornecedor", tom: "outline" },
  aprovado: { label: "Marcar como aprovado", tom: "outline" },
  publicado: { label: "Publicar no catálogo", tom: "success" },
  vendido: { label: "Marcar como vendido", tom: "outline" },
  inativo: { label: "Inativar", tom: "ghost" },
};

export const CONDICOES = [
  { valor: "sem_uso", label: "Sem uso" },
  { valor: "seminovo", label: "Seminovo" },
  { valor: "usado_bom", label: "Usado em bom estado" },
  { valor: "usado_sinais", label: "Usado com sinais de uso" },
  { valor: "necessita_reparo", label: "Necessita reparo" },
];

export const MODELOS_COMERCIAIS = [
  { valor: "estoque", label: "RED Estoque" },
  { valor: "catalogo", label: "RED Catálogo" },
];

export const MODALIDADES = [
  { valor: "direta", label: "Compra direta" },
  { valor: "consulta", label: "Sob consulta" },
];

export const FORMAS_DE_VENDA = [
  { valor: "unidade", label: "Unidade" },
  { valor: "conjunto", label: "Conjunto" },
  { valor: "lote", label: "Lote" },
];

export const DISPONIBILIDADE = [
  { valor: "disponivel", label: "Disponível" },
  { valor: "sujeito_confirmacao", label: "Sujeito à confirmação" },
  { valor: "reservado", label: "Reservado" },
];

/** Campos técnicos: vivem dentro de `attributes`, não na raiz do ativo. */
export const CAMPOS_TECNICOS = [
  { chave: "modelo", label: "Modelo" },
  { chave: "dimensoes", label: "Dimensões" },
  { chave: "peso", label: "Peso" },
  { chave: "potencia", label: "Potência" },
  { chave: "voltagem", label: "Voltagem" },
  { chave: "capacidade", label: "Capacidade" },
  { chave: "acabamento", label: "Acabamento" },
];
