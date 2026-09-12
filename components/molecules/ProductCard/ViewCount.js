import styles from "./ViewCount.module.css";

/**
 * Visualizações de um ativo (revisão do cliente, item 33).
 *
 * "Já podemos incluir visualizações no card e pagina dos produtos?"
 *
 * O número vem PRONTO no payload do catálogo (`product.views`), do contador do
 * próprio ativo. Não há chamada aqui de propósito: a listagem mostra até 100
 * cards, e pedir a contagem por card seria N+1 no caminho mais quente do site.
 *
 * Zero não é exibido. Não é para esconder um número baixo — é que "0
 * visualizações" num ativo acabado de publicar diz menos do que não dizer
 * nada, e o vazio deixa a vitrine mais limpa. A partir de uma visualização o
 * número é prova social, e aí ele aparece.
 *
 * Sem estado e sem `use client`: é texto. Um componente de cliente aqui
 * arrastaria a listagem inteira para o browser por causa de uma contagem.
 */
export default function ViewCount({ views, className = "", size = "sm", compacto = false }) {
  const total = Number(views) || 0;
  if (total < 1) return null;

  const numero = total.toLocaleString("pt-BR");
  const palavra = total === 1 ? "visualização" : "visualizações";

  return (
    <span className={`${styles.views} ${styles[size]} ${className}`}>
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="3.1" fill="none" stroke="currentColor" strokeWidth="1.7" />
      </svg>
      {/*
        O rótulo por extenso é o padrão: um número sozinho ao lado de um olho é
        um enigma. Na versão compacta — sobre a foto do card, onde já existe a
        etiqueta de condição e as duas se tocavam nos cards estreitos — só o
        número é DESENHADO, e a palavra continua a existir para o leitor de
        tela. Esconder o texto é diferente de não o ter.
      */}
      {numero}
      {compacto ? <span className={styles.oculto}>{palavra}</span> : ` ${palavra}`}
    </span>
  );
}
