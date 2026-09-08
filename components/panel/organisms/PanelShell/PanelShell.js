"use client";

import { useState } from "react";
import PanelSidebar from "../PanelSidebar/PanelSidebar";
import PanelTopbar from "../PanelTopbar/PanelTopbar";
import styles from "./PanelShell.module.css";

/**
 * Casca comum a Area do Cliente e Painel de Gestao.
 *
 * Os dois ambientes tem a mesma anatomia — barra lateral, topo fixo com sino e
 * conta, area de trabalho. O que muda e o tema e o conteudo do menu. Manter uma
 * casca so e o que garante que uma correcao de layout valha para os dois.
 */
export default function PanelShell({
  tema = "claro",
  tituloMenu,
  grupos,
  usuario,
  notificacoes,
  atalhosDeConta = [],
  onSair,
  children,
}) {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <div className={`painel ${tema === "escuro" ? "painel--dark" : ""} ${styles.shell}`}>
      <PanelSidebar
        titulo={tituloMenu}
        grupos={grupos}
        aberta={menuAberto}
        onFechar={() => setMenuAberto(false)}
        onSair={onSair}
      />

      <div className={styles.coluna}>
        <PanelTopbar
          usuario={usuario}
          notificacoes={notificacoes}
          atalhos={atalhosDeConta}
          onSair={onSair}
          onAbrirMenu={() => setMenuAberto(true)}
        />
        <main className={styles.conteudo}>{children}</main>
      </div>
    </div>
  );
}
