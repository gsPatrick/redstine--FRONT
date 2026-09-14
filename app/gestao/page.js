"use client";

import { useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/panel/molecules/PageHeader/PageHeader";
import PanelCard from "@/components/panel/molecules/PanelCard/PanelCard";
import StatCard from "@/components/panel/molecules/StatCard/StatCard";
import PeriodFilter from "@/components/panel/molecules/PeriodFilter/PeriodFilter";
import LineChart from "@/components/panel/molecules/LineChart/LineChart";
import PanelIcon from "@/components/panel/atoms/PanelIcon/PanelIcon";
import EstadoDaTela from "@/components/panel/molecules/EstadoDaTela/EstadoDaTela";
import { useRecurso, useLista, comFiltros } from "@/lib/painel/api-cliente";
import { moeda, numero, variacao, tempoRelativo } from "@/lib/painel/formato";
import styles from "./gestao.module.css";

/**
 * Visão Geral da gestão — saúde global, NÃO uma quarta área.
 *
 * O cliente foi explícito: dois ou três KPIs críticos de cada área, e nada
 * mais. A versão anterior tinha seis indicadores soltos mais quatro pendências
 * e dois gráficos, e mesmo assim não respondia "como está o negócio": era um
 * resumo do Comercial com dois números do Financeiro pendurados no fim.
 *
 * Agora é uma linha por área, três cartões em cada:
 *
 *   Comercial  — quanto vendemos no período, quantas consultas estão paradas,
 *                quantos ativos esperam o fornecedor.
 *   Operação   — quanto inventário há, quanto vale, o que não saiu do lugar.
 *   Financeiro — quanto a RED ganhou, quanto deve, quanto está fora do prazo.
 *
 * Cada bloco só aparece se a sessão tiver a capacidade da área, e isso não é
 * cortesia de menu: a API deixou de devolver os números das outras. Antes esta
 * tela pedia uma rota que exigia `commercial_read` e recebia `receitaRed` e
 * `aRepassar` no mesmo payload — ou seja, o perfil Comercial lia receita da RED
 * e repasse aqui, justamente o que a regra de negócio proíbe.
 *
 * Os cartões de ESTADO (inventário, pendências, posição financeira) ignoram o
 * filtro de período; só "Vendas realizadas" responde a ele. A nota do rodapé
 * existe para o gestor não achar que o número parou de atualizar.
 */
export default function VisaoGeralGestaoPage() {
  const [periodo, setPeriodo] = useState("30d");
  const { dados, carregando, erro, recarregar } = useRecurso(
    comFiltros("/management/overview", { periodo })
  );
  const { linhas: notificacoes } = useLista("/notifications?perPage=4");

  const areas = dados?.areas || [];
  const tem = (a) => areas.includes(a);
  // O filtro de periodo so tem a quem obedecer se houver bloco comercial: o
  // inventario e a posicao financeira sao ESTADO. Para um perfil de Operacao,
  // deixa-lo na tela seria um controle que nao muda nada — o tipo de coisa que
  // ensina o utilizador a nao confiar nos outros filtros.
  const periodoServeParaAlgo = tem("comercial");

  return (
    <>
      <PageHeader
        titulo="Visão Geral"
        descricao="Saúde global da plataforma, por área."
        acoes={
          periodoServeParaAlgo ? <PeriodFilter valor={periodo} onChange={setPeriodo} /> : null
        }
      />

      <EstadoDaTela
        carregando={carregando}
        erro={erro}
        onTentarNovamente={recarregar}
        esqueleto="cards"
        quantidade={9}
      >
        {dados && (
          <>
            {tem("comercial") && (
              <Area
                titulo="Comercial"
                pergunta="O que estamos vendendo e como as oportunidades evoluem?"
                href="/gestao/comercial/vendas"
              >
                <StatCard
                  rotulo="Vendas realizadas"
                  valor={moeda(dados.comercial.valorVendido, { curta: true })}
                  icone="chart"
                  tone="ok"
                  variacao={variacao(dados.comercial.variacoes.valorVendido)}
                  nota={`${numero(dados.comercial.vendasRealizadas)} vendas no período`}
                />
                <StatCard
                  rotulo="Consultas em aberto"
                  valor={numero(dados.comercial.consultasEmAberto)}
                  icone="chat"
                  tone="warn"
                  href="/gestao/comercial/consultas"
                  hrefLabel="Atender"
                  destaque={dados.comercial.consultasEmAberto > 0}
                />
                <StatCard
                  rotulo="Ativos aguardando aprovação"
                  valor={numero(dados.comercial.ativosAguardandoAprovacao)}
                  icone="clock"
                  tone="info"
                  href="/gestao/comercial/ativos"
                  hrefLabel="Ver ativos"
                />
              </Area>
            )}

            {tem("operacao") && (
              <Area
                titulo="Operação"
                pergunta="Onde estão os ativos e o que precisa acontecer?"
                href="/gestao/operacao"
              >
                <StatCard
                  rotulo="Ativos sob gestão"
                  valor={numero(dados.operacao.ativosSobGestao)}
                  icone="box"
                  tone="info"
                  nota={`${moeda(dados.operacao.valorDoInventario, {
                    curta: true,
                  })} de inventário`}
                />
                <StatCard
                  rotulo="Aguardando retirada"
                  valor={numero(dados.operacao.aguardandoRetirada)}
                  icone="truck"
                  tone="warn"
                  nota={`${moeda(dados.operacao.valorAguardandoRetirada, {
                    curta: true,
                  })} parados`}
                  destaque={dados.operacao.aguardandoRetirada > 0}
                />
                <StatCard
                  rotulo="Pendências operacionais"
                  valor={numero(dados.operacao.pendenciasOperacionais)}
                  icone="alert"
                  tone="warn"
                  href="/gestao/operacao"
                  hrefLabel="Resolver"
                  destaque={dados.operacao.pendenciasOperacionais > 0}
                />
              </Area>
            )}

            {tem("financeiro") && (
              <Area
                titulo="Financeiro"
                pergunta="Quanto isso representa e o que precisa ser pago?"
                href="/gestao/financeiro/movimentacoes"
              >
                <StatCard
                  rotulo="Receita RED"
                  valor={moeda(dados.financeiro.receitaRed, { curta: true })}
                  icone="wallet"
                  tone="accent"
                  nota="Acumulado"
                />
                <StatCard
                  rotulo="Valor a repassar"
                  valor={moeda(dados.financeiro.aRepassar, { curta: true })}
                  icone="tag"
                  tone="warn"
                  nota="Devido e não pago"
                />
                <StatCard
                  rotulo="Repasses fora do prazo"
                  valor={numero(dados.financeiro.repassesForaDoPrazo)}
                  icone="clock"
                  // O prazo é regra de negócio (48h após a conclusão integral),
                  // não meta interna — e por isso vem da API, não escrito aqui.
                  nota={`Prazo de ${dados.financeiro.prazoRepasseHoras}h`}
                  tone="accent"
                  href="/gestao/financeiro/repasses"
                  hrefLabel="Ver repasses"
                  destaque={dados.financeiro.repassesForaDoPrazo > 0}
                />
              </Area>
            )}

            <div className={styles.graficos}>
              {/* Um gráfico só, e do Comercial: é a única série que responde
                  "para onde isto vai". O de vendas por categoria saiu — vive em
                  Relatórios, e a leitura por categoria do inventário passou a
                  ser de Operação. */}
              {tem("comercial") && (
                <PanelCard
                  titulo="Evolução das vendas (valor bruto)"
                  acao={<span className={styles.tagPeriodo}>Últimos 12 meses</span>}
                >
                  {/* O LineChart recusa uma série de um ponto só — dois pontos
                      é o mínimo para haver linha. Sem esta linha de texto o
                      cartão ficava simplesmente vazio, que se lê como gráfico
                      que falhou a carregar. */}
                  {dados.graficos.evolucaoVendas.length > 1 ? (
                    <LineChart dados={dados.graficos.evolucaoVendas} />
                  ) : (
                    <p className={styles.semSerie}>
                      Ainda não há dois meses com vendas para desenhar a linha.
                    </p>
                  )}
                </PanelCard>
              )}

              <PanelCard titulo="Últimas notificações">
                {/* Cartao com titulo e nada dentro le-se como falha de
                    carregamento. Perfil novo, sem notificacao nenhuma, cai
                    exatamente neste caso. */}
                {(notificacoes || []).length === 0 && (
                  <p className={styles.semSerie}>Nenhuma notificação recente.</p>
                )}
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
          </>
        )}
      </EstadoDaTela>

      <p className={styles.rodapeNota}>
        <PanelIcon name="alert" size={13} />
        <span>
          {periodoServeParaAlgo
            ? 'Só "Vendas realizadas" responde ao filtro de período. Inventário, pendências e posição financeira são a fotografia de agora. '
            : "Todos os indicadores desta tela são a fotografia de agora. "}
          Cada área mostra apenas os indicadores críticos — os números completos estão na área
          correspondente.
        </span>
      </p>
    </>
  );
}

/**
 * Bloco de uma área.
 *
 * O cabeçalho carrega a PERGUNTA que a área responde, não só o nome dela: é o
 * enquadramento que o cliente usou para separar as três áreas, e tê-lo na tela
 * é o que impede a Visão Geral de voltar a ser um depósito de indicadores.
 */
function Area({ titulo, pergunta, href, children }) {
  return (
    <section className={styles.area}>
      <header className={styles.areaHead}>
        <h2>{titulo}</h2>
        <p>{pergunta}</p>
        <Link href={href} className={styles.areaLink}>
          Abrir área
          <PanelIcon name="chevronRight" size={13} />
        </Link>
      </header>
      <div className={styles.areaKpis}>{children}</div>
    </section>
  );
}
