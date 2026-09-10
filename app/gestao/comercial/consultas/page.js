"use client";

import { useMemo, useState } from "react";
import PageHeader from "@/components/panel/molecules/PageHeader/PageHeader";
import PanelCard from "@/components/panel/molecules/PanelCard/PanelCard";
import DataTable from "@/components/panel/molecules/DataTable/DataTable";
import StatCard from "@/components/panel/molecules/StatCard/StatCard";
import PeriodFilter from "@/components/panel/molecules/PeriodFilter/PeriodFilter";
import PanelField from "@/components/panel/molecules/PanelField/PanelField";
import StatusPill from "@/components/panel/atoms/StatusPill/StatusPill";
import PanelIcon from "@/components/panel/atoms/PanelIcon/PanelIcon";
import EstadoDaTela from "@/components/panel/molecules/EstadoDaTela/EstadoDaTela";
import PanelModal from "@/components/panel/molecules/PanelModal/PanelModal";
import Atendimento from "./Atendimento";
import { useLista, useRecurso, comFiltros } from "@/lib/painel/api-cliente";
import { numero, percentual, data as fmtData, variacao } from "@/lib/painel/formato";
import styles from "../comercial.module.css";

/**
 * Comercial — Consultas.
 *
 * Area exclusiva da gestao RED. O fornecedor nao recebe, nao responde e nao ve
 * os dados do comprador: a consulta pertence a relacao comprador -> RED. Por
 * isso a coluna "Responsável" e da equipa RED, e nao ha nada aqui espelhado
 * para o lado do fornecedor.
 */
export default function ConsultasGestaoPage() {
  const [atendendo, setAtendendo] = useState(null);
  const [periodo, setPeriodo] = useState("30d");
  const [status, setStatus] = useState("");

  const lista = useLista(
    comFiltros("/management/consultations", { periodo, status: status || undefined, perPage: 100 })
  );
  const resumo = useRecurso(comFiltros("/management/consultations/summary", { periodo }));

  const linhas = lista.linhas;
  const r = resumo.dados;

  const colunas = [
    {
      chave: "data",
      titulo: "Data",
      ordenavel: true,
      largura: 156,
      valor: (l) => new Date(l.data).getTime(),
      render: (l) => fmtData(l.data, { comHora: true }),
    },
    { chave: "cliente", titulo: "Cliente", ordenavel: true, largura: 170 },
    { chave: "ativo", titulo: "Ativo", ordenavel: true },
    {
      chave: "quantidade",
      titulo: "Quantidade",
      ordenavel: true,
      alinhar: "direita",
      largura: 105,
      render: (l) => `${numero(l.quantidade)} un.`,
    },
    {
      chave: "status",
      titulo: "Status",
      ordenavel: true,
      largura: 150,
      render: (l) => <StatusPill status={l.status} />,
    },
    { chave: "responsavel", titulo: "Responsável", ordenavel: true, largura: 145 },
    {
      chave: "atualizacao",
      titulo: "Última atualização",
      ordenavel: true,
      largura: 155,
      valor: (l) => new Date(l.atualizacao).getTime(),
      render: (l) => fmtData(l.atualizacao, { comHora: true }),
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
          onClick={() => setAtendendo(l.id)}
          title={`Atender ${l.reference || "consulta"}`}
          aria-label={`Atender ${l.reference || "consulta"}`}
        >
          <PanelIcon name="eye" size={16} />
        </button>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        titulo="Consultas"
        descricao="Gerencie todas as consultas recebidas."
        trilha={[{ label: "Comercial" }, { label: "Consultas" }]}
        acoes={
          <>
            <PeriodFilter valor={periodo} onChange={setPeriodo} />
            <PanelField
              name="status"
              as="select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              opcoes={[
                { valor: "", label: "Todos os status" },
                { valor: "nova", label: "Nova" },
                { valor: "em_atendimento", label: "Em atendimento" },
                { valor: "respondida", label: "Respondida" },
                { valor: "encerrada", label: "Encerrada" },
              ]}
              className={styles.filtroSelect}
            />
          </>
        }
      />

      <EstadoDaTela carregando={resumo.carregando} erro={resumo.erro} onTentarNovamente={resumo.recarregar} esqueleto="cards" quantidade={5}>
      {r && (
      <div className={styles.kpis5}>
        <StatCard
          rotulo="Total de consultas"
          valor={numero(r.total)}
          icone="chat"
          tone="info"
          nota="No período"
        />
        <StatCard
          rotulo="Novas"
          valor={numero(r.novas)}
          icone="alert"
          tone="warn"
          nota="Aguardando atendimento"
          destaque
        />
        <StatCard
          rotulo="Em atendimento"
          valor={numero(r.emAtendimento)}
          icone="clock"
          tone="info"
          nota="Em andamento"
        />
        <StatCard
          rotulo="Respondidas"
          valor={numero(r.respondidas)}
          icone="checkCircle"
          tone="ok"
          nota={`${percentual(r.percentualRespondidas)} do total`}
        />
        <StatCard
          rotulo="Encerradas"
          valor={numero(r.encerradas)}
          icone="check"
          tone="neutral"
          nota={`${percentual(r.percentualEncerradas)} do total`}
        />
      </div>
      )}
      </EstadoDaTela>

      <PanelCard padding="none">
        <EstadoDaTela carregando={lista.carregando} erro={lista.erro} onTentarNovamente={lista.recarregar} esqueleto="tabela" colunas={8}>
        <DataTable
          colunas={colunas}
          linhas={linhas}
          rodape={`Mostrando ${linhas.length} de ${lista.meta?.total ?? linhas.length} consultas`}
          vazio={{ icone: "chat", titulo: "Nenhuma consulta com este status." }}
        />
        </EstadoDaTela>
      </PanelCard>

      <PanelModal
        aberto={Boolean(atendendo)}
        aoFechar={() => setAtendendo(null)}
        titulo="Atendimento da consulta"
        descricao="Responder com preço e condições, definir responsável ou encerrar."
        largura={680}
      >
        {atendendo && (
          <Atendimento
            id={atendendo}
            aoMudar={() => lista.recarregar?.()}
          />
        )}
      </PanelModal>
    </>
  );
}
