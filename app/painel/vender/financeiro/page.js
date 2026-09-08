"use client";

import { useState } from "react";
import PageHeader from "@/components/panel/molecules/PageHeader/PageHeader";
import PanelCard from "@/components/panel/molecules/PanelCard/PanelCard";
import StatCard from "@/components/panel/molecules/StatCard/StatCard";
import DataTable from "@/components/panel/molecules/DataTable/DataTable";
import TabFilter from "@/components/panel/molecules/TabFilter/TabFilter";
import PeriodFilter from "@/components/panel/molecules/PeriodFilter/PeriodFilter";
import StatusPill from "@/components/panel/atoms/StatusPill/StatusPill";
import EstadoDaTela from "@/components/panel/molecules/EstadoDaTela/EstadoDaTela";
import { useLista, useRecurso, comFiltros } from "@/lib/painel/api-cliente";
import { moeda, percentual, data as fmtData } from "@/lib/painel/formato";
import styles from "./financeiro.module.css";

/**
 * Financeiro do fornecedor — a pagina dona do assunto.
 *
 * Os quatro indicadores aparecem juntos aqui, e so aqui, na sequencia oficial:
 *
 *   POTENCIAL -> REALIZADO -> A RECEBER -> RECEBIDO
 *
 * Sao baldes mutuamente excludentes: o mesmo dinheiro nunca e somado em dois
 * deles. Um valor que esta em "A receber" saiu de "Vendas realizadas".
 *
 * O historico de pagamentos e uma aba desta pagina, nao uma pagina propria: o
 * documento e explicito ao dizer que o historico financeiro pertence ao
 * Financeiro.
 */
export default function FinanceiroFornecedorPage() {
  const [periodo, setPeriodo] = useState("30d");
  const [aba, setAba] = useState("movimentacoes");

  // Os cartões saem do mesmo endpoint do dashboard: um só cálculo de receita
  // potencial e de carteira, para as duas telas não divergirem.
  const resumo = useRecurso(comFiltros("/me/sales-dashboard", { periodo }));
  const movs = useLista(comFiltros("/me/sales", { periodo, perPage: 100 }));
  // O histórico só carrega quando a aba abre — é a lista mais pesada e a
  // maioria dos acessos fica em Movimentações.
  const pags = useLista("/me/payments?perPage=100", { ativo: aba === "pagamentos" });

  const vendas = movs.linhas;
  const pagamentos = pags.linhas;
  const estado = resumo.dados?.estado;
  const fluxo = resumo.dados?.fluxo;

  const colunasMov = [
    {
      chave: "data",
      titulo: "Data",
      ordenavel: true,
      largura: 105,
      valor: (l) => new Date(l.data).getTime(),
      render: (l) => fmtData(l.data),
    },
    { chave: "ativo", titulo: "Ativo", ordenavel: true },
    { chave: "venda", titulo: "Venda", ordenavel: true, largura: 88 },
    {
      chave: "valorVenda",
      titulo: "Valor bruto",
      ordenavel: true,
      alinhar: "direita",
      largura: 125,
      render: (l) => moeda(l.valorVenda),
    },
    {
      chave: "participacao",
      titulo: "Participação",
      ordenavel: true,
      alinhar: "direita",
      largura: 110,
      render: (l) => percentual(l.participacao),
    },
    {
      chave: "valorFornecedor",
      titulo: "Valor fornecedor",
      ordenavel: true,
      alinhar: "direita",
      largura: 140,
      render: (l) => <strong>{moeda(l.valorFornecedor)}</strong>,
    },
    {
      chave: "status",
      titulo: "Status",
      ordenavel: true,
      largura: 165,
      render: (l) => <StatusPill status={l.status} />,
    },
  ];

  const colunasPag = [
    {
      chave: "data",
      titulo: "Data do pagamento",
      ordenavel: true,
      largura: 165,
      valor: (l) => new Date(l.data).getTime(),
      render: (l) => fmtData(l.data, { comHora: true }),
    },
    { chave: "venda", titulo: "Venda relacionada", ordenavel: true, largura: 150 },
    { chave: "ativo", titulo: "Ativo", ordenavel: true },
    {
      chave: "valor",
      titulo: "Valor",
      ordenavel: true,
      alinhar: "direita",
      largura: 130,
      render: (l) => <strong>{moeda(l.valor)}</strong>,
    },
    { chave: "meio", titulo: "Meio do repasse", largura: 175 },
    {
      chave: "comprovante",
      titulo: "Comprovante",
      largura: 150,
      render: (l) => <code className={styles.codigo}>{l.comprovante}</code>,
    },
  ];

  return (
    <>
      <PageHeader
        titulo="Financeiro"
        descricao="Toda a informação financeira detalhada dos seus ativos."
        trilha={[{ label: "Vender" }, { label: "Financeiro" }]}
        acoes={<PeriodFilter valor={periodo} onChange={setPeriodo} />}
      />

      <EstadoDaTela
        carregando={resumo.carregando}
        erro={resumo.erro}
        onTentarNovamente={resumo.recarregar}
        altura={150}
      >
      {resumo.dados && (
      <div className={styles.cards}>
        <StatCard
          rotulo="Receita potencial"
          valor={moeda(estado.receitaPotencial, { curta: true })}
          icone="trend"
          tone="accent"
          natureza="estado"
        />
        <StatCard
          rotulo="Vendas realizadas"
          valor={moeda(fluxo.vendasRealizadas, { curta: true })}
          icone="chart"
          tone="info"
          nota="No período"
        />
        <StatCard
          rotulo="A receber"
          valor={moeda(estado.aReceber, { curta: true })}
          icone="clock"
          tone="warn"
          nota="Repasse em até 48h após a conclusão"
          destaque
        />
        <StatCard
          rotulo="Recebido"
          valor={moeda(fluxo.recebido, { curta: true })}
          icone="wallet"
          tone="ok"
          nota="No período"
        />
      </div>
      )}
      </EstadoDaTela>

      <p className={styles.legenda}>
        A sequência é acumulativa e mutuamente excludente: potencial → realizado → a receber →
        recebido. Receita potencial é a fotografia atual e não responde ao filtro.
      </p>

      <PanelCard padding="none">
        <TabFilter
          opcoes={[
            { valor: "movimentacoes", label: "Movimentações", contador: vendas.length },
            { valor: "pagamentos", label: "Histórico de pagamentos", contador: pagamentos.length },
          ]}
          valor={aba}
          onChange={setAba}
          className={styles.abas}
        />

        {aba === "movimentacoes" ? (
          <EstadoDaTela carregando={movs.carregando} erro={movs.erro} onTentarNovamente={movs.recarregar}>
          <DataTable
            colunas={colunasMov}
            linhas={vendas}
            rodape={`Mostrando 1 a ${vendas.length} de ${vendas.length} movimentações`}
            vazio={{ icone: "wallet", titulo: "Nenhuma movimentação no período." }}
          />
          </EstadoDaTela>
        ) : (
          <EstadoDaTela carregando={pags.carregando} erro={pags.erro} onTentarNovamente={pags.recarregar}>
          <DataTable
            colunas={colunasPag}
            linhas={pagamentos}
            rodape={`Mostrando 1 a ${pagamentos.length} de ${pagamentos.length} pagamentos`}
            vazio={{ icone: "wallet", titulo: "Nenhum pagamento realizado ainda." }}
          />
          </EstadoDaTela>
        )}
      </PanelCard>
    </>
  );
}
