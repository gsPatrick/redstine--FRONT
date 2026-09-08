"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/panel/molecules/PageHeader/PageHeader";
import PanelCard from "@/components/panel/molecules/PanelCard/PanelCard";
import DataTable from "@/components/panel/molecules/DataTable/DataTable";
import StatCard from "@/components/panel/molecules/StatCard/StatCard";
import PanelField from "@/components/panel/molecules/PanelField/PanelField";
import StatusPill from "@/components/panel/atoms/StatusPill/StatusPill";
import PanelIcon from "@/components/panel/atoms/PanelIcon/PanelIcon";
import EstadoDaTela from "@/components/panel/molecules/EstadoDaTela/EstadoDaTela";
import { useLista, useRecurso, comFiltros } from "@/lib/painel/api-cliente";
import { moeda, numero, percentual } from "@/lib/painel/formato";
import styles from "../comercial.module.css";

/**
 * Comercial — Ativos.
 *
 * Tabela global de todos os ativos da plataforma. Note as duas colunas de
 * receita potencial: a do fornecedor e a da RED. Sao a mesma venda vista dos
 * dois lados, e e por isso que a coluna "Modelo" traz o percentual junto — o
 * numero so faz sentido com a regra que o gerou ao lado.
 */
export default function AtivosGestaoPage() {
  const [status, setStatus] = useState("");
  const [categoria, setCategoria] = useState("");
  const [modelo, setModelo] = useState("");
  const [busca, setBusca] = useState("");

  // Todos os filtros vão para a API: filtrar 356 ativos no navegador exigiria
  // baixar os 356 a cada abertura da tela.
  const lista = useLista(
    comFiltros("/management/assets", {
      perPage: 100,
      status: status || undefined,
      category: categoria || undefined,
      commercialModel: modelo || undefined,
      search: busca.trim() || undefined,
    })
  );
  const visao = useRecurso("/management/overview?periodo=tudo");
  const linhas = lista.linhas;

  const colunas = [
    {
      chave: "nome",
      titulo: "Ativo",
      ordenavel: true,
      render: (l) => (
        <span className={styles.modelo}>
          <strong>{l.nome}</strong>
          <span className={styles.pct}>{l.id}</span>
        </span>
      ),
    },
    { chave: "fornecedor", titulo: "Fornecedor", ordenavel: true, largura: 160 },
    { chave: "categoria", titulo: "Categoria", ordenavel: true, largura: 130 },
    { chave: "local", titulo: "Localização", ordenavel: true, largura: 165 },
    {
      chave: "modelo",
      titulo: "Modelo",
      ordenavel: true,
      largura: 165,
      render: (l) => (
        <span className={styles.modelo}>
          {l.modelo}
          <span className={styles.pct}>{percentual(l.participacaoFornecedor)}</span>
        </span>
      ),
    },
    {
      chave: "preco",
      titulo: "Preço",
      ordenavel: true,
      alinhar: "direita",
      largura: 120,
      render: (l) => moeda(l.preco),
    },
    {
      chave: "potencialFornecedor",
      titulo: "Potencial fornecedor",
      ordenavel: true,
      alinhar: "direita",
      largura: 155,
      render: (l) => moeda(l.potencialFornecedor),
    },
    {
      chave: "potencialRed",
      titulo: "Potencial RED",
      ordenavel: true,
      alinhar: "direita",
      largura: 135,
      render: (l) => <strong>{moeda(l.potencialRed)}</strong>,
    },
    {
      chave: "status",
      titulo: "Status",
      ordenavel: true,
      largura: 160,
      render: (l) => <StatusPill status={l.status} />,
    },
    {
      chave: "acao",
      titulo: "Ação",
      alinhar: "centro",
      largura: 68,
      // So o ativo publicado tem pagina publica — a API serve `/ativos/:slug`
      // apenas com status publicado. Linkar os demais levaria a um 404, entao
      // o olho fica inerte e diz por que.
      render: (l) =>
        l.statusChave === "publicado" && l.slug ? (
          <Link
            href={`/produto/${l.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.verBtn}
            title={`Ver ${l.nome || "ativo"} no site`}
            aria-label={`Ver ${l.nome || "ativo"} no site`}
          >
            <PanelIcon name="eye" size={16} />
          </Link>
        ) : (
          <span
            className={`${styles.verBtn} ${styles.verBtnInativo}`}
            title="Sem página pública: o ativo ainda não foi publicado."
            aria-label="Sem página pública"
          >
            <PanelIcon name="eye" size={16} />
          </span>
        ),
    },
  ];

  const alertas = visao.dados?.alertas;
  const estadoGeral = visao.dados?.estado;

  return (
    <>
      <PageHeader
        titulo="Ativos"
        descricao="Todos os ativos da plataforma, com fornecedor e regra comercial."
        trilha={[{ label: "Comercial" }, { label: "Ativos" }]}
      />

      <div className={styles.kpis4}>
        <StatCard
          rotulo="Ativos publicados"
          valor={numero(estadoGeral?.ativosPublicados ?? 0)}
          icone="box"
          tone="ok"
          natureza="estado"
        />
        <StatCard
          rotulo="Valor total publicado"
          valor={moeda(estadoGeral?.valorTotalPublicado ?? 0, { curta: true })}
          icone="tag"
          tone="accent"
          natureza="estado"
        />
        <StatCard
          rotulo="Novos para avaliação"
          valor={numero(alertas?.enviosSemAvaliacao ?? 0)}
          icone="alert"
          tone="warn"
          nota="Curadoria pendente"
          destaque={(alertas?.enviosSemAvaliacao ?? 0) > 0}
        />
        <StatCard
          rotulo="Aguardando aprovação"
          valor={numero(alertas?.ativosAguardandoAprovacao ?? 0)}
          icone="clock"
          tone="warn"
          nota="Do fornecedor"
          destaque={(alertas?.ativosAguardandoAprovacao ?? 0) > 0}
        />
      </div>

      <PanelCard padding="none">
        <div className={styles.barraFiltros}>
          <PanelField
            name="busca"
            placeholder="Buscar ativo, fornecedor ou código…"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className={styles.busca}
          />
          <PanelField
            name="categoria"
            as="select"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className={styles.filtroSelect}
            opcoes={[
              { valor: "", label: "Todas as categorias" },
              { valor: "red-construcao", label: "RED Construção" },
              { valor: "red-equipamentos", label: "RED Equipamentos" },
              { valor: "red-mobiliario", label: "RED Mobiliário" },
            ]}
          />
          <PanelField
            name="modelo"
            as="select"
            value={modelo}
            onChange={(e) => setModelo(e.target.value)}
            className={styles.filtroSelect}
            opcoes={[
              { valor: "", label: "Todos os modelos" },
              { valor: "catalogo", label: "RED Catálogo" },
              { valor: "estoque", label: "RED Estoque" },
            ]}
          />
          <PanelField
            name="status"
            as="select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={styles.filtroSelect}
            opcoes={[
              { valor: "", label: "Todos os status" },
              { valor: "em_avaliacao", label: "Em avaliação" },
              { valor: "aguardando_aprovacao", label: "Aguardando aprovação" },
              { valor: "publicado", label: "Publicado" },
              { valor: "vendido", label: "Vendido" },
              { valor: "inativo", label: "Inativo" },
            ]}
          />
        </div>

        <EstadoDaTela carregando={lista.carregando} erro={lista.erro} onTentarNovamente={lista.recarregar} esqueleto="tabela" colunas={10}>
        <DataTable
          colunas={colunas}
          linhas={linhas}
          rodape={`Mostrando ${linhas.length} de ${lista.meta?.total ?? linhas.length} ativos`}
          vazio={{ icone: "box", titulo: "Nenhum ativo encontrado com estes filtros." }}
        />
        </EstadoDaTela>
      </PanelCard>
    </>
  );
}
