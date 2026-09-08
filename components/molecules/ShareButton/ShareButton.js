"use client";

import { useEffect, useState } from "react";
import styles from "./ShareButton.module.css";

/**
 * Compartilhar ativo.
 *
 * Usa a partilha nativa do sistema quando existe (telemóvel), e cai para
 * copiar o link quando não existe (desktop). São dois comportamentos porque
 * são dois contextos: no telemóvel o utilizador quer mandar no WhatsApp; no
 * computador, colar num e-mail.
 *
 * O texto do botão confirma o que aconteceu e volta ao normal sozinho — sem
 * isso o utilizador clica, nada muda na tela e ele clica de novo.
 */
export default function ShareButton({ titulo, texto, className = "" }) {
  const [estado, setEstado] = useState("pronto");
  const [nativo, setNativo] = useState(false);

  // A checagem roda só no cliente: `navigator.share` não existe no servidor e
  // decidir no render inicial causaria divergência de hidratação.
  useEffect(() => {
    setNativo(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  useEffect(() => {
    if (estado === "pronto") return undefined;
    const t = setTimeout(() => setEstado("pronto"), 2200);
    return () => clearTimeout(t);
  }, [estado]);

  async function partilhar() {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title: titulo, text: texto, url });
        return;
      } catch (e) {
        // Cancelar a folha de partilha não é erro — não vira aviso na tela.
        if (e?.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setEstado("copiado");
    } catch {
      setEstado("falhou");
    }
  }

  const rotulo =
    estado === "copiado" ? "Link copiado" : estado === "falhou" ? "Copie da barra" : "Compartilhar";

  return (
    <button
      type="button"
      onClick={partilhar}
      className={`${styles.botao} ${estado !== "pronto" ? styles.confirmado : ""} ${className}`}
      aria-live="polite"
    >
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        {estado === "copiado" ? (
          <path
            d="M20 6L9 17l-5-5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <>
            <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="1.6" />
            <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
            <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="1.6" />
            <path
              d="M8.6 10.7l6.8-4M8.6 13.3l6.8 4"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </>
        )}
      </svg>
      {rotulo}
    </button>
  );
}
