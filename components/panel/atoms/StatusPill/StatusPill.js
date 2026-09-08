import styles from "./StatusPill.module.css";

/**
 * Pilula de status.
 *
 * O mapa vive aqui, num lugar so: o mesmo status precisa ter a mesma cor na
 * Area do Cliente e no Painel de Gestao, senao "A receber" vira amarelo numa
 * tela e verde na outra e o utilizador deixa de confiar na cor.
 *
 * A leitura das cores: verde = terminou bem, ambar = espera acao, azul =
 * em andamento, vermelho = interrompido, cinza = sem carga.
 */
const TOM = {
  // compras
  "compra confirmada": "info",
  "aguardando retirada": "warn",
  "retirada agendada": "info",
  "retirada liberada": "info",
  retirado: "ok",
  concluido: "ok",
  concluída: "ok",
  concluida: "ok",
  cancelado: "danger",
  cancelada: "danger",

  // consultas
  nova: "info",
  recebida: "info",
  "em atendimento": "warn",
  respondida: "ok",
  encerrada: "neutral",

  // ativos
  "em avaliacao": "warn",
  "em avaliação": "warn",
  "aguardando aprovacao": "warn",
  "aguardando aprovação": "warn",
  "aguardando avaliação": "warn",
  publicado: "ok",
  vendido: "info",
  inativo: "neutral",
  rascunho: "neutral",

  // financeiro
  "venda realizada": "info",
  "a receber": "warn",
  "a repassar": "warn",
  "pagamento programado": "info",
  pago: "ok",
  pagos: "ok",
  estornado: "danger",
};

export default function StatusPill({ status, tone, size = "md", className = "" }) {
  const chave = String(status || "").toLowerCase().trim();
  const cor = tone || TOM[chave] || "neutral";

  return (
    <span className={`${styles.pill} ${styles[cor]} ${styles[size]} ${className}`}>{status}</span>
  );
}

export { TOM as tonsDeStatus };
