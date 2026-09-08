import styles from "./ProductSkeleton.module.css";

/**
 * Esqueleto do card de ativo.
 *
 * Ocupa exatamente a mesma altura e o mesmo ritmo do card real — imagem,
 * duas linhas de título, preço e botão. É isso que evita o salto de layout
 * quando os dados chegam: a página já nasce com a altura final.
 *
 * A animação é uma faixa de brilho, não um pulsar de opacidade. Pulsar em
 * vários cards ao mesmo tempo cansa; o brilho corre uma vez e sai.
 */
export default function ProductSkeleton({ quantidade = 4 }) {
  return (
    <>
      {Array.from({ length: quantidade }, (_, i) => (
        <article key={i} className={styles.card} aria-hidden="true">
          <span className={`${styles.bloco} ${styles.imagem}`} />
          <span className={`${styles.bloco} ${styles.chip}`} />
          <span className={`${styles.bloco} ${styles.linha}`} />
          <span className={`${styles.bloco} ${styles.linhaCurta}`} />
          <span className={`${styles.bloco} ${styles.preco}`} />
          <span className={`${styles.bloco} ${styles.botao}`} />
        </article>
      ))}
    </>
  );
}
