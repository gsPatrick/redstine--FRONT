import Link from "next/link";
import styles from "./EmptyBlock.module.css";

/**
 * Bloco vazio, com informação.
 *
 * Existe para que nenhuma seção do site fique como um buraco branco. Uma
 * seção com título e nada embaixo faz o visitante achar que a página quebrou;
 * este bloco diz o que está acontecendo e oferece uma saída.
 *
 * Distingue dois casos, porque significam coisas diferentes:
 *
 *   `vazio` — não há dado a mostrar. É informação: o catálogo está sendo
 *             montado, a busca não achou nada. Convida a uma próxima ação.
 *   `erro`  — não foi possível buscar. É falha, e a tela deve admiti-la em
 *             vez de fingir que simplesmente não há nada.
 */
const ICONES = {
  vazio: (
    <>
      <path d="M21 8l-9-5-9 5 9 5 9-5z" />
      <path d="M3 8v8l9 5 9-5V8" />
      <path d="M12 13v8" />
    </>
  ),
  erro: (
    <>
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
      <path d="M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" />
    </>
  ),
  busca: (
    <>
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.3-4.3" />
    </>
  ),
};

export default function EmptyBlock({
  tipo = "vazio",
  titulo,
  descricao,
  acao,
  className = "",
}) {
  return (
    <div className={`${styles.bloco} ${styles[tipo]} ${className}`} role="status">
      <span className={styles.icone} aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {ICONES[tipo] || ICONES.vazio}
        </svg>
      </span>

      <p className={styles.titulo}>{titulo}</p>
      {descricao ? <p className={styles.descricao}>{descricao}</p> : null}

      {acao ? (
        <Link href={acao.href} className={styles.acao}>
          {acao.label}
        </Link>
      ) : null}
    </div>
  );
}
