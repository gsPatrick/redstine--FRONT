/**
 * Vocabulário da área de Operação — espelho de `src/config/constants.js`.
 *
 * Mesma razão de `lib/painel/ativos.js` existir: repetir estas listas dentro de
 * cada tela é como nasce a divergência em que o filtro oferece uma opção que a
 * API recusa (ou, pior, aceita e devolve zero linhas para sempre).
 */

/**
 * Status OPERACIONAL do ativo.
 *
 * Não é o status do ciclo de vida com outro nome. O ciclo de vida responde
 * "onde está este ativo no processo da RED"; isto responde a pergunta física —
 * de quem é a guarda, há saldo, e alguém precisa mover isto hoje? Um ativo
 * "publicado" pode estar em guarda da RED, no fornecedor, reservado, sem saldo
 * ou com carga a sair, e o ciclo de vida chama tudo isso de "publicado".
 */
export const ROTULO_STATUS_OPERACIONAL = {
  aguardando_retirada: "Aguardando retirada",
  pronto_para_publicar: "Pronto para publicar",
  sem_saldo: "Sem saldo disponível",
  reservado: "Reservado",
  em_guarda_red: "Em guarda da RED",
  em_catalogo: "No fornecedor",
  saiu_do_inventario: "Saiu do inventário",
};

/**
 * Opções do filtro de status, na ordem em que interessam a quem opera: o que
 * exige ação hoje primeiro, o que já saiu no fim.
 */
export const OPCOES_STATUS_OPERACIONAL = [
  { valor: "", label: "Todos os status" },
  { valor: "aguardando_retirada", label: "Aguardando retirada" },
  { valor: "pronto_para_publicar", label: "Pronto para publicar" },
  { valor: "sem_saldo", label: "Sem saldo disponível" },
  { valor: "reservado", label: "Reservado" },
  { valor: "em_guarda_red", label: "Em guarda da RED" },
  { valor: "em_catalogo", label: "No fornecedor" },
  { valor: "saiu_do_inventario", label: "Saiu do inventário" },
];

export const OPCOES_MODELO_COMERCIAL = [
  { valor: "", label: "Todos os modelos" },
  { valor: "estoque", label: "RED Estoque" },
  { valor: "catalogo", label: "RED Catálogo" },
  { valor: "proprio", label: "Ativo Próprio RED" },
];

/**
 * O tom da pílula de cada status operacional.
 *
 * Vai explícito para a tela em vez de depender do mapa por texto do StatusPill:
 * "Em guarda da RED" e "No fornecedor" não são bom nem mau — são localizações —
 * e cairiam em cinza por omissão junto com "Saiu do inventário", que é outra
 * coisa. A leitura: âmbar = alguém tem de agir, vermelho = inconsistência,
 * azul/verde = em ordem, cinza = fora do inventário.
 */
export const TOM_STATUS_OPERACIONAL = {
  aguardando_retirada: "warn",
  pronto_para_publicar: "warn",
  sem_saldo: "danger",
  reservado: "info",
  em_guarda_red: "ok",
  em_catalogo: "info",
  saiu_do_inventario: "neutral",
};

/**
 * "Dias em estoque", em palavras — o mesmo critério que a API aplica em SQL.
 *
 * Fica aqui porque a tela precisa de o EXPLICAR: um número de dias sem a data
 * de referência ao lado é impossível de conferir, e a primeira pergunta de
 * quem opera é sempre "contado desde quando?".
 */
export const CRITERIO_DIAS_EM_ESTOQUE =
  "Contado da publicação do ativo (ou do cadastro, quando ainda não publicado) até hoje. " +
  "Para ativo vendido, a contagem para na data da venda.";

/** Faixa de idade do inventário — colore a coluna sem inventar um indicador. */
export function faixaDeDias(dias, limite = 90) {
  if (dias === null || dias === undefined) return null;
  if (dias >= limite) return "critico";
  if (dias >= Math.round(limite / 2)) return "atencao";
  return "ok";
}
