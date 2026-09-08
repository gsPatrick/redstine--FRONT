"use client";

import Link from "next/link";
import PageHeader from "@/components/panel/molecules/PageHeader/PageHeader";
import PanelCard from "@/components/panel/molecules/PanelCard/PanelCard";
import DataTable from "@/components/panel/molecules/DataTable/DataTable";
import ProductCell from "@/components/panel/molecules/ProductCell/ProductCell";
import StatusPill from "@/components/panel/atoms/StatusPill/StatusPill";
import PanelIcon from "@/components/panel/atoms/PanelIcon/PanelIcon";
import EstadoDaTela from "@/components/panel/molecules/EstadoDaTela/EstadoDaTela";
import { useLista } from "@/lib/painel/api-cliente";
import { quantidade, data as fmtData } from "@/lib/painel/formato";
import styles from "./consultas.module.css";

/**
 * Minhas Consultas.
 *
 * "Consultar Condicoes" e uma modalidade concreta da plataforma, nao um
 * formulario de contacto — por isso a consulta tem lista propria, estado e
 * historico, ao lado das compras.
 *
 * Quatro status, nao dez: recebida, em atendimento, respondida, encerrada.
 */
export default function ConsultasPage() {
  const { linhas: consultas, carregando, erro, recarregar } = useLista("/me/consultations?perPage=100");

  const colunas = [
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
      chave: "status",
      titulo: "Status",
      ordenavel: true,
      largura: 150,
      render: (l) => <StatusPill status={l.status} />,
    },
    {
      chave: "atualizacao",
      titulo: "Última atualização",
      ordenavel: true,
      largura: 160,
      valor: (l) => new Date(l.atualizacao).getTime(),
      render: (l) => fmtData(l.atualizacao, { comHora: true }),
    },
    {
      chave: "acao",
      titulo: "Ação",
      alinhar: "centro",
      largura: 70,
      render: (l) => (
        <Link href={`/painel/consultas/${l.id}`} className={styles.verBtn} aria-label="Ver consulta">
          <PanelIcon name="eye" size={16} />
        </Link>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        titulo="Minhas Consultas"
        descricao="Condições consultadas junto ao comercial da RED."
        trilha={[{ label: "Comprar" }, { label: "Minhas Consultas" }]}
      />

      <PanelCard padding="none">
        <EstadoDaTela carregando={carregando} erro={erro} onTentarNovamente={recarregar}>
        <DataTable
          colunas={colunas}
          linhas={consultas}
          rodape={`Mostrando 1 a ${consultas.length} de ${consultas.length} consultas`}
          vazio={{
            icone: "chat",
            titulo: "Você ainda não fez nenhuma consulta.",
            descricao: "Ativos sob consulta trazem o botão Consultar Condições na página do produto.",
            acao: { label: "Explorar Ativos", href: "/shop" },
          }}
        />
        </EstadoDaTela>
      </PanelCard>
    </>
  );
}
