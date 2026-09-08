import { data as fmtData } from "@/lib/painel/formato";
import styles from "./Timeline.module.css";

/**
 * Historico do objeto (compra, venda, ativo).
 *
 * Ordem cronologica crescente, nao decrescente: aqui o utilizador quer ler a
 * historia do inicio ao fim, ao contrario do sino, onde o mais recente manda.
 * Eventos futuros ficam apagados — sao previsao, nao registo.
 */
export default function Timeline({ eventos = [], className = "" }) {
  return (
    <ol className={`${styles.linha} ${className}`}>
      {eventos.map((e, i) => (
        <li key={`${e.titulo}-${i}`} className={e.futuro ? styles.futuro : ""}>
          <span className={styles.marco} aria-hidden="true" />
          <div className={styles.conteudo}>
            <span className={styles.quando}>
              {e.futuro ? "—" : fmtData(e.data, { comHora: true })}
            </span>
            <strong className={styles.titulo}>{e.titulo}</strong>
            {e.detalhe && <p className={styles.detalhe}>{e.detalhe}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
