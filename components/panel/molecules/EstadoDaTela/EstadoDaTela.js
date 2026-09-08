"use client";

import PanelIcon from "../../atoms/PanelIcon/PanelIcon";
import PanelButton from "../../atoms/PanelButton/PanelButton";
import styles from "./EstadoDaTela.module.css";

/**
 * Carregando e erro, no mesmo lugar.
 *
 * Erro de rede mostra o que aconteceu e um botão de tentar de novo. Uma tela
 * que falha em silêncio e exibe tabela vazia faz o utilizador concluir que não
 * tem dado — e isso é pior do que admitir a falha.
 */
export default function EstadoDaTela({ carregando, erro, onTentarNovamente, children, altura = 220 }) {
  if (carregando) {
    return (
      <div className={styles.caixa} style={{ minHeight: altura }} role="status" aria-live="polite">
        <span className={styles.giro} />
        <span className={styles.texto}>Carregando…</span>
      </div>
    );
  }

  if (erro) {
    return (
      <div className={styles.caixa} style={{ minHeight: altura }}>
        <span className={styles.selo}>
          <PanelIcon name="alert" size={20} />
        </span>
        <p className={styles.titulo}>Não foi possível carregar estes dados.</p>
        <p className={styles.detalhe}>
          {erro.status === 403
            ? "Seu perfil não tem permissão para ver esta informação."
            : erro.message}
        </p>
        {onTentarNovamente && erro.status !== 403 && (
          <PanelButton variant="outline" size="sm" onClick={onTentarNovamente} icon="trend">
            Tentar novamente
          </PanelButton>
        )}
      </div>
    );
  }

  return children;
}
