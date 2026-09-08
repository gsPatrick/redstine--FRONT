"use client";

import { useMemo, useState } from "react";
import PageHeader from "@/components/panel/molecules/PageHeader/PageHeader";
import PanelCard from "@/components/panel/molecules/PanelCard/PanelCard";
import DataTable from "@/components/panel/molecules/DataTable/DataTable";
import TabFilter from "@/components/panel/molecules/TabFilter/TabFilter";
import ProductCell from "@/components/panel/molecules/ProductCell/ProductCell";
import PanelField from "@/components/panel/molecules/PanelField/PanelField";
import PanelButton from "@/components/panel/atoms/PanelButton/PanelButton";
import StatusPill from "@/components/panel/atoms/StatusPill/StatusPill";
import PanelIcon from "@/components/panel/atoms/PanelIcon/PanelIcon";
import EstadoDaTela from "@/components/panel/molecules/EstadoDaTela/EstadoDaTela";
import { useLista, comFiltros } from "@/lib/painel/api-cliente";
import { moeda, percentual } from "@/lib/painel/formato";
import styles from "./ativos.module.css";

/**
 * Meus Ativos — o inventario comercial do fornecedor.
 *
 * Modelo comercial e coluna obrigatoria, nao detalhe: o mesmo fornecedor pode
 * ter um ativo em RED Catalogo (65%) e outro em RED Estoque (50%), e a receita
 * potencial e calculada ativo a ativo a partir do percentual DAQUELE ativo.
 */
const ABAS = [
  { valor: "todos", label: "Todos" },
  { valor: "Publicado", label: "Publicados" },
  { valor: "Vendido", label: "Vendidos" },
  { valor: "Em avaliação", label: "Em avaliação" },
  { valor: "Inativo", label: "Inativos" },
];

export default function MeusAtivosPage() {
  const [aba, setAba] = useState("todos");
  const [busca, setBusca] = useState("");

  // A busca vai para a API; a aba filtra em memória porque as contagens de
  // todas as abas precisam do conjunto completo.
  const { linhas: todos, carregando, erro, recarregar } = useLista(
    comFiltros("/me/my-assets", { perPage: 100, search: busca.trim() || undefined })
  );

  const abas = ABAS.map((a) => ({
    ...a,
    contador: a.valor === "todos" ? todos.length : todos.filter((x) => x.status === a.valor).length,
  }));

  const linhas = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return todos
      .filter((a) => aba === "todos" || a.status === aba)
      .filter(
        (a) =>
          !termo ||
          a.nome.toLowerCase().includes(termo) ||
          a.codigo.toLowerCase().includes(termo) ||
          a.local.toLowerCase().includes(termo)
      );
  }, [aba, busca, todos]);

  const colunas = [
    {
      chave: "nome",
      titulo: "Ativo",
      ordenavel: true,
      render: (l) => <ProductCell nome={l.nome} imagem={l.imagem} apoio={l.codigo} />,
    },
    { chave: "local", titulo: "Localização", ordenavel: true, largura: 160 },
    { chave: "modelo", titulo: "Modelo", ordenavel: true, largura: 130 },
    {
      chave: "preco",
      titulo: "Preço",
      ordenavel: true,
      alinhar: "direita",
      largura: 118,
      render: (l) => moeda(l.preco),
    },
    {
      chave: "participacao",
      titulo: "Minha participação",
      ordenavel: true,
      alinhar: "direita",
      largura: 140,
      render: (l) => percentual(l.participacao),
    },
    {
      chave: "potencial",
      titulo: "Receita potencial",
      ordenavel: true,
      alinhar: "direita",
      largura: 145,
      // Vem calculada da API, com o percentual DAQUELE ativo e a quantidade
      // disponível. Refazer a conta aqui é como o número saía errado: o front
      // esquecia a quantidade e mostrava o potencial de uma unidade só.
      valor: (l) => l.receitaPotencial,
      render: (l) => <strong>{moeda(l.receitaPotencial)}</strong>,
    },
    {
      chave: "status",
      titulo: "Status",
      ordenavel: true,
      largura: 140,
      render: (l) => <StatusPill status={l.status} />,
    },
    {
      chave: "acao",
      titulo: "Ação",
      alinhar: "centro",
      largura: 70,
      render: () => (
        <span className={styles.verBtn}>
          <PanelIcon name="eye" size={16} />
        </span>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        titulo="Meus Ativos"
        descricao="Seu inventário comercial na RED, com modelo e participação por ativo."
        trilha={[{ label: "Vender" }, { label: "Meus Ativos" }]}
        acoes={
          <PanelButton href="/painel/vender/enviar" icon="plus" size="sm">
            Enviar Ativos
          </PanelButton>
        }
      />

      <PanelCard padding="none">
        <div className={styles.barra}>
          <TabFilter opcoes={abas} valor={aba} onChange={setAba} className={styles.abas} />
          <PanelField
            name="busca"
            placeholder="Buscar ativo, código ou local…"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className={styles.busca}
          />
        </div>

        <EstadoDaTela carregando={carregando} erro={erro} onTentarNovamente={recarregar}>
        <DataTable
          colunas={colunas}
          linhas={linhas}
          rodape={`Mostrando 1 a ${linhas.length} de ${linhas.length} ativos`}
          vazio={{
            icone: "box",
            titulo: "Nenhum ativo encontrado.",
            descricao: "Ajuste a busca ou envie um novo ativo para avaliação.",
            acao: { label: "Enviar Ativos", href: "/painel/vender/enviar" },
          }}
        />
        </EstadoDaTela>
      </PanelCard>
    </>
  );
}
