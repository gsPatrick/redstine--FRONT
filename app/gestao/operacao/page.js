"use client";

import { useState } from "react";
import AuthGuard from "@/components/panel/organisms/AuthGuard/AuthGuard";
import PageHeader from "@/components/panel/molecules/PageHeader/PageHeader";
import PanelCard from "@/components/panel/molecules/PanelCard/PanelCard";
import StatCard from "@/components/panel/molecules/StatCard/StatCard";
import DataTable from "@/components/panel/molecules/DataTable/DataTable";
import DonutChart from "@/components/panel/molecules/DonutChart/DonutChart";
import PanelField from "@/components/panel/molecules/PanelField/PanelField";
import PeriodFilter from "@/components/panel/molecules/PeriodFilter/PeriodFilter";
import StatusPill from "@/components/panel/atoms/StatusPill/StatusPill";
import PanelIcon from "@/components/panel/atoms/PanelIcon/PanelIcon";
import EstadoDaTela from "@/components/panel/molecules/EstadoDaTela/EstadoDaTela";
import { useLista, useRecurso, comFiltros } from "@/lib/painel/api-cliente";
import { moeda, numero } from "@/lib/painel/formato";
import {
  OPCOES_MODELO_COMERCIAL,
  OPCOES_STATUS_OPERACIONAL,
  TOM_STATUS_OPERACIONAL,
  CRITERIO_DIAS_EM_ESTOQUE,
  faixaDeDias,
} from "@/lib/painel/operacao";
import DetalheOperacional from "./DetalheOperacional";
import styles from "./operacao.module.css";

/**
 * Operação — painel de controle do inventário e do fluxo físico dos ativos.
 *
 * Responde a três perguntas, e só a essas: onde estão os ativos, em que
 * condição operacional estão e o que precisa acontecer. Não é um segundo painel
 * de vendas — não há aqui receita da RED, repasse, margem nem ticket médio, e
 * o perfil de Operação não tem capacidade para os ver mesmo que estivessem.
 *
 * O que NÃO responde ao filtro de período: todos os indicadores. Inventário é
 * ESTADO — "ativos sob gestão nos últimos 7 dias" não é uma pergunta, o ativo
 * está em inventário hoje ou não está. O período recorta a TABELA, pela data em
 * que o ativo entrou no inventário, e por isso ela nasce em "todo o período":
 * um estoque não é um mês.
 *
 * Dois indicadores pedidos pelo cliente não estão aqui, à espera de decisão:
 * Localizações (ver a nota sobre localização no rodapé) e Aguardando entrada.
 * Onde entrariam está marcado no código, em vez de meio construído na tela.
 *
 * A casca do painel deixa entrar quem tem QUALQUER capacidade de gestão, e por
 * isso a área precisa do seu próprio porteiro: sem ele, um perfil Comercial que
 * digitasse /gestao/operacao ficava numa tela de erro 403 em vez de voltar para
 * onde tem acesso. Continua a ser conveniência — quem bloqueia é a API, que
 * recusa a rota com token válido de outro perfil.
 */
export default function OperacaoPage() {
  return (
    <AuthGuard capacidade="operation_read">
      <Inventario />
    </AuthGuard>
  );
}

function Inventario() {
  const [periodo, setPeriodo] = useState("tudo");
  const [modelo, setModelo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [status, setStatus] = useState("");
  const [busca, setBusca] = useState("");
  const [abertoId, setAbertoId] = useState(null);

  // As categorias vêm do catálogo, não de uma lista escrita à mão: uma
  // categoria nova aparecia no sistema e não no filtro.
  const { linhas: categorias } = useLista("/catalog/categories");

  const dimensao = { commercialModel: modelo || undefined, category: categoria || undefined };

  const painel = useRecurso(comFiltros("/management/operation", dimensao));

  const lista = useLista(
    comFiltros("/management/operation/assets", {
      ...dimensao,
      perPage: 100,
      periodo,
      statusOperacional: status || undefined,
      search: busca.trim() || undefined,
    })
  );

  const d = painel.dados;
  const linhas = lista.linhas;
  const porModelo = (chave) => (d?.porModelo || []).find((m) => m.modeloChave === chave);
  const estoque = porModelo("estoque");
  const catalogo = porModelo("catalogo");
  const proprio = porModelo("proprio");
  const tempo = d?.tempoEmEstoque;

  const colunas = [
    {
      chave: "nome",
      titulo: "Ativo",
      ordenavel: true,
      // Largura EXPLICITA, e nao "o que sobrar": as outras nove colunas tem
      // largura declarada, e a coluna sem ela e a que o browser encolhe para
      // caber — foi assim que o nome do ativo apareceu quebrado em oito linhas.
      largura: 200,
      render: (l) => (
        <span className={styles.celulaAtivo}>
          <strong>{l.nome}</strong>
          <span className={styles.codigo}>{l.codigo || "sem código"}</span>
        </span>
      ),
    },
    {
      chave: "proprietario",
      titulo: "Proprietário",
      ordenavel: true,
      largura: 110,
      // "RED" vem da API só quando o ativo é do acervo próprio; a etiqueta ao
      // lado existe porque "RED" sozinho lia-se como cadastro incompleto. Sem
      // proprietário a API devolve null de propósito — é cadastro incompleto de
      // verdade, e a Operação não tem a quem ligar para mover o ativo.
      render: (l) =>
        l.proprioDaRed ? (
          <span className={styles.celulaAtivo}>
            <strong>RED</strong>
            <span className={styles.codigo}>acervo próprio</span>
          </span>
        ) : (
          l.proprietario || <span className={styles.semDado}>não identificado</span>
        ),
    },
    {
      chave: "modelo",
      titulo: "Modelo",
      ordenavel: true,
      largura: 105,
      // Sem a sub-etiqueta de guarda: "RED Catálogo" já diz que o ativo está no
      // fornecedor, e repeti-lo em cada linha gastava largura de que a coluna
      // "Ativo" precisava. A guarda aparece por extenso no detalhe, com o
      // contato de quem a tem — que é a forma acionável da mesma informação.
    },
    { chave: "categoria", titulo: "Categoria", ordenavel: true, largura: 95 },
    {
      chave: "local",
      titulo: "Localização",
      ordenavel: true,
      largura: 110,
      // Texto livre, exatamente como está na base. O vazio é mostrado como
      // vazio e não como "—": é uma pendência operacional, não um traço.
      render: (l) =>
        l.local || <span className={styles.semDado}>não registrada</span>,
    },
    {
      chave: "quantidade",
      titulo: "Qtd.",
      ordenavel: true,
      alinhar: "direita",
      largura: 62,
      render: (l) => (
        <span className={styles.celulaNumero}>
          {numero(l.quantidade)}
          {l.quantidade !== l.quantidadeOriginal && (
            <span className={styles.codigo}>de {numero(l.quantidadeOriginal)}</span>
          )}
        </span>
      ),
    },
    {
      chave: "valor",
      titulo: "Valor",
      ordenavel: true,
      alinhar: "direita",
      largura: 92,
      // Valor ANUNCIADO do saldo. Não há aqui a parte de ninguém.
      render: (l) => moeda(l.valor),
    },
    {
      chave: "statusOperacional",
      titulo: "Status operacional",
      ordenavel: true,
      largura: 140,
      render: (l) => (
        <StatusPill
          status={l.statusOperacional}
          tone={TOM_STATUS_OPERACIONAL[l.statusOperacionalChave]}
        />
      ),
    },
    {
      chave: "diasEmEstoque",
      titulo: "Dias em estoque",
      ordenavel: true,
      alinhar: "direita",
      largura: 92,
      render: (l) => {
        const faixa = faixaDeDias(l.diasEmEstoque, tempo?.limiteLongoDias);
        if (l.diasEmEstoque === null) return <span className={styles.semDado}>—</span>;
        return (
          <span className={`${styles.dias} ${styles[faixa] || ""}`}>{numero(l.diasEmEstoque)} d</span>
        );
      },
    },
    {
      chave: "acao",
      titulo: "Ação",
      alinhar: "centro",
      largura: 50,
      /**
       * Abre o detalhe operacional aqui mesmo, em diálogo.
       *
       * Não leva à gestão do ativo em Comercial de propósito: essa tela é do
       * Comercial, mostra receita potencial da RED e devolveria 403 a um perfil
       * de Operação — mandar a pessoa para uma porta fechada é pior do que não
       * ter o botão. O que a Operação precisa para agir (guarda, contato, saldo,
       * retiradas pendentes) está no diálogo.
       */
      render: (l) => (
        <button
          type="button"
          className={styles.verBtn}
          onClick={() => setAbertoId(l.id)}
          title={`Detalhe operacional de ${l.nome}`}
          aria-label={`Detalhe operacional de ${l.nome}`}
        >
          <PanelIcon name="eye" size={16} />
        </button>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        titulo="Operação"
        descricao="Inventário sob gestão, guarda dos ativos e o que precisa acontecer."
        trilha={[{ label: "Operação" }, { label: "Inventário" }]}
        acoes={<PeriodFilter valor={periodo} onChange={setPeriodo} rotulo="Entrada:" />}
      />

      <div className={styles.barraDimensao}>
        <PanelField
          name="modelo"
          as="select"
          value={modelo}
          onChange={(e) => setModelo(e.target.value)}
          className={styles.filtroSelect}
          opcoes={OPCOES_MODELO_COMERCIAL}
        />
        <PanelField
          name="categoria"
          as="select"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className={styles.filtroSelect}
          opcoes={[
            { valor: "", label: "Todas as categorias" },
            ...(categorias || []).map((c) => ({ valor: c.slug, label: c.name })),
          ]}
        />
        {/*
          Falta aqui o filtro por LOCALIZAÇÃO, e é o lugar dele: terceiro select,
          ao lado de Categoria. Está em espera porque `assets.location` é texto
          livre e inconsistente ("Rio de Janeiro/RJ" e "Rio de Janeiro — RJ" são
          o mesmo lugar em dois registos) e mais da metade dos ativos tem o campo
          vazio — um select montado em cima disso ofereceria duas opções para o
          mesmo local e esconderia metade do acervo em qualquer escolha. Depende
          de a localização virar lista fechada. A busca abaixo cobre o caso
          urgente, porque busca por texto não promete exatidão.
        */}
      </div>

      <EstadoDaTela
        carregando={painel.carregando}
        erro={painel.erro}
        onTentarNovamente={painel.recarregar}
        esqueleto="cards"
        quantidade={8}
      >
        {d && (
          <>
            <div className={styles.kpis}>
              <StatCard
                rotulo="Ativos sob gestão"
                valor={numero(d.inventario.registros)}
                icone="box"
                tone="info"
                nota={`${numero(d.inventario.unidades)} unidades`}
              />
              <StatCard
                rotulo="Valor total dos ativos"
                valor={moeda(d.inventario.valor, { curta: true })}
                icone="tag"
                tone="accent"
                nota="Valor anunciado do inventário"
              />
              <StatCard
                rotulo="RED Estoque"
                valor={moeda(estoque?.valor ?? 0, { curta: true })}
                icone="building"
                tone="ok"
                nota={`${numero(estoque?.registros ?? 0)} ativos em guarda da RED`}
              />
              <StatCard
                rotulo="RED Catálogo"
                valor={moeda(catalogo?.valor ?? 0, { curta: true })}
                icone="upload"
                tone="info"
                nota={`${numero(catalogo?.registros ?? 0)} ativos no fornecedor`}
              />
              <StatCard
                rotulo="Ativos próprios"
                valor={moeda(proprio?.valor ?? 0, { curta: true })}
                icone="shield"
                tone="accent"
                nota={`${numero(proprio?.registros ?? 0)} ativos do acervo RED`}
              />
              <StatCard
                rotulo="Aguardando retirada"
                valor={numero(d.aguardandoRetirada.itens)}
                icone="truck"
                tone="warn"
                nota={`${moeda(d.aguardandoRetirada.valor, { curta: true })} parados${
                  d.aguardandoRetirada.atrasados
                    ? ` · ${numero(d.aguardandoRetirada.atrasados)} atrasados`
                    : ""
                }`}
                destaque={d.aguardandoRetirada.atrasados > 0}
              />
              <StatCard
                rotulo="Pendências operacionais"
                valor={numero(d.pendencias.total)}
                icone="alert"
                tone="warn"
                nota="Ações abertas nesta área"
                destaque={d.pendencias.total > 0}
              />
              <StatCard
                rotulo="Tempo em estoque"
                valor={tempo?.medianaDias === null ? "—" : `${numero(tempo.medianaDias)} d`}
                icone="clock"
                tone="neutral"
                // Mediana no número grande e média ao lado, de propósito: um só
                // ativo esquecido há dois anos puxa a média e faz o painel
                // parecer pior do que a operação está.
                nota={`mediana · média ${
                  tempo?.mediaDias === null ? "—" : `${numero(tempo.mediaDias)} d`
                }`}
              />
              {/*
                Faltam aqui, e é o lugar deles, dois cartões que o cliente pediu:

                  LOCALIZAÇÕES (distribuição por local) — depende de
                  `assets.location` virar lista fechada. Hoje são {d.pendencias.semLocalizacao}
                  ativos sem localização registada e dois textos diferentes para
                  o mesmo lugar; a distribuição sairia errada com cara de certa.
                  Enquanto isso, o tamanho do problema está na lista de
                  pendências abaixo, que é a informação acionável que existe.

                  AGUARDANDO ENTRADA (ativos destinados ao RED Estoque ainda não
                  recebidos) — não existe no ciclo de vida o registo de
                  recebimento físico. Sem saber quem carimba e quando, o cartão
                  seria uma contagem de ativos `estoque` chamada de "não
                  recebida", o que é chute com aparência de medida.
              */}
            </div>

            <div className={styles.blocos}>
              <PanelCard
                titulo="Pendências operacionais"
                descricao="O que exige ação nesta área hoje."
              >
                <ul className={styles.pendencias}>
                  <Pendencia
                    rotulo="Prontos para publicar"
                    detalhe="Aprovados pelo fornecedor e ainda fora do catálogo"
                    valor={d.pendencias.prontosParaPublicar}
                    aoClicar={() => setStatus("pronto_para_publicar")}
                  />
                  <Pendencia
                    rotulo="Retiradas atrasadas"
                    detalhe={`Agendamento vencido, ou sem agendamento há mais de ${d.aguardandoRetirada.slaDias} dias`}
                    valor={d.pendencias.retiradasAtrasadas}
                    aoClicar={() => setStatus("aguardando_retirada")}
                  />
                  <Pendencia
                    rotulo="Sem localização registada"
                    detalhe="Impede saber onde o ativo está — e bloqueia o indicador de Localizações"
                    valor={d.pendencias.semLocalizacao}
                  />
                  <Pendencia
                    rotulo="Publicados sem saldo"
                    detalhe="Anunciados no catálogo sem nada para entregar"
                    valor={d.pendencias.publicadoSemSaldo}
                    aoClicar={() => setStatus("sem_saldo")}
                  />
                  <Pendencia
                    rotulo={`Parados há mais de ${tempo?.limiteLongoDias ?? 90} dias`}
                    detalhe={`${moeda(tempo?.acimaDoLimite?.valor ?? 0, {
                      curta: true,
                    })} de inventário sem girar`}
                    valor={tempo?.acimaDoLimite?.registros ?? 0}
                  />
                </ul>
              </PanelCard>

              <PanelCard
                titulo="Inventário por categoria"
                descricao="Valor anunciado do que está parado, por categoria."
                acao={<span className={styles.tag}>Situação atual</span>}
              >
                {/* Dimensão analítica, com o peso que o cliente deu: um gráfico
                    simples. E é a pergunta OPOSTA à de "vendas por categoria"
                    do Comercial — aqui é quanto ESTÁ, lá é quanto SAIU. */}
                <DonutChart
                  dados={d.graficos.inventarioPorCategoria}
                  formato={(v) => moeda(v, { curta: true })}
                />
              </PanelCard>
            </div>
          </>
        )}
      </EstadoDaTela>

      <PanelCard padding="none" className={styles.tabela}>
        <div className={styles.barraFiltros}>
          <PanelField
            name="busca"
            placeholder="Buscar ativo, código ou localização…"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className={styles.busca}
          />
          <PanelField
            name="statusOperacional"
            as="select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={styles.filtroSelect}
            opcoes={OPCOES_STATUS_OPERACIONAL}
          />
        </div>

        <EstadoDaTela
          carregando={lista.carregando}
          erro={lista.erro}
          onTentarNovamente={lista.recarregar}
          esqueleto="tabela"
          colunas={10}
        >
          <DataTable
            colunas={colunas}
            linhas={linhas}
            compacta
            porPagina={12}
            rodape={`Mostrando ${linhas.length} de ${lista.meta?.total ?? linhas.length} ativos`}
            vazio={{
              icone: "box",
              titulo: "Nenhum ativo no inventário com estes filtros.",
            }}
          />
        </EstadoDaTela>
      </PanelCard>

      <p className={styles.rodapeNota}>
        <PanelIcon name="alert" size={13} />
        <span>
          Os indicadores acima são a fotografia de agora e não respondem ao filtro de período — o
          período recorta apenas a tabela, pela data de entrada do ativo no inventário.{" "}
          <strong>Dias em estoque:</strong> {CRITERIO_DIAS_EM_ESTOQUE} A localização é texto livre
          na base e está incompleta; por isso não há aqui indicador nem filtro por localização.
        </span>
      </p>

      <DetalheOperacional id={abertoId} aoFechar={() => setAbertoId(null)} />
    </>
  );
}

/** Linha da lista de pendências. Clicável quando existe filtro que a mostra. */
function Pendencia({ rotulo, detalhe, valor, aoClicar }) {
  const conteudo = (
    <>
      <span className={styles.pendTexto}>
        <strong>{rotulo}</strong>
        <span>{detalhe}</span>
      </span>
      <span className={`${styles.pendValor} ${valor > 0 ? styles.pendAtiva : ""}`}>
        {numero(valor)}
      </span>
    </>
  );

  // Sem filtro correspondente não vira botão: um clique que não faz nada ensina
  // o utilizador a desconfiar dos outros.
  return (
    <li>
      {aoClicar && valor > 0 ? (
        <button type="button" className={styles.pendClicavel} onClick={aoClicar}>
          {conteudo}
        </button>
      ) : (
        <span className={styles.pendEstatica}>{conteudo}</span>
      )}
    </li>
  );
}
