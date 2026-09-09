"use client";

import { useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/panel/molecules/PageHeader/PageHeader";
import PanelCard from "@/components/panel/molecules/PanelCard/PanelCard";
import DataTable from "@/components/panel/molecules/DataTable/DataTable";
import StatCard from "@/components/panel/molecules/StatCard/StatCard";
import PanelField from "@/components/panel/molecules/PanelField/PanelField";
import StatusPill from "@/components/panel/atoms/StatusPill/StatusPill";
import PanelIcon from "@/components/panel/atoms/PanelIcon/PanelIcon";
import ProductCell from "@/components/panel/molecules/ProductCell/ProductCell";
import EstadoDaTela from "@/components/panel/molecules/EstadoDaTela/EstadoDaTela";
import { useLista, comFiltros } from "@/lib/painel/api-cliente";
import { data as fmtData } from "@/lib/painel/formato";
import { ROTULO_ENVIO, STATUS_ENVIO } from "@/lib/painel/envios";
import styles from "./envios.module.css";

/**
 * Comercial — Envios.
 *
 * A fila de curadoria. Um envio NAO e um ativo: e o que um fornecedor mandou
 * para avaliacao, e so vira ativo do catalogo depois de aprovado. Por isso tem
 * tela propria, e nao uma aba dentro de Ativos — o que se faz aqui e decidir,
 * nao administrar catalogo.
 *
 * A ordem e a fila real de trabalho: recebida primeiro, porque e o que ainda
 * nao teve ninguem olhando.
 */
export default function EnviosGestaoPage() {
  const [status, setStatus] = useState("");

  const { linhas, meta, carregando, erro, recarregar } = useLista(
    comFiltros("/submissions", { perPage: 100, status: status || undefined })
  );

  const envios = linhas || [];
  const contar = (s) => envios.filter((e) => e.status === s).length;

  const colunas = [
    {
      chave: "reference",
      titulo: "Envio",
      ordenavel: true,
      largura: 130,
      render: (l) => <span className={styles.ref}>{l.reference}</span>,
    },
    {
      chave: "assetType",
      titulo: "Ativo",
      ordenavel: true,
      render: (l) => (
        <ProductCell
          nome={l.assetType || l.description || "Sem descrição"}
          imagem={l.photos?.[0] || null}
          apoio={l.approximateQuantity}
        />
      ),
    },
    {
      chave: "fornecedor",
      titulo: "Fornecedor",
      ordenavel: true,
      valor: (l) => l.company || l.name || "",
      render: (l) => (
        <span className={styles.duasLinhas}>
          <strong>{l.company || l.name || "—"}</strong>
          <em>{l.email}</em>
        </span>
      ),
    },
    {
      chave: "city",
      titulo: "Localização",
      ordenavel: true,
      largura: 160,
      render: (l) => l.city || "—",
    },
    {
      chave: "fotos",
      titulo: "Fotos",
      alinhar: "centro",
      largura: 84,
      valor: (l) => l.photos?.length ?? 0,
      ordenavel: true,
      // Sem foto a curadoria nao consegue avaliar condicao, e isso muda o que
      // ela precisa fazer a seguir — por isso a ausencia aparece na lista, e
      // nao so ao abrir o envio.
      render: (l) =>
        l.photos?.length ? (
          <span className={styles.temFoto}>
            <PanelIcon name="image" size={13} />
            {l.photos.length}
          </span>
        ) : (
          <span className={styles.semFoto} title="Enviado sem fotos">
            —
          </span>
        ),
    },
    {
      chave: "createdAt",
      titulo: "Recebido em",
      ordenavel: true,
      largura: 130,
      valor: (l) => new Date(l.createdAt).getTime(),
      render: (l) => fmtData(l.createdAt),
    },
    {
      chave: "status",
      titulo: "Status",
      ordenavel: true,
      largura: 140,
      render: (l) => <StatusPill status={ROTULO_ENVIO[l.status] || l.status} />,
    },
    {
      chave: "acao",
      titulo: "Ação",
      alinhar: "centro",
      largura: 120,
      render: (l) => (
        <Link href={`/gestao/comercial/envios/${l.id}`} className={styles.abrir}>
          {l.status === "recebida" ? "Avaliar" : "Abrir"}
        </Link>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        titulo="Envios"
        descricao="Ativos enviados por fornecedores, aguardando curadoria."
        trilha={[{ label: "Comercial" }, { label: "Envios" }]}
      />

      <div className={styles.kpis}>
        <StatCard
          rotulo="Aguardando avaliação"
          valor={contar(STATUS_ENVIO.RECEBIDA)}
          icone="box"
          tone="warn"
          nota="Ninguém abriu ainda"
          destaque={contar(STATUS_ENVIO.RECEBIDA) > 0}
        />
        <StatCard
          rotulo="Em avaliação"
          valor={contar(STATUS_ENVIO.EM_AVALIACAO)}
          icone="clock"
          tone="info"
          nota="Com a curadoria"
        />
        <StatCard
          rotulo="Aprovados"
          valor={contar(STATUS_ENVIO.APROVADA)}
          icone="checkCircle"
          tone="ok"
          nota="Viraram ativo"
        />
        <StatCard
          rotulo="Recusados"
          valor={contar(STATUS_ENVIO.RECUSADA)}
          icone="alert"
          tone="danger"
          nota="Com motivo registrado"
        />
      </div>

      <PanelCard>
        <div className={styles.filtros}>
          <PanelField
            label="Status"
            name="status"
            as="select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            opcoes={[
              { valor: "", label: "Todos os status" },
              ...Object.values(STATUS_ENVIO).map((s) => ({ valor: s, label: ROTULO_ENVIO[s] })),
            ]}
            className={styles.filtro}
          />
        </div>

        <EstadoDaTela
          carregando={carregando}
          erro={erro}
          onTentarNovamente={recarregar}
          esqueleto="tabela"
          colunas={8}
        >
          <DataTable
            colunas={colunas}
            linhas={envios}
            rodape={
              meta
                ? `Mostrando ${envios.length} de ${meta.total} envios`
                : `${envios.length} envios`
            }
            vazio={{
              icone: "box",
              titulo: status ? "Nenhum envio com este status." : "Nenhum envio recebido ainda.",
              descricao:
                "Envios chegam pelo formulário da página Vender e pela Área do Cliente do fornecedor.",
            }}
          />
        </EstadoDaTela>
      </PanelCard>
    </>
  );
}
