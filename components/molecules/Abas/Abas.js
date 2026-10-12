"use client";

import { useId, useState } from "react";
import styles from "./Abas.module.css";

/**
 * Abas de conteúdo da página do produto.
 *
 * Três abas, fixadas pelo descritivo: Sobre o produto, Aplicações e
 * Especificações. O documento é explícito sobre o que NÃO entra — "sem
 * Avaliações e sem Perguntas e Respostas" —, e a razão é a mesma que vale para
 * o acervo: peça única e volume baixo deixariam as duas permanentemente vazias,
 * e aba vazia num marketplace lê-se como "ninguém comprou".
 *
 * Aba sem conteúdo não é renderizada. Nem todo ativo tem aplicações escritas, e
 * a aba presente mas vazia é pior do que a aba ausente.
 */
export default function Abas({ items }) {
  const presentes = items.filter((item) => item.content);
  const [ativa, setAtiva] = useState(0);
  const base = useId();

  if (!presentes.length) return null;

  return (
    <div className={styles.abas}>
      <div className={styles.lista} role="tablist">
        {presentes.map((item, index) => (
          <button
            key={item.title}
            type="button"
            role="tab"
            id={`${base}-t${index}`}
            aria-selected={index === ativa}
            aria-controls={`${base}-p${index}`}
            className={`${styles.aba} ${index === ativa ? styles.abaAtiva : ""}`}
            onClick={() => setAtiva(index)}
          >
            {item.title}
          </button>
        ))}
      </div>

      {presentes.map((item, index) =>
        index === ativa ? (
          <div
            key={item.title}
            role="tabpanel"
            id={`${base}-p${index}`}
            aria-labelledby={`${base}-t${index}`}
            className={styles.painel}
          >
            {item.content}
          </div>
        ) : null
      )}
    </div>
  );
}
