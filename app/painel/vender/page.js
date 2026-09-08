"use client";

import { useState } from "react";
import PageHeader from "@/components/panel/molecules/PageHeader/PageHeader";
import PanelCard from "@/components/panel/molecules/PanelCard/PanelCard";
import StatCard from "@/components/panel/molecules/StatCard/StatCard";
import PeriodFilter from "@/components/panel/molecules/PeriodFilter/PeriodFilter";
import BarChart from "@/components/panel/molecules/BarChart/BarChart";
import DonutChart from "@/components/panel/molecules/DonutChart/DonutChart";
import { moeda, numero } from "@/lib/painel/formato";
import EstadoDaTela from "@/components/panel/molecules/EstadoDaTela/EstadoDaTela";
import { useRecurso, comFiltros } from "@/lib/painel/api-cliente";
import styles from "./dashboard.module.css";

/**
 * Dashboard de Vendas — o painel gerencial do fornecedor.
 *
 * Nao replica Meus Ativos, Vendas nem Financeiro: apresenta os indicadores e
 * entrega o utilizador na pagina que aprofunda cada um.
 *
 * A distincao que o documento exige, e que aqui vira codigo:
 *
 *   ESTADO (sem filtro)  ativos publicados, receita potencial
 *   FLUXO  (com filtro)  ativos vendidos, vendas realizadas, a receber, recebido
 *
 * Um fornecedor que troca para "30 dias" e ve "ativos publicados" cair de 12
 * para 3 conclui que perdeu ativos. Por isso o cartao de estado carrega o
 * rotulo "Situação atual" e ignora o seletor.
 */
export default function DashboardVendasPage() {
  const [periodo, setPeriodo] = useState("30d");
  const { dados, carregando, erro, recarregar } = useRecurso(
    comFiltros("/me/sales-dashboard", { periodo })
  );

  // `estado` e `fluxo` chegam separados da API — é o contrato que impede a
  // tela de aplicar o filtro a um indicador que não deve responder a ele.
  const estado = dados?.estado;
  const fluxo = dados?.fluxo;

  return (
    <>
      <PageHeader
        titulo="Painel de Vendas"
        descricao="Acompanhe seus ativos, vendas e resultados na RED."
        trilha={[{ label: "Vender" }, { label: "Dashboard" }]}
        acoes={<PeriodFilter valor={periodo} onChange={setPeriodo} />}
      />

      <EstadoDaTela carregando={carregando} erro={erro} onTentarNovamente={recarregar} altura={420}>
      {dados && (
      <>
      <div className={styles.cards}>
        <StatCard
          rotulo="Ativos publicados"
          valor={numero(estado.ativosPublicados)}
          icone="box"
          tone="ok"
          natureza="estado"
          href="/painel/vender/ativos"
          hrefLabel="Ver ativos"
        />
        <StatCard
          rotulo="Ativos vendidos"
          valor={numero(fluxo.ativosVendidos)}
          icone="tag"
          tone="info"
          nota="No período"
          href="/painel/vender/vendas"
          hrefLabel="Ver vendas"
        />
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
          nota="Aguardando repasse"
          destaque
        />
        <StatCard
          rotulo="Recebido"
          valor={moeda(fluxo.recebido, { curta: true })}
          icone="wallet"
          tone="ok"
          nota="No período"
          href="/painel/vender/financeiro"
          hrefLabel="Ver financeiro"
        />
      </div>

      <p className={styles.legendaEstado}>
        Ativos publicados e receita potencial são a fotografia de agora e não respondem ao filtro
        de período.
      </p>

      <div className={styles.graficos}>
        <PanelCard titulo="Resultados financeiros" descricao="Vendas realizadas e valores recebidos">
          <BarChart
            dados={dados.graficos.resultados}
            series={[
              { chave: "realizado", label: "Vendas realizadas", cor: "#c40404" },
              { chave: "recebido", label: "Valores recebidos", cor: "#1a8a4a" },
            ]}
          />
        </PanelCard>

        <PanelCard titulo="Ativos por status" descricao="Distribuição do seu portfólio">
          <DonutChart
            dados={dados.graficos.ativosPorStatus}
            total={dados.graficos.ativosPorStatus.reduce((a, d) => a + d.valor, 0)}
            formato={(v) => `${v}`}
          />
        </PanelCard>
      </div>
      </>
      )}
      </EstadoDaTela>
    </>
  );
}
