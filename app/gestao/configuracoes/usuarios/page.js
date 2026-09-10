"use client";

import { useState } from "react";
import PageHeader from "@/components/panel/molecules/PageHeader/PageHeader";
import PanelCard from "@/components/panel/molecules/PanelCard/PanelCard";
import DataTable from "@/components/panel/molecules/DataTable/DataTable";
import PanelButton from "@/components/panel/atoms/PanelButton/PanelButton";
import StatusPill from "@/components/panel/atoms/StatusPill/StatusPill";
import Avatar from "@/components/panel/atoms/Avatar/Avatar";
import PanelIcon from "@/components/panel/atoms/PanelIcon/PanelIcon";
import EstadoDaTela from "@/components/panel/molecules/EstadoDaTela/EstadoDaTela";
import PanelModal from "@/components/panel/molecules/PanelModal/PanelModal";
import FormularioUsuario from "./FormularioUsuario";
import { useLista } from "@/lib/painel/api-cliente";
import { data as fmtData } from "@/lib/painel/formato";
import styles from "../configuracoes.module.css";

const ROTULO_PERFIL = {
  admin: "Master",
  curador: "Curadoria",
  comercial: "Comercial",
  financeiro: "Financeiro",
  fornecedor: "Fornecedor",
  comprador: "Comprador",
};

export default function UsuariosPage() {
  const { linhas: usuarios, meta, carregando, erro, recarregar } = useLista("/users?perPage=100");

  // `null` fechado, `"novo"` criando, objeto editando. Um unico estado evita a
  // combinacao impossivel de estar a criar e a editar ao mesmo tempo.
  const [emEdicao, setEmEdicao] = useState(null);

  const colunas = [
    {
      chave: "nome",
      titulo: "Usuário",
      ordenavel: true,
      render: (l) => (
        <span className={styles.usuario}>
          <Avatar nome={l.nome} size={32} />
          <span>
            <strong>{l.nome}</strong>
            <em>{l.email}</em>
          </span>
        </span>
      ),
    },
    {
      chave: "perfil",
      titulo: "Perfil",
      ordenavel: true,
      largura: 150,
      render: (l) => <span className={styles.perfil}>{ROTULO_PERFIL[l.perfil] || l.perfil}</span>,
    },
    {
      chave: "capacidades",
      titulo: "Capacidades",
      largura: 260,
      render: (l) => (
        <span className={styles.caps}>
          {(l.capacidades || []).length ? (
            l.capacidades.map((c) => <code key={c}>{c}</code>)
          ) : (
            <span className={styles.semCap}>Área do Cliente apenas</span>
          )}
        </span>
      ),
    },
    {
      chave: "ultimoAcesso",
      titulo: "Último acesso",
      ordenavel: true,
      largura: 145,
      valor: (l) => new Date(l.ultimoAcesso).getTime(),
      render: (l) => fmtData(l.ultimoAcesso, { comHora: true }),
    },
    {
      chave: "ativo",
      titulo: "Status",
      ordenavel: true,
      largura: 110,
      render: (l) => <StatusPill status={l.ativo ? "Ativo" : "Inativo"} tone={l.ativo ? "ok" : "neutral"} />,
    },
    {
      chave: "acao",
      titulo: "Ação",
      alinhar: "centro",
      largura: 68,
      render: (l) => (
        <button
          type="button"
          className={styles.verBtn}
          onClick={() => setEmEdicao(l)}
          title={`Editar ${l.nome}`}
          aria-label={`Editar ${l.nome}`}
        >
          <PanelIcon name="settings" size={16} />
        </button>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        titulo="Usuários"
        descricao="Quem tem acesso ao Painel de Gestão e com qual perfil."
        trilha={[{ label: "Configurações" }, { label: "Usuários" }]}
        acoes={
          <PanelButton icon="plus" size="sm" onClick={() => setEmEdicao("novo")}>
            Novo usuário
          </PanelButton>
        }
      />

      <PanelCard padding="none">
        <EstadoDaTela carregando={carregando} erro={erro} onTentarNovamente={recarregar} esqueleto="tabela" colunas={6}>
        <DataTable
          colunas={colunas}
          linhas={usuarios}
          rodape={`${usuarios.filter((u) => u.ativo).length} de ${meta?.total ?? usuarios.length} usuários ativos`}
          vazio={{ icone: "users", titulo: "Nenhum usuário cadastrado." }}
        />
        </EstadoDaTela>
      </PanelCard>

      <PanelModal
        aberto={Boolean(emEdicao)}
        aoFechar={() => setEmEdicao(null)}
        titulo={emEdicao === "novo" ? "Novo usuário" : `Editar ${emEdicao?.nome || "usuário"}`}
        descricao="O perfil define o que a pessoa vê e pode fazer no sistema."
        largura={640}
      >
        <FormularioUsuario
          // A `key` recria o formulário a cada utilizador: sem ela os campos
          // não controlados guardavam os valores do anterior ao reabrir.
          key={emEdicao === "novo" ? "novo" : emEdicao?.id}
          usuario={emEdicao === "novo" ? null : emEdicao}
          aoCancelar={() => setEmEdicao(null)}
          aoGravar={() => {
            setEmEdicao(null);
            recarregar();
          }}
        />
      </PanelModal>
    </>
  );
}
