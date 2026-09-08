"use client";

import styles from "./TabFilter.module.css";

/** Abas de filtro rapido. Mostra a contagem quando existe: uma aba "Canceladas"
 *  vazia e informacao, nao ruido — evita o utilizador clicar para descobrir. */
export default function TabFilter({ opcoes, valor, onChange, className = "" }) {
  return (
    <div className={`${styles.abas} ${className}`} role="tablist">
      {opcoes.map((o) => (
        <button
          key={o.valor}
          type="button"
          role="tab"
          aria-selected={o.valor === valor}
          className={`${styles.aba} ${o.valor === valor ? styles.ativa : ""}`}
          onClick={() => onChange(o.valor)}
        >
          {o.label}
          {o.contador !== undefined && <em>{o.contador}</em>}
        </button>
      ))}
    </div>
  );
}
