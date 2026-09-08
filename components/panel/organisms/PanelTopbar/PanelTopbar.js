"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Avatar from "../../atoms/Avatar/Avatar";
import PanelIcon from "../../atoms/PanelIcon/PanelIcon";
import NotificationBell from "../NotificationBell/NotificationBell";
import styles from "./PanelTopbar.module.css";

export default function PanelTopbar({ usuario, notificacoes, onAbrirMenu, atalhos = [], onSair }) {
  const [menu, setMenu] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!menu) return undefined;
    const fora = (e) => ref.current && !ref.current.contains(e.target) && setMenu(false);
    document.addEventListener("mousedown", fora);
    return () => document.removeEventListener("mousedown", fora);
  }, [menu]);

  return (
    <header className={styles.topo}>
      <button type="button" className={styles.hamburguer} onClick={onAbrirMenu} aria-label="Abrir menu">
        <PanelIcon name="menu" size={20} />
      </button>

      <div className={styles.direita}>
        <NotificationBell notificacoes={notificacoes} />

        <div className={styles.conta} ref={ref}>
          <button
            type="button"
            className={styles.gatilho}
            onClick={() => setMenu((v) => !v)}
            aria-expanded={menu}
            aria-haspopup="menu"
          >
            <Avatar nome={usuario.nome} src={usuario.foto} size={34} />
            <span className={styles.identidade}>
              <strong>Olá, {usuario.nome}</strong>
              <em>{usuario.papel}</em>
            </span>
            <PanelIcon name="chevronDown" size={14} className={menu ? styles.girado : ""} />
          </button>

          {menu && (
            <div className={styles.menu} role="menu">
              {atalhos.map((a) => (
                <Link key={a.href} href={a.href} role="menuitem" onClick={() => setMenu(false)}>
                  <PanelIcon name={a.icone} size={15} />
                  {a.label}
                </Link>
              ))}
              <button type="button" role="menuitem" className={styles.sair} onClick={onSair}>
                <PanelIcon name="logout" size={15} />
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
