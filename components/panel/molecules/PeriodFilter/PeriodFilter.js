"use client";

import { useEffect, useRef, useState } from "react";
import PanelIcon from "../../atoms/PanelIcon/PanelIcon";
import styles from "./PeriodFilter.module.css";

/**
 * Seletor de periodo.
 *
 * As opcoes vem do documento: 30 dias | 90 dias | 12 meses | Todo o periodo.
 * O componente e deliberadamente burro — quem decide o que responde ao filtro
 * e a pagina, porque indicador de estado nao muda com periodo nenhum.
 */
export const PERIODOS = [
  { valor: "30d", label: "Últimos 30 dias", curto: "30 dias" },
  { valor: "90d", label: "Últimos 90 dias", curto: "90 dias" },
  { valor: "12m", label: "Últimos 12 meses", curto: "12 meses" },
  { valor: "tudo", label: "Todo o período", curto: "Tudo" },
];

export default function PeriodFilter({
  valor = "30d",
  onChange,
  rotulo = "Período:",
  opcoes = PERIODOS,
  className = "",
}) {
  const [aberto, setAberto] = useState(false);
  const ref = useRef(null);
  const atual = opcoes.find((o) => o.valor === valor) || opcoes[0];

  useEffect(() => {
    if (!aberto) return undefined;
    const fora = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setAberto(false);
    };
    const esc = (e) => e.key === "Escape" && setAberto(false);
    document.addEventListener("mousedown", fora);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", fora);
      document.removeEventListener("keydown", esc);
    };
  }, [aberto]);

  return (
    <div className={`${styles.wrap} ${className}`} ref={ref}>
      {rotulo && <span className={styles.rotulo}>{rotulo}</span>}
      <button
        type="button"
        className={styles.gatilho}
        onClick={() => setAberto((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={aberto}
      >
        {atual.curto}
        <PanelIcon name="chevronDown" size={14} className={aberto ? styles.girado : ""} />
      </button>

      {aberto && (
        <ul className={styles.menu} role="listbox">
          {opcoes.map((o) => (
            <li key={o.valor}>
              <button
                type="button"
                role="option"
                aria-selected={o.valor === valor}
                className={`${styles.opcao} ${o.valor === valor ? styles.ativa : ""}`}
                onClick={() => {
                  onChange?.(o.valor);
                  setAberto(false);
                }}
              >
                {o.label}
                {o.valor === valor && <PanelIcon name="check" size={14} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
