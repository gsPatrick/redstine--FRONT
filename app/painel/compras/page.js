"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import PageHeader from "@/components/panel/molecules/PageHeader/PageHeader";
import PanelCard from "@/components/panel/molecules/PanelCard/PanelCard";
import DataTable from "@/components/panel/molecules/DataTable/DataTable";
import TabFilter from "@/components/panel/molecules/TabFilter/TabFilter";
import ProductCell from "@/components/panel/molecules/ProductCell/ProductCell";
import StatusPill from "@/components/panel/atoms/StatusPill/StatusPill";
import PanelIcon from "@/components/panel/atoms/PanelIcon/PanelIcon";
import EstadoDaTela from "@/components/panel/molecules/EstadoDaTela/EstadoDaTela";
import { useLista, comFiltros } from "@/lib/painel/api-cliente";
import { moeda, quantidade, data as fmtData } from "@/lib/painel/formato";
import styles from "./compras.module.css";

/**
 * Minhas Compras.
 *
 * Nao existe "compra em andamento" como conceito comercial — existe compra
 * realizada com estados operacionais posteriores. Por isso a lista e uma so, e
 * as abas filtram estado, nao criam categorias paralelas.
 */
const ABAS = [
  { valor: "todas", label: "Todas" },
  { valor: "Aguardando retirada", label: "Aguardando Retirada" },
  { valor: "Retirada agendada", label: "Retiradas Agendadas" },
  { valor: "Concluído", label: "Concluídas" },
  { valor: "Cancelado", label: "Canceladas" },
];

export default function ComprasPage() {
  const [aba, setAba] = useState("todas");

  // Sem filtro na primeira carga: as contagens das abas precisam do total, e
  // pedir uma requisição por aba só para contar seria caro e lento.
  const todas = useLista("/me/purchases?perPage=100");
  const linhas = useMemo(
    () => (aba === "todas" ? todas.linhas : todas.linhas.filter((c) => c.status === aba)),
    [aba, todas.linhas]
  );

  const abas = ABAS.map((a) => ({
    ...a,
    contador:
      a.valor === "todas"
        ? todas.linhas.length
        : todas.linhas.filter((c) => c.status === a.valor).length,
  }));

  const colunas = [
    { chave: "pedido", titulo: "Pedido", ordenavel: true, largura: 92 },
    {
      chave: "data",
      titulo: "Data",
      ordenavel: true,
      largura: 110,
      valor: (l) => new Date(l.data).getTime(),
      render: (l) => fmtData(l.data),
    },
    {
      chave: "produto",
      titulo: "Produto",
      ordenavel: true,
      render: (l) => <ProductCell nome={l.produto} imagem={l.imagem} />,
    },
    {
      chave: "quantidade",
      titulo: "Quantidade",
      ordenavel: true,
      alinhar: "direita",
      largura: 110,
      render: (l) => quantidade(l.quantidade),
    },
    {
      chave: "valor",
      titulo: "Valor",
      ordenavel: true,
      alinhar: "direita",
      largura: 120,
      render: (l) => <strong>{moeda(l.valor)}</strong>,
    },
    {
      chave: "status",
      titulo: "Status",
      ordenavel: true,
      largura: 170,
      render: (l) => <StatusPill status={l.status} />,
    },
    {
      chave: "acao",
      titulo: "Ação",
      alinhar: "centro",
      largura: 70,
      render: (l) => (
        <Link href={`/painel/compras/${l.id}`} className={styles.verBtn} aria-label={`Ver compra ${l.pedido}`}>
          <PanelIcon name="eye" size={16} />
        </Link>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        titulo="Minhas Compras"
        descricao="Todas as compras realizadas e o estado operacional de cada uma."
        trilha={[{ label: "Comprar" }, { label: "Minhas Compras" }]}
      />

      <PanelCard padding="none">
        <TabFilter opcoes={abas} valor={aba} onChange={setAba} className={styles.abas} />
        <EstadoDaTela
          carregando={todas.carregando}
          erro={todas.erro}
          onTentarNovamente={todas.recarregar}
        >
        <DataTable
          colunas={colunas}
          linhas={linhas}
          porPagina={8}
          rodape={`Mostrando 1 a ${linhas.length} de ${linhas.length} compras`}
          vazio={{
            icone: "cart",
            titulo: "Nenhuma compra neste estado.",
            descricao: "Assim que houver uma compra com este status, ela aparece aqui.",
            acao: { label: "Explorar Ativos", href: "/shop" },
          }}
        />
        </EstadoDaTela>
      </PanelCard>
    </>
  );
}
