"use client";

import Link from "next/link";
import { useState } from "react";
import PageHeader from "@/components/panel/molecules/PageHeader/PageHeader";
import PanelCard from "@/components/panel/molecules/PanelCard/PanelCard";
import DataTable from "@/components/panel/molecules/DataTable/DataTable";
import PeriodFilter from "@/components/panel/molecules/PeriodFilter/PeriodFilter";
import StatusPill from "@/components/panel/atoms/StatusPill/StatusPill";
import PanelIcon from "@/components/panel/atoms/PanelIcon/PanelIcon";
import EstadoDaTela from "@/components/panel/molecules/EstadoDaTela/EstadoDaTela";
import { useLista, comFiltros } from "@/lib/painel/api-cliente";
import { moeda, percentual, numero, data as fmtData } from "@/lib/painel/formato";
import styles from "./vendas.module.css";

/**
 * Vendas do fornecedor.
 *
 * `Sua participação` e `Valor fornecedor` sao snapshot da transacao: se a RED
 * mudar o percentual padrao do modelo amanha, nada aqui se move. E por isso que
 * esta tabela le o percentual da venda, e nao da modalidade.
 *
 * Dados do comprador nao aparecem — o fornecedor nao participa do atendimento.
 */
export default function VendasPage() {
  const [periodo, setPeriodo] = useState("30d");
  const { linhas: vendas, carregando, erro, recarregar } = useLista(
    comFiltros("/me/sales", { periodo, perPage: 100 })
  );

  const colunas = [
    { chave: "venda", titulo: "Venda", ordenavel: true, largura: 88 },
    {
      chave: "data",
      titulo: "Data",
      ordenavel: true,
      largura: 105,
      valor: (l) => new Date(l.data).getTime(),
      render: (l) => fmtData(l.data),
    },
    { chave: "ativo", titulo: "Ativo", ordenavel: true },
    {
      chave: "quantidade",
      titulo: "Quantidade",
      ordenavel: true,
      alinhar: "direita",
      largura: 105,
      render: (l) => numero(l.quantidade),
    },
    {
      chave: "valorVenda",
      titulo: "Valor da venda",
      ordenavel: true,
      alinhar: "direita",
      largura: 130,
      render: (l) => moeda(l.valorVenda),
    },
    {
      chave: "participacao",
      titulo: "Sua participação",
      ordenavel: true,
      alinhar: "direita",
      largura: 130,
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
    {
      chave: "acao",
      titulo: "Ação",
      alinhar: "centro",
      largura: 70,
      // O olho abre a pagina do ativo no site. So o publicado tem pagina —
      // linkar os demais levaria a um 404 —, entao nos outros fica inerte e
      // diz por que.
      render: (l) =>
        l.slug ? (
          <Link
            href={`/produto/${l.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.verBtn}
            title={`Ver ${l.ativo || "ativo"} no site`}
            aria-label={`Ver ${l.ativo || "ativo"} no site`}
          >
            <PanelIcon name="eye" size={16} />
          </Link>
        ) : (
          <span
            className={`${styles.verBtn} ${styles.verBtnInativo}`}
            title="Sem página pública: o ativo não está publicado."
            aria-label="Sem página pública"
          >
            <PanelIcon name="eye" size={16} />
          </span>
        ),
    },
  ];

  return (
    <>
      <PageHeader
        titulo="Vendas"
        descricao="Ativos e quantidades efetivamente vendidos."
        trilha={[{ label: "Vender" }, { label: "Vendas" }]}
        acoes={<PeriodFilter valor={periodo} onChange={setPeriodo} />}
      />

      <PanelCard padding="none">
        <EstadoDaTela carregando={carregando} erro={erro} onTentarNovamente={recarregar} esqueleto="tabela" colunas={9}>
        <DataTable
          colunas={colunas}
          linhas={vendas}
          rodape={`Mostrando 1 a ${vendas.length} de ${vendas.length} vendas`}
          vazio={{ icone: "tag", titulo: "Nenhuma venda no período selecionado." }}
        />
        </EstadoDaTela>
      </PanelCard>
    </>
  );
}
