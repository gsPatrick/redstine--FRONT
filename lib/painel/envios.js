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

export const MODELOS = [
  { valor: "estoque", label: "RED Estoque" },
  { valor: "catalogo", label: "RED Catálogo" },
];

export const MODALIDADES = [
  { valor: "direta", label: "Compra direta" },
  { valor: "consulta", label: "Sob consulta" },
];
