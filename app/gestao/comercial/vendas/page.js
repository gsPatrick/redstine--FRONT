"use client";

import Link from "next/link";
import { useState } from "react";
import PageHeader from "@/components/panel/molecules/PageHeader/PageHeader";
import PanelCard from "@/components/panel/molecules/PanelCard/PanelCard";
import DataTable from "@/components/panel/molecules/DataTable/DataTable";
import StatCard from "@/components/panel/molecules/StatCard/StatCard";
import PeriodFilter from "@/components/panel/molecules/PeriodFilter/PeriodFilter";
import StatusPill from "@/components/panel/atoms/StatusPill/StatusPill";
import PanelIcon from "@/components/panel/atoms/PanelIcon/PanelIcon";
import EstadoDaTela from "@/components/panel/molecules/EstadoDaTela/EstadoDaTela";
import { useLista, useRecurso, comFiltros } from "@/lib/painel/api-cliente";
import { moeda, numero, percentual, data as fmtData } from "@/lib/painel/formato";
import styles from "../comercial.module.css";

/**
 * Comercial — Vendas.
 *
 * O Comercial ve o que precisa para compreender a venda: cliente, fornecedor,
 * ativo, valor bruto e estado da retirada. O que fica de fora e deliberado —
 * receita liquida da RED, repasse consolidado e comprovante de pagamento vivem
 * no Financeiro, e o perfil Comercial nao tem essa capacidade.
 */
export default function VendasGestaoPage() {
  const [periodo, setPeriodo] = useState("30d");
  const lista = useLista(comFiltros("/management/sales", { periodo, perPage: 100 }));
  const resumo = useRecurso(comFiltros("/management/sales/summary", { periodo }));

  const movimentacoes = lista.linhas;
  const r = resumo.dados;

  const colunas = [
    { chave: "venda", titulo: "Venda", ordenavel: true, largura: 86 },
    {
      chave: "data",
      titulo: "Data",
      ordenavel: true,
      largura: 110,
      valor: (l) => new Date(l.data).getTime(),
      render: (l) => fmtData(l.data),
    },
    { chave: "cliente", titulo: "Cliente", ordenavel: true, largura: 165 },
    { chave: "fornecedor", titulo: "Fornecedor", ordenavel: true, largura: 165 },
    { chave: "ativo", titulo: "Ativo", ordenavel: true },
    {
      chave: "quantidade",
      titulo: "Qtd.",
      ordenavel: true,
      alinhar: "direita",
      largura: 80,
      render: (l) => numero(l.quantidade),
    },
    {
      chave: "valorBruto",
      titulo: "Valor bruto",
      ordenavel: true,
      alinhar: "direita",
      largura: 125,
      render: (l) => <strong>{moeda(l.valorBruto)}</strong>,
    },
    {
      chave: "participacaoFornecedor",
      titulo: "Modelo",
      ordenavel: true,
      alinhar: "direita",
      largura: 90,
      render: (l) => <span className={styles.pct}>{percentual(l.participacaoFornecedor)}</span>,
    },
    {
      chave: "statusRetirada",
      titulo: "Status",
      ordenavel: true,
      largura: 160,
      render: (l) => <StatusPill status={l.statusRetirada} />,
    },
    {
      chave: "acao",
      titulo: "Ação",
      alinhar: "centro",
      largura: 68,
      render: (l) => (
        <Link
          href={`/gestao/financeiro/movimentacoes/${l.id}`}
          className={styles.verBtn}
          aria-label={`Ver venda ${l.venda}`}
        >
          <PanelIcon name="eye" size={16} />
        </Link>
      ),
    },
  ];


  return (
    <>
      <PageHeader
        titulo="Vendas"
        descricao="Vendas consolidadas da plataforma."
        trilha={[{ label: "Comercial" }, { label: "Vendas" }]}
        acoes={<PeriodFilter valor={periodo} onChange={setPeriodo} />}
      />

      <EstadoDaTela carregando={resumo.carregando} erro={resumo.erro} onTentarNovamente={resumo.recarregar} altura={130}>
      {r && (
      <div className={styles.kpis4}>
        <StatCard
          rotulo="Vendas realizadas"
          valor={numero(r.vendasRealizadas)}
          icone="tag"
          tone="ok"
          nota="No período"
        />
        <StatCard
          rotulo="Valor bruto vendido"
          valor={moeda(r.valorBrutoVendido, { curta: true })}
          icone="chart"
          tone="info"
          nota="No período"
        />
        <StatCard
          rotulo="Ticket médio"
          valor={r.ticketMedio == null ? "—" : moeda(r.ticketMedio, { curta: true })}
          icone="trend"
          tone="accent"
          nota="No período"
        />
        <StatCard
          rotulo="Aguardando retirada"
          valor={numero(r.aguardandoRetirada)}
          icone="truck"
          tone="warn"
          nota="Pendência operacional"
          destaque={r.aguardandoRetirada > 0}
        />
      </div>
      )}
      </EstadoDaTela>

      <PanelCard padding="none">
        <EstadoDaTela carregando={lista.carregando} erro={lista.erro} onTentarNovamente={lista.recarregar}>
        <DataTable
          colunas={colunas}
          linhas={movimentacoes}
          rodape={`Mostrando ${movimentacoes.length} de ${lista.meta?.total ?? movimentacoes.length} vendas`}
          vazio={{ icone: "tag", titulo: "Nenhuma venda no período." }}
        />
        </EstadoDaTela>
      </PanelCard>
    </>
  );
}
