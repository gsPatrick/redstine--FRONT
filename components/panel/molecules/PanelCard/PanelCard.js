import styles from "./PanelCard.module.css";

/** Superficie base do painel. Todo bloco de conteudo nasce daqui — assim
 *  raio, borda e sombra existem num lugar so. */
export default function PanelCard({
  children,
  titulo,
  descricao,
  acao,
  padding = "md",
  className = "",
  ...rest
}) {
  return (
    <section className={`${styles.card} ${styles[`p-${padding}`]} ${className}`} {...rest}>
      {(titulo || acao) && (
        <header className={styles.head}>
          <div>
            {titulo && <h2 className={styles.titulo}>{titulo}</h2>}
            {descricao && <p className={styles.descricao}>{descricao}</p>}
          </div>
          {acao && <div className={styles.acao}>{acao}</div>}
        </header>
      )}
      {children}
    </section>
  );
}
