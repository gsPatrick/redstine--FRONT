"use client";

import { useState } from "react";
import PageHeader from "@/components/panel/molecules/PageHeader/PageHeader";
import PanelCard from "@/components/panel/molecules/PanelCard/PanelCard";
import PanelButton from "@/components/panel/atoms/PanelButton/PanelButton";
import PanelIcon from "@/components/panel/atoms/PanelIcon/PanelIcon";
import EstadoDaTela from "@/components/panel/molecules/EstadoDaTela/EstadoDaTela";
import styles from "./conta.module.css";

/**
 * Casca comum das quatro páginas de Minha Conta.
 *
 * Concentra o ciclo de gravação — enviando, erro, confirmação — para as quatro
 * telas se comportarem igual. Uma que esquecesse o aviso de sucesso deixaria o
 * utilizador sem saber se a alteração pegou.
 */
export default function ContaLayout({
  titulo,
  descricao,
  secao,
  children,
  onSubmit,
  carregando,
  erro,
  onTentarNovamente,
  rotuloAcao = "Salvar alterações",
}) {
  const [estado, setEstado] = useState({ enviando: false, erro: null, ok: false });

  async function submeter(e) {
    e.preventDefault();
    const dados = Object.fromEntries(new FormData(e.currentTarget));
    setEstado({ enviando: true, erro: null, ok: false });
    try {
      await onSubmit?.(dados);
      setEstado({ enviando: false, erro: null, ok: true });
      // A confirmação some sozinha: um aviso verde permanente vira ruído na
      // próxima visita à tela.
      setTimeout(() => setEstado((s) => ({ ...s, ok: false })), 4000);
    } catch (e2) {
      setEstado({
        enviando: false,
        erro: e2.details?.[0]?.motivo || e2.message,
        ok: false,
      });
    }
  }

  return (
    <>
      <PageHeader
        titulo={titulo}
        descricao={descricao}
        trilha={[{ label: "Minha Conta" }, { label: secao }]}
      />

      <EstadoDaTela carregando={carregando} erro={erro} onTentarNovamente={onTentarNovamente} altura={280}>
        <form className={styles.form} onSubmit={submeter}>
          {estado.erro && (
            <p className={styles.avisoErro}>
              <PanelIcon name="alert" size={15} />
              {estado.erro}
            </p>
          )}
          {estado.ok && (
            <p className={styles.avisoOk}>
              <PanelIcon name="checkCircle" size={15} />
              Alterações salvas.
            </p>
          )}

          <PanelCard>{children}</PanelCard>

          <div className={styles.rodape}>
            <PanelButton type="submit" variant="success" disabled={estado.enviando}>
              {estado.enviando ? "Salvando…" : rotuloAcao}
            </PanelButton>
          </div>
        </form>
      </EstadoDaTela>
    </>
  );
}
