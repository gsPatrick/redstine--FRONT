"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import PanelIcon from "../../atoms/PanelIcon/PanelIcon";
import { tempoRelativo } from "@/lib/painel/formato";
import styles from "./NotificationBell.module.css";

const ICONE_POR_TIPO = {
  compra: "cart",
  consulta: "chat",
  ativo: "box",
  financeiro: "wallet",
  venda: "tag",
};

/**
 * Sino global.
 *
 * Fica no cabecalho, visivel em todas as telas, e nao no menu — o documento e
 * explicito: notificacao e transversal, nao um item no mesmo nivel de Comprar
 * e Vender. Cada linha leva direto ao objeto: "compra disponivel para retirada"
 * abre aquela compra, nao a lista de compras.
 */
export default function NotificationBell({ notificacoes = [] }) {
  const [aberto, setAberto] = useState(false);
  const [lidas, setLidas] = useState([]);
  const ref = useRef(null);

  const naoLidas = notificacoes.filter((n) => !n.lida && !lidas.includes(n.id));

  useEffect(() => {
    if (!aberto) return undefined;
    const fora = (e) => ref.current && !ref.current.contains(e.target) && setAberto(false);
    const esc = (e) => e.key === "Escape" && setAberto(false);
    document.addEventListener("mousedown", fora);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", fora);
      document.removeEventListener("keydown", esc);
    };
  }, [aberto]);

  return (
    <div className={styles.wrap} ref={ref}>
      <button
        type="button"
        className={styles.sino}
        onClick={() => setAberto((v) => !v)}
        aria-label={`Notificações${naoLidas.length ? `, ${naoLidas.length} não lidas` : ""}`}
        aria-expanded={aberto}
      >
        <PanelIcon name="bell" size={19} />
        {naoLidas.length > 0 && <span className={styles.badge}>{naoLidas.length}</span>}
      </button>

      {aberto && (
        <div className={styles.painel} role="dialog" aria-label="Notificações">
          <header className={styles.cabeca}>
            <strong>Notificações</strong>
            {naoLidas.length > 0 && (
              <button
                type="button"
                className={styles.marcar}
                onClick={() => setLidas(notificacoes.map((n) => n.id))}
              >
                Marcar todas como lidas
              </button>
            )}
          </header>

          <ul className={styles.lista}>
            {notificacoes.slice(0, 6).map((n) => {
              const lida = n.lida || lidas.includes(n.id);
              return (
                <li key={n.id}>
                  <Link
                    href={n.link || "#"}
                    className={`${styles.linha} ${lida ? styles.lida : ""}`}
                    onClick={() => {
                      setLidas((l) => (l.includes(n.id) ? l : [...l, n.id]));
                      setAberto(false);
                    }}
                  >
                    <span className={`${styles.icone} ${styles[n.tom || "info"]}`}>
                      <PanelIcon name={ICONE_POR_TIPO[n.categoria] || "bell"} size={14} />
                    </span>
                    <span className={styles.texto}>
                      <span className={styles.titulo}>{n.titulo}</span>
                      <span className={styles.quando}>{tempoRelativo(n.data)}</span>
                    </span>
                    {!lida && <span className={styles.ponto} aria-hidden="true" />}
                  </Link>
                </li>
              );
            })}
          </ul>

          {!notificacoes.length && <p className={styles.vazio}>Nenhuma notificação por enquanto.</p>}

          <footer className={styles.rodape}>
            <Link href="#" onClick={() => setAberto(false)}>
              Ver todas as notificações
            </Link>
          </footer>
        </div>
      )}
    </div>
  );
}
