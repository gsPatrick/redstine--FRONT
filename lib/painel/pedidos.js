/**
 * Vocabulário do pedido — espelho de src/config/constants.js.
 *
 * Três eixos independentes, e é assim de propósito: o pedido pode estar
 * confirmado com pagamento pendente, ou pago e ainda sem retirada. Um status
 * único não conseguiria dizer as duas coisas ao mesmo tempo.
 */
export const ROTULO_PEDIDO = {
  aguardando_confirmacao: "Aguardando confirmação",
  confirmado: "Confirmado",
  em_separacao: "Em separação",
  aguardando_retirada: "Aguardando retirada",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

export const ROTULO_PAGAMENTO = {
  aguardando: "Aguardando",
  pago: "Pago",
  estornado: "Estornado",
};

export const ROTULO_RETIRADA = {
  nao_aplicavel: "Não aplicável",
  aguardando: "Aguardando",
  agendada: "Agendada",
  concluida: "Concluída",
};

export const STATUS_PAGAMENTO = ["aguardando", "pago", "estornado"];
export const STATUS_RETIRADA = ["nao_aplicavel", "aguardando", "agendada", "concluida"];

/** Para onde o pedido pode ir a partir de cada estado. */
export const TRANSICOES_PEDIDO = {
  aguardando_confirmacao: ["cancelado"],
  confirmado: ["em_separacao", "aguardando_retirada", "cancelado"],
  em_separacao: ["aguardando_retirada", "cancelado"],
  aguardando_retirada: ["em_separacao", "cancelado"],
  concluido: [],
  cancelado: [],
};

/** O que cada condição de conclusão significa em português. */
export const ROTULO_CONDICAO = {
  venda_confirmada: "Venda confirmada",
  pagamento_confirmado: "Pagamento confirmado",
  retirada_concluida: "Retirada concluída",
  sem_pendencia: "Sem pendência aberta",
};
