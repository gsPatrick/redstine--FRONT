"use client";

import { useState } from "react";
import PageHeader from "@/components/panel/molecules/PageHeader/PageHeader";
import PanelCard from "@/components/panel/molecules/PanelCard/PanelCard";
import StatCard from "@/components/panel/molecules/StatCard/StatCard";
import PeriodFilter from "@/components/panel/molecules/PeriodFilter/PeriodFilter";
import LineChart from "@/components/panel/molecules/LineChart/LineChart";
import DonutChart from "@/components/panel/molecules/DonutChart/DonutChart";
import PanelIcon from "@/components/panel/atoms/PanelIcon/PanelIcon";
import Link from "next/link";
import EstadoDaTela from "@/components/panel/molecules/EstadoDaTela/EstadoDaTela";
import { useRecurso, useLista, comFiltros } from "@/lib/painel/api-cliente";
import { moeda, numero, variacao, tempoRelativo } from "@/lib/painel/formato";
import styles from "./gestao.module.css";

/**
 * Visao Geral da gestao — resumo executivo, nao substituto de Comercial nem
 * de Financeiro. Responde a uma pergunta: como esta o negocio agora e o que
 * precisa de atencao?
 *
 * Os quatro primeiros cartoes sao ESTADO e ignoram o filtro; os dois seguintes
 * sao FLUXO e respondem a ele. O rotulo "Situação atual" no cartao existe
 * exatamente para o gestor nao achar que o numero deixou de atualizar.
 */
/** Pendências: cada uma leva à lista onde se resolve. */
function pendenciasDe(alertas) {
  return [
    { rotulo: "Consultas aguardando atendimento", valor: alertas.consultasEmAberto, icone: "chat", tone: "warn", href: "/gestao/comercial/consultas", hrefLabel: "Ver consultas" },
    { rotulo: "Ativos aguardando avaliação", valor: alertas.enviosSemAvaliacao, icone: "box", tone: "warn", href: "/gestao/comercial/ativos", hrefLabel: "Ver ativos" },
    { rotulo: "Ativos aguardando aprovação", valor: alertas.ativosAguardandoAprovacao, icone: "clock", tone: "info", href: "/gestao/comercial/ativos", hrefLabel: "Ver ativos" },
    { rotulo: "Repasses fora do prazo", valor: alertas.repassesForaDoPrazo, icone: "wallet", tone: "accent", href: "/gestao/financeiro/repasses", hrefLabel: "Ver repasses" },
  ];
}

export default function VisaoGeralGestaoPage() {
  const [periodo, setPeriodo] = useState("30d");
  const { dados, carregando, erro, recarregar } = useRecurso(
    comFiltros("/management/overview", { periodo })
  );
  const { linhas: notificacoes } = useLista("/notifications?perPage=4");

  const estado = dados?.estado;
  const fluxo = dados?.fluxo;
  const financeiro = dados?.financeiro;
  const variacoes = dados?.variacoes;

  return (
    <>
      <PageHeader
        titulo="Visão Geral"
        descricao="Resumo geral da plataforma."
        acoes={<PeriodFilter valor={periodo} onChange={setPeriodo} />}
      />

      <EstadoDaTela carregando={carregando} erro={erro} onTentarNovamente={recarregar} esqueleto="cards" quantidade={6}>
      {dados && (
      <>
      <div className={styles.kpis}>
        <StatCard
          rotulo="Fornecedores ativos"
          valor={numero(estado.fornecedoresAtivos)}
          icone="users"
          tone="info"
          natureza="estado"
        />
        <StatCard
          rotulo="Ativos publicados"
          valor={numero(estado.ativosPublicados)}
          icone="box"
          tone="ok"
          natureza="estado"
        />
        <StatCard
          rotulo="Valor total publicado"
          valor={moeda(estado.valorTotalPublicado, { curta: true })}
          icone="tag"
          tone="accent"
          natureza="estado"
        />
        <StatCard
          rotulo="Vendas realizadas"
          valor={moeda(fluxo.valorVendido, { curta: true })}
          icone="chart"
          tone="ok"
          variacao={variacao(variacoes.valorVendido)}
        />
        <StatCard
          rotulo="Receita RED"
          valor={moeda(financeiro.receitaRed, { curta: true })}
          icone="wallet"
          tone="accent"
          nota="Acumulado"
        />
        <StatCard
          rotulo="Valor a repassar"
          valor={moeda(financeiro.aRepassar, { curta: true })}
          icone="clock"
          tone="warn"
          nota="Devido e não pago"
        />
      </div>

      <div className={styles.pendencias}>
        {pendenciasDe(dados.alertas).map((p) => (
          <StatCard key={p.rotulo} valor={numero(p.valor)} {...p} destaque={p.valor > 0} />
        ))}

        <PanelCard titulo="Últimas notificações" className={styles.avisos}>
          <ul className={styles.listaAvisos}>
            {(notificacoes || []).slice(0, 4).map((n) => (
              <li key={n.id}>
                <Link href={n.link || "#"}>
                  <span className={`${styles.ponto} ${styles.info}`} />
                  <span className={styles.avisoTexto}>{n.title}</span>
                  <time>{tempoRelativo(n.createdAt)}</time>
                </Link>
              </li>
            ))}
          </ul>
        </PanelCard>
      </div>

      <div className={styles.graficos}>
        <PanelCard
          titulo="Evolução das vendas (valor bruto)"
          acao={<span className={styles.tagPeriodo}>Últimos 6 meses</span>}
        >
          <LineChart dados={dados.graficos.evolucaoVendas} />
        </PanelCard>

        <PanelCard
          titulo="Vendas por categoria (valor bruto)"
          acao={<span className={styles.tagPeriodo}>Últimos 30 dias</span>}
        >
          <DonutChart dados={dados.graficos.vendasPorCategoria} formato={(v) => moeda(v, { curta: true })} />
        </PanelCard>
      </div>

      </>
      )}
      </EstadoDaTela>

      <p className={styles.rodapeNota}>
        <PanelIcon name="alert" size={13} />
        Fornecedores ativos, ativos publicados, valor publicado e valor a repassar são a fotografia
        de agora e não respondem ao filtro de período.
      </p>
    </>
  );
}
