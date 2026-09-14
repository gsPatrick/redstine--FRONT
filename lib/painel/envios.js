/**
 * Vocabulário dos envios, num lugar só.
 *
 * A API guarda a chave crua (`em_avaliacao`) e a tela mostra o rótulo legível
 * ("Em avaliação"). Repetir esse mapa em cada tela é como nasce a divergência
 * em que a lista chama de "Recusado" o que o detalhe chama de "Reprovado".
 */
export const STATUS_ENVIO = {
  RECEBIDA: "recebida",
  EM_AVALIACAO: "em_avaliacao",
  APROVADA: "aprovada",
  RECUSADA: "recusada",
};

export const ROTULO_ENVIO = {
  recebida: "Recebida",
  em_avaliacao: "Em avaliação",
  aprovada: "Aprovada",
  recusada: "Recusada",
};

/** Os cinco valores oficiais de condição, iguais aos do filtro do catálogo. */
export const CONDICOES = [
  { valor: "sem_uso", label: "Sem uso" },
  { valor: "seminovo", label: "Seminovo" },
  { valor: "usado_bom", label: "Usado em bom estado" },
  { valor: "usado_sinais", label: "Usado com sinais de uso" },
  { valor: "necessita_reparo", label: "Necessita reparo" },
];

/**
 * Modelos que a curadoria pode recomendar ao aprovar um envio.
 *
 * NAO reexporta a lista central de proposito, e a diferenca importa: o envio
 * vem de um fornecedor, e "Ativo Proprio RED" significa 100% para a RED e zero
 * de repasse. Oferecer esse modelo aqui permitiria aprovar o ativo de um
 * terceiro dando nada a quem o mandou.
 *
 * Ativo proprio nasce pelo cadastro direto da gestao, onde nao ha fornecedor.
 */
export const MODELOS = [
  { valor: "estoque", label: "RED Estoque" },
  { valor: "catalogo", label: "RED Catálogo" },
];

export const MODALIDADES = [
  { valor: "direta", label: "Compra direta" },
  { valor: "consulta", label: "Sob consulta" },
];
