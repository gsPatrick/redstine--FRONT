"use client";

import { useState } from "react";
import PageHeader from "@/components/panel/molecules/PageHeader/PageHeader";
import PanelCard from "@/components/panel/molecules/PanelCard/PanelCard";
import DataTable from "@/components/panel/molecules/DataTable/DataTable";
import StatCard from "@/components/panel/molecules/StatCard/StatCard";
import PanelField from "@/components/panel/molecules/PanelField/PanelField";
import StatusPill from "@/components/panel/atoms/StatusPill/StatusPill";
import PanelModal from "@/components/panel/molecules/PanelModal/PanelModal";
import EstadoDaTela from "@/components/panel/molecules/EstadoDaTela/EstadoDaTela";
import { useLista, comFiltros } from "@/lib/painel/api-cliente";
import { moeda, data as fmtData } from "@/lib/painel/formato";
import { ROTULO_PEDIDO, ROTULO_PAGAMENTO, ROTULO_RETIRADA } from "@/lib/painel/pedidos";
import Pedido from "./Pedido";
import styles from "./pedidos.module.css";

/**
 * Comercial — Pedidos.
 *
 * A compra feita no site nasce em "aguardando confirmação" e fica ali até
 * alguém da RED confirmar. Sem esta tela ninguém confirmava: o comprador via
 * "aguardando confirmação" para sempre e a venda nunca entrava nos números da
 * gestão, porque venda realizada conta a partir do pedido confirmado.
 *
 * A tabela mostra os três eixos separados — pedido, pagamento e retirada —
 * porque eles andam independentes: dá para estar pago e sem retirada, ou
 * confirmado e sem pagamento. Um status só esconderia metade da operação.
 */
export default function PedidosPage() {
  const [status, setStatus] = useState("");
  const [aberto, setAberto] = useState(null);

  const { linhas, meta, carregando, erro, recarregar } = useLista(
    comFiltros("/orders", { perPage: 100, status: status || undefined })
  );

  const pedidos = linhas || [];
  const contar = (s) => pedidos.filter((p) => p.status === s).length;

  const colunas = [
    {
      chave: "reference",
      titulo: "Pedido",
      ordenavel: true,
      largura: 130,
      render: (l) => <span className={styles.ref}>{l.reference}</span>,
    },
    {
      chave: "createdAt",
      titulo: "Data",
      ordenavel: true,
      largura: 120,
      valor: (l) => new Date(l.createdAt).getTime(),
      render: (l) => fmtData(l.createdAt),
    },
    {
      chave: "buyerName",
      titulo: "Comprador",
      ordenavel: true,
      render: (l) => (
        <span className={styles.duasLinhas}>
          <strong>{l.buyerName || "—"}</strong>
          <em>{l.buyerEmail}</em>
        </span>
      ),
    },
    {
      chave: "itens",
      titulo: "Itens",
      alinhar: "centro",
      largura: 70,
      valor: (l) => l.itens?.length ?? 0,
      render: (l) => l.itens?.length ?? 0,
    },
    {
      chave: "total",
      titulo: "Total",
      ordenavel: true,
      alinhar: "direita",
      largura: 120,
      valor: (l) => Number(l.total),
      render: (l) => <strong>{moeda(Number(l.total))}</strong>,
    },
    {
      chave: "paymentStatus",
      titulo: "Pagamento",
      ordenavel: true,
      largura: 130,
      render: (l) => (
        <StatusPill
          status={ROTULO_PAGAMENTO[l.paymentStatus] || l.paymentStatus}
          tone={l.paymentStatus === "pago" ? "ok" : l.paymentStatus === "estornado" ? "danger" : "warn"}
          size="sm"
        />
      ),
    },
    {
      chave: "pickupStatus",
      titulo: "Retirada",
      ordenavel: true,
      largura: 130,
      render: (l) => (
        <StatusPill
          status={ROTULO_RETIRADA[l.pickupStatus] || l.pickupStatus}
          tone={l.pickupStatus === "concluida" ? "ok" : l.pickupStatus === "agendada" ? "info" : "neutral"}
          size="sm"
        />
      ),
    },
    {
      chave: "status",
      titulo: "Situação",
      ordenavel: true,
      largura: 165,
      render: (l) => <StatusPill status={ROTULO_PEDIDO[l.status] || l.status} />,
    },
    {
      chave: "acao",
      titulo: "Ação",
      alinhar: "centro",
      largura: 120,
      render: (l) => (
        <button type="button" className={styles.abrir} onClick={() => setAberto(l.id)}>
          {l.status === "aguardando_confirmacao" ? "Confirmar" : "Abrir"}
        </button>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        titulo="Pedidos"
        descricao="Compras feitas no site, do pagamento à retirada."
        trilha={[{ label: "Comercial" }, { label: "Pedidos" }]}
      />

      <div className={styles.kpis}>
        <StatCard
          rotulo="Aguardando confirmação"
          valor={contar("aguardando_confirmacao")}
          icone="clock"
          tone="warn"
          nota="A venda só conta depois de confirmada"
          destaque={contar("aguardando_confirmacao") > 0}
        />
        <StatCard
          rotulo="Aguardando retirada"
          valor={contar("aguardando_retirada") + contar("em_separacao")}
          icone="cart"
          tone="info"
          nota="Pendência operacional"
        />
        <StatCard
          rotulo="Concluídos"
          valor={contar("concluido")}
          icone="checkCircle"
          tone="ok"
          nota="Liberam o repasse"
        />
        <StatCard
          rotulo="Cancelados"
          valor={contar("cancelado")}
          icone="alert"
          tone="danger"
          nota="No período carregado"
        />
      </div>

      <PanelCard>
        <div className={styles.filtros}>
          <PanelField
            label="Situação"
            name="status"
            as="select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            opcoes={[
              { valor: "", label: "Todas as situações" },
              ...Object.entries(ROTULO_PEDIDO).map(([valor, label]) => ({ valor, label })),
            ]}
            className={styles.filtro}
          />
        </div>

        <EstadoDaTela
          carregando={carregando}
          erro={erro}
          onTentarNovamente={recarregar}
          esqueleto="tabela"
          colunas={9}
        >
          <DataTable
            colunas={colunas}
            linhas={pedidos}
            rodape={
              meta ? `Mostrando ${pedidos.length} de ${meta.total} pedidos` : `${pedidos.length} pedidos`
            }
            vazio={{
              icone: "cart",
              titulo: status ? "Nenhum pedido nesta situação." : "Nenhum pedido ainda.",
              descricao: "Compras feitas no site aparecem aqui assim que são registradas.",
            }}
          />
        </EstadoDaTela>
      </PanelCard>

      <PanelModal
        aberto={Boolean(aberto)}
        aoFechar={() => setAberto(null)}
        titulo="Pedido"
        descricao="Confirmar a venda, registrar pagamento e retirada, concluir."
        largura={760}
      >
        {aberto && <Pedido id={aberto} aoMudar={recarregar} />}
      </PanelModal>
    </>
  );
}
