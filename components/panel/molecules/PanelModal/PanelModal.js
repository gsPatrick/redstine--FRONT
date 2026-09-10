"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import PanelIcon from "../../atoms/PanelIcon/PanelIcon";
import styles from "./PanelModal.module.css";

/**
 * Diálogo do painel.
 *
 * Vai para um portal no `body`, e não onde é declarado: dentro de um cartão ou
 * de uma célula de tabela ele herdaria `overflow: hidden` e apareceria cortado
 * ou atrás do conteúdo.
 *
 * Só que as cores do painel (`--pnl-*`) são declaradas em `.painel`, não em
 * `:root`. Ao sair para o `body` o diálogo saía do escopo delas e TODA variável
 * resolvia para vazio: fundo transparente, bordas invisíveis, texto na cor
 * herdada — o formulário aparecia flutuando por cima da página. Por isso o
 * portal recebe as mesmas classes de tema da casca do painel.
 *
 * Esc fecha, o fundo fecha, e o foco vai para dentro ao abrir e volta para o
 * elemento que abriu ao fechar — sem isso quem navega por teclado continua
 * a tabular pela página atrás do diálogo.
 */
export default function PanelModal({
  aberto,
  aoFechar,
  titulo,
  descricao,
  children,
  largura = 560,
}) {
  const caixa = useRef(null);
  const focoAnterior = useRef(null);

  useEffect(() => {
    if (!aberto) return undefined;

    focoAnterior.current = document.activeElement;
    const semRolagem = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const tecla = (e) => {
      if (e.key === "Escape") aoFechar();
    };
    document.addEventListener("keydown", tecla);

    // Espera o portal montar antes de procurar o primeiro campo.
    const id = requestAnimationFrame(() => {
      const primeiro = caixa.current?.querySelector(
        "input:not([type=hidden]), select, textarea, button"
      );
      primeiro?.focus();
    });

    return () => {
      document.removeEventListener("keydown", tecla);
      document.body.style.overflow = semRolagem;
      cancelAnimationFrame(id);
      focoAnterior.current?.focus?.();
    };
  }, [aberto, aoFechar]);

  if (!aberto || typeof document === "undefined") return null;

  // Copia `painel` e `painel--dark` da casca: é onde os tokens de cor vivem.
  const tema = Array.from(document.querySelector(".painel")?.classList || [])
    .filter((c) => c.startsWith("painel"))
    .join(" ");

  return createPortal(
    <div
      className={`${tema} ${styles.fundo}`}
      onMouseDown={(e) => e.target === e.currentTarget && aoFechar()}
    >
      <div
        className={styles.caixa}
        style={{ maxWidth: largura }}
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        ref={caixa}
      >
        <header className={styles.cabeca}>
          <div>
            <strong className={styles.titulo}>{titulo}</strong>
            {descricao && <p className={styles.descricao}>{descricao}</p>}
          </div>
          <button type="button" className={styles.fechar} onClick={aoFechar} aria-label="Fechar">
            <PanelIcon name="close" size={16} />
          </button>
        </header>

        <div className={styles.corpo}>{children}</div>
      </div>
    </div>,
    document.body
  );
}
