"use client";

import PanelIcon from "../../atoms/PanelIcon/PanelIcon";
import PanelButton from "../../atoms/PanelButton/PanelButton";
import {
  SkeletonBloco,
  SkeletonCards,
  SkeletonGrafico,
  SkeletonTabela,
} from "../Skeleton/Skeleton";
import styles from "./EstadoDaTela.module.css";

/**
 * Carregando e erro, no mesmo lugar.
 *
 * O estado de carga é um ESQUELETO com a forma do que vem — cartões, tabela
 * ou gráfico —, não um spinner. O spinner não diz o que está a caminho e
 * deixa a página saltar quando o conteúdo chega; o esqueleto já ocupa a
 * altura final.
 *
 * Erro de rede mostra o que aconteceu e um botão de tentar de novo. Uma tela
 * que falha em silêncio e exibe tabela vazia faz o utilizador concluir que não
 * tem dado — e isso é pior do que admitir a falha.
 */
const ESQUELETOS = {
  cards: (o) => <SkeletonCards quantidade={o.quantidade ?? 4} />,
  tabela: (o) => <SkeletonTabela linhas={o.linhas ?? 6} colunas={o.colunas ?? 5} />,
  grafico: (o) => <SkeletonGrafico altura={o.altura ?? 210} />,
  bloco: (o) => <SkeletonBloco altura={o.altura ?? 160} />,
};

export default function EstadoDaTela({
  carregando,
  erro,
  onTentarNovamente,
  children,
  altura = 220,
  esqueleto = "bloco",
  quantidade,
  linhas,
  colunas,
}) {
  if (carregando) {
    const montar = ESQUELETOS[esqueleto] || ESQUELETOS.bloco;
    return (
      <div role="status" aria-live="polite" aria-label="Carregando">
        {montar({ quantidade, linhas, colunas, altura })}
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
