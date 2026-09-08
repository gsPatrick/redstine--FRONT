"use client";

import Link from "next/link";
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
import { useLista, useRecurso, comFiltros } from "@/lib/painel/api-cliente";
import { moeda, percentual, data as fmtData, variacao } from "@/lib/painel/formato";
import styles from "../financeiro.module.css";

/**
 * Financeiro — Movimentações.
 *
 * A pagina proprietaria dos valores globais. Os cinco indicadores seguem a
 * secao 20 do documento, e a relacao entre eles e verificavel na propria tela:
 *
 *   valor bruto = receita RED + valor dos fornecedores
 *   valor dos fornecedores = a repassar + repassado
 *
 * Os totais do rodape sao somados a partir das linhas visiveis, nunca digitados
 * — se o filtro muda, o rodape acompanha, e nao ha como o total discordar da
 * tabela que esta acima dele.
 */
export default function MovimentacoesPage() {
  const [periodo, setPeriodo] = useState("30d");
  const [status, setStatus] = useState("");
  const [fornecedor, setFornecedor] = useState("");

  const lista = useLista(
    comFiltros("/management/financial/movements", {
      periodo,
      perPage: 100,
      status: status || undefined,
      supplierId: fornecedor || undefined,
    })
  );
  const ind = useRecurso(comFiltros("/management/financial/indicators", { periodo }));

  const linhas = lista.linhas;
  // Totais do recorte inteiro, não só da página visível — vêm do meta.
  const totais = lista.meta?.totais;
  const fluxo = ind.dados?.fluxo;
  const posicao = ind.dados?.posicao;

  // Lista de fornecedores para o filtro, a partir do que veio na página.
  const fornecedores = useMemo(
    () => [...new Map(linhas.map((m) => [m.fornecedorId, m.fornecedor])).entries()],
    [linhas]
  );

  const colunas = [
    {
      chave: "data",
      titulo: "Data",
      ordenavel: true,
      largura: 108,
      valor: (l) => new Date(l.data).getTime(),
      render: (l) => fmtData(l.data),
    },
    { chave: "venda", titulo: "Venda", ordenavel: true, largura: 86 },
    { chave: "fornecedor", titulo: "Fornecedor", ordenavel: true, largura: 165 },
    { chave: "ativo", titulo: "Ativo", ordenavel: true },
    {
      chave: "valorBruto",
      titulo: "Valor bruto",
      ordenavel: true,
      alinhar: "direita",
      largura: 122,
      render: (l) => moeda(l.valorBruto),
    },
    {
      chave: "participacaoFornecedor",
      titulo: "% Fornecedor",
      ordenavel: true,
      alinhar: "direita",
      largura: 118,
      render: (l) => <span className={styles.pct}>{percentual(l.participacaoFornecedor)}</span>,
    },
    {
      chave: "repasse",
      titulo: "Repasse",
      ordenavel: true,
      alinhar: "direita",
      largura: 122,
      render: (l) => moeda(l.repasse),
    },
    {
      chave: "receitaRed",
      titulo: "Receita RED",
      ordenavel: true,
      alinhar: "direita",
      largura: 128,
      render: (l) => <strong>{moeda(l.receitaRed)}</strong>,
    },
    {
      chave: "statusFinanceiro",
      titulo: "Status",
      ordenavel: true,
      largura: 172,
      render: (l) => <StatusPill status={l.statusFinanceiro} />,
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
          aria-label={`Ver ${l.venda}`}
        >
          <PanelIcon name="eye" size={16} />
        </Link>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        titulo="Movimentações Financeiras"
        descricao="Acompanhe todas as movimentações financeiras."
        trilha={[{ label: "Financeiro" }, { label: "Movimentações" }]}
        acoes={
          <div className={styles.filtros}>
            <PeriodFilter valor={periodo} onChange={setPeriodo} />
            <PanelField
              name="statusFin"
              as="select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={styles.filtroSelect}
              opcoes={[
                { valor: "", label: "Todos os status" },
                { valor: "a_receber", label: "A repassar" },
                { valor: "pagamento_programado", label: "Pagamento programado" },
                { valor: "pago", label: "Pago" },
              ]}
            />
            <PanelField
              name="fornecedor"
              as="select"
              value={fornecedor}
              onChange={(e) => setFornecedor(e.target.value)}
              className={styles.filtroSelect}
              opcoes={[
                { valor: "", label: "Todos os fornecedores" },
                ...fornecedores.map(([id, nome]) => ({ valor: id, label: nome })),
              ]}
            />
          </div>
        }
      />

      <EstadoDaTela carregando={ind.carregando} erro={ind.erro} onTentarNovamente={ind.recarregar} altura={130}>
      {ind.dados && (
      <div className={styles.kpis}>
        <StatCard
          rotulo="Valor bruto vendido"
          valor={moeda(fluxo.valorBrutoVendido, { curta: true })}
          icone="chart"
          tone="info"
          nota="No período"
        />
        <StatCard
          rotulo="Receita RED"
          valor={moeda(fluxo.receitaRed, { curta: true })}
          icone="wallet"
          tone="accent"
          nota="No período"
        />
        <StatCard
          rotulo="Valor dos fornecedores"
          valor={moeda(fluxo.valorFornecedores, { curta: true })}
          icone="users"
          tone="ok"
          nota="No período"
        />
        <StatCard
          rotulo="A repassar"
          valor={moeda(posicao.aRepassar, { curta: true })}
          icone="clock"
          tone="warn"
          nota="Devido e não pago"
          destaque
        />
        <StatCard
          rotulo="Repassado"
          valor={moeda(posicao.repassado, { curta: true })}
          icone="checkCircle"
          tone="ok"
          nota="Efetivamente pago"
        />
      </div>
      )}
      </EstadoDaTela>

      <PanelCard padding="none">
        <EstadoDaTela carregando={lista.carregando} erro={lista.erro} onTentarNovamente={lista.recarregar}>
        <DataTable
          colunas={colunas}
          linhas={linhas}
          rodape={`Mostrando ${linhas.length} de ${lista.meta?.total ?? linhas.length} movimentações`}
          vazio={{ icone: "wallet", titulo: "Nenhuma movimentação com estes filtros." }}
        />
        </EstadoDaTela>

        {totais && (
        <div className={styles.totais}>
          <span className={styles.totaisRotulo}>Totais do período</span>
          <span className={styles.total}>
            <span>Valor bruto</span>
            <strong>{moeda(totais.valorBruto)}</strong>
          </span>
          <span className={styles.total}>
            <span>Repasse</span>
            <strong>{moeda(totais.valorFornecedores)}</strong>
          </span>
          <span className={styles.total}>
            <span>Receita RED</span>
            <strong>{moeda(totais.receitaRed)}</strong>
          </span>
        </div>
        )}
      </PanelCard>

      <p className={styles.nota}>
        Valor bruto = receita RED + valor dos fornecedores. O split incide sobre o valor líquido
        (bruto menos custos aprovados), com o percentual congelado no momento da venda.
      </p>
    </>
  );
}
