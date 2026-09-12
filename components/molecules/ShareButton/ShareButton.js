"use client";

import { useEffect, useState } from "react";
import styles from "./ShareButton.module.css";

/**
 * Compartilhar ativo.
 *
 * Três caminhos, em ordem de preferência: a partilha nativa do sistema
 * (telemóvel), o WhatsApp Web (desktop) e copiar o link (último recurso).
 *
 * O WhatsApp entrou no meio porque só copiar o link não resolvia: o cliente
 * relatou "não consegui compartilhar por whatsapp" justamente no desktop, onde
 * `navigator.share` não existe. E o WhatsApp é o canal por onde a RED negocia,
 * não um detalhe de conveniência.
 *
 * O texto do botão confirma o que aconteceu e volta ao normal sozinho — sem
 * isso o utilizador clica, nada muda na tela e ele clica de novo.
 */
export default function ShareButton({ titulo, texto, className = "", apenasIcone = false }) {
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

    // Sem partilha nativa: abre o WhatsApp com o link já montado. `wa.me` sem
    // número deixa o utilizador escolher o destinatário, que é o que se quer
    // ao compartilhar (diferente do botão de compra, que fala com a RED).
    const zap = `https://wa.me/?text=${encodeURIComponent(`${texto || titulo} ${url}`)}`;
    const janela = window.open(zap, "_blank", "noopener,noreferrer");
    if (janela) return;

    // Bloqueador de pop-up: ainda dá para copiar.
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
      className={`${styles.botao} ${apenasIcone ? styles.soIcone : ""} ${
        estado !== "pronto" ? styles.confirmado : ""
      } ${className}`}
      aria-live="polite"
      aria-label={apenasIcone ? rotulo : undefined}
      title={apenasIcone ? rotulo : undefined}
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
      {!apenasIcone && rotulo}
    </button>
  );
}
