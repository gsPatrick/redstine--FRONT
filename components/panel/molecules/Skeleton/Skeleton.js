import styles from "./Skeleton.module.css";

/**
 * Esqueletos do painel.
 *
 * Cada variante imita a forma da tela que vai substituir: cartões de
 * indicador, linhas de tabela, gráfico. Um spinner genérico não diz nada
 * sobre o que está vindo e deixa a página saltar quando o conteúdo chega —
 * o esqueleto já reserva a altura final.
 */
export function SkeletonCards({ quantidade = 4 }) {
  return (
    <div className={styles.cards}>
      {Array.from({ length: quantidade }, (_, i) => (
        <div key={i} className={styles.card} aria-hidden="true">
          <span className={`${styles.b} ${styles.rotulo}`} />
          <span className={`${styles.b} ${styles.valor}`} />
          <span className={`${styles.b} ${styles.nota}`} />
        </div>
      ))}
    </div>
  );
}

export function SkeletonTabela({ linhas = 6, colunas = 5 }) {
  return (
    <div className={styles.tabela} aria-hidden="true">
      <div className={styles.cabecalho}>
        {Array.from({ length: colunas }, (_, i) => (
          <span key={i} className={`${styles.b} ${styles.celulaCabecalho}`} />
        ))}
      </div>
      {Array.from({ length: linhas }, (_, l) => (
        <div key={l} className={styles.linha}>
          {Array.from({ length: colunas }, (_, c) => (
            // A primeira coluna costuma ser o nome, e é a mais larga —
            // variar a largura evita o aspecto de grade morta.
            <span
              key={c}
              className={`${styles.b} ${styles.celula}`}
              style={{ width: c === 0 ? "78%" : `${45 + ((l + c) % 3) * 15}%` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonGrafico({ altura = 210 }) {
  return (
    <div className={styles.grafico} style={{ height: altura }} aria-hidden="true">
      {[62, 88, 45, 74, 96, 58, 80].map((h, i) => (
        <span key={i} className={`${styles.b} ${styles.barra}`} style={{ height: `${h}%` }} />
      ))}
    </div>
  );
}

export function SkeletonBloco({ altura = 160 }) {
  return <span className={`${styles.b} ${styles.bloco}`} style={{ height: altura }} aria-hidden="true" />;
}
