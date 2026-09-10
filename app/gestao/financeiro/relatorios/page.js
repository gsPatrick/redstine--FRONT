"use client";

import { useState } from "react";
import PageHeader from "@/components/panel/molecules/PageHeader/PageHeader";
import PanelCard from "@/components/panel/molecules/PanelCard/PanelCard";
import PanelField from "@/components/panel/molecules/PanelField/PanelField";
import PanelButton from "@/components/panel/atoms/PanelButton/PanelButton";
import PanelIcon from "@/components/panel/atoms/PanelIcon/PanelIcon";
import DataTable from "@/components/panel/molecules/DataTable/DataTable";
import EstadoDaTela from "@/components/panel/molecules/EstadoDaTela/EstadoDaTela";
import { useRecurso, comFiltros } from "@/lib/painel/api-cliente";
import { API_BASE, lerToken } from "@/lib/api";
import { moeda, numero, percentual } from "@/lib/painel/formato";
import styles from "./relatorios.module.css";

/**
 * Relatorios.
 *
 * Na V1 o relatorio e exportacao de dado bruto por recorte — nao analytics.
 * O documento e explicito: analise fica para a V2, e o que importa agora e
 * registar tudo. Prometer grafico de forecast aqui seria vender o que ainda
 * nao existe historico para sustentar.
 */
const RECORTES = [
  { valor: "vendas", label: "Vendas do período", icone: "chart" },
  { valor: "repasses", label: "Repasses aos fornecedores", icone: "wallet" },
  { valor: "ativos", label: "Ativos publicados", icone: "box" },
  { valor: "consultas", label: "Consultas recebidas", icone: "chat" },
];

export default function RelatoriosPage() {
  const [recorte, setRecorte] = useState("vendas");
  const [periodo, setPeriodo] = useState({ de: "", ate: "", formato: "csv" });

  const modelo = useRecurso("/management/reports/by-model?periodo=tudo");
  const categoria = useRecurso("/management/reports/by-category?periodo=tudo");
  // O recorte por fornecedor a API ja servia e a tela nao mostrava. E o que
  // responde "quanto cada fornecedor movimentou e quanto ja tem a receber" —
  // a pergunta que o comercial faz antes de ligar para um deles.
  const fornecedor = useRecurso("/management/reports/by-supplier?periodo=tudo");

  const porModelo = modelo.dados || [];
  const porCategoria = categoria.dados || [];
  const porFornecedor = fornecedor.dados || [];
  const totalCategoria = porCategoria.reduce((a, c) => a + c.valor, 0);
  const brutoFornecedores = porFornecedor.reduce((a, f) => a + f.valorBruto, 0);
  const receitaTotal = porModelo.reduce((a, m) => a + m.receitaRed, 0);

  /**
   * A exportação sai por download direto, não por `fetch` + blob: o CSV vem do
   * servidor com Content-Disposition e nome pronto, e o navegador sabe salvar.
   * Passar o token na URL é aceitável aqui porque a rota é GET e o link não é
   * compartilhado — a alternativa seria montar o ficheiro no cliente e perder
   * o cabeçalho que o Excel usa.
   */
  function exportar() {
    const q = new URLSearchParams({ formato: periodo.formato, periodo: "tudo" });
    if (periodo.de) { q.set("desde", periodo.de); q.delete("periodo"); }
    if (periodo.ate) q.set("ate", periodo.ate);

    const url = `${API_BASE}/management/reports/${recorte}/export?${q}`;
    fetch(url, { headers: { Authorization: `Bearer ${lerToken()}` } })
      .then((r) => r.blob())
      .then((blob) => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `red-${recorte}-${new Date().toISOString().slice(0, 10)}.${periodo.formato}`;
        a.click();
        URL.revokeObjectURL(a.href);
      });
  }

  return (
    <>
      <PageHeader
        titulo="Relatórios"
        descricao="Exportação de dados por período, fornecedor, categoria e modelo comercial."
        trilha={[{ label: "Financeiro" }, { label: "Relatórios" }]}
      />

      <PanelCard titulo="Gerar relatório" className={styles.gerador}>
        <div className={styles.recortes}>
          {RECORTES.map((r) => (
            <button
              key={r.valor}
              type="button"
              className={`${styles.recorte} ${recorte === r.valor ? styles.ativo : ""}`}
              onClick={() => setRecorte(r.valor)}
            >
              <PanelIcon name={r.icone} size={17} />
              {r.label}
            </button>
          ))}
        </div>

        <div className={styles.filtros}>
          <PanelField
            label="De"
            name="de"
            type="date"
            value={periodo.de}
            onChange={(e) => setPeriodo((p) => ({ ...p, de: e.target.value }))}
            dica="Vazio exporta todo o período."
          />
          <PanelField
            label="Até"
            name="ate"
            type="date"
            value={periodo.ate}
            onChange={(e) => setPeriodo((p) => ({ ...p, ate: e.target.value }))}
          />
          <PanelField
            label="Formato"
            name="formato"
            as="select"
            value={periodo.formato}
            onChange={(e) => setPeriodo((p) => ({ ...p, formato: e.target.value }))}
            opcoes={[
              { valor: "csv", label: "CSV (abre no Excel)" },
              { valor: "json", label: "JSON" },
            ]}
            dica="XLSX e PDF entram quando houver necessidade real."
          />
        </div>

        <div className={styles.acao}>
          <PanelButton icon="download" onClick={exportar}>
            Exportar relatório
          </PanelButton>
        </div>
      </PanelCard>

      <div className={styles.resumos}>
        <PanelCard titulo="Resultado por modelo comercial" padding="none">
          <EstadoDaTela carregando={modelo.carregando} erro={modelo.erro} onTentarNovamente={modelo.recarregar}>
          <DataTable
            porPagina={5}
            colunas={[
              { chave: "modelo", titulo: "Modelo" },
              {
                chave: "participacaoFornecedor",
                titulo: "% Fornecedor",
                alinhar: "direita",
                render: (l) => percentual(l.participacaoFornecedor),
              },
              { chave: "operacoes", titulo: "Operações", alinhar: "direita" },
              {
                chave: "valorBruto",
                titulo: "Valor bruto",
                alinhar: "direita",
                render: (l) => moeda(l.valorBruto),
              },
              {
                chave: "receitaRed",
                titulo: "Receita RED",
                alinhar: "direita",
                render: (l) => <strong>{moeda(l.receitaRed)}</strong>,
              },
              {
                chave: "margem",
                titulo: "Margem",
                alinhar: "direita",
                render: (l) => (l.margemRed == null ? "—" : percentual(l.margemRed, 1)),
              },
            ]}
            linhas={porModelo}
            chave="modeloChave"
            rodape={`Receita RED total: ${moeda(receitaTotal)}`}
            vazio={{ icone: "chart", titulo: "Nenhuma operação no período." }}
          />
          </EstadoDaTela>
        </PanelCard>

        <PanelCard titulo="Receita por categoria" padding="none">
          <EstadoDaTela carregando={categoria.carregando} erro={categoria.erro} onTentarNovamente={categoria.recarregar}>
          <DataTable
            porPagina={6}
            colunas={[
              { chave: "rotulo", titulo: "Categoria" },
              {
                chave: "valor",
                titulo: "Valor bruto",
                alinhar: "direita",
                render: (l) => moeda(l.valor),
              },
              {
                chave: "share",
                titulo: "Participação",
                alinhar: "direita",
                valor: (l) => l.valor,
                render: (l) => percentual(l.percentual),
              },
            ]}
            linhas={porCategoria}
            chave="rotulo"
            rodape={`Total: ${moeda(totalCategoria)}`}
            vazio={{ icone: "chart", titulo: "Nenhuma venda no período." }}
          />
          </EstadoDaTela>
        </PanelCard>

        <PanelCard titulo="Movimentação por fornecedor" padding="none">
          <EstadoDaTela
            carregando={fornecedor.carregando}
            erro={fornecedor.erro}
            onTentarNovamente={fornecedor.recarregar}
          >
            <DataTable
              porPagina={6}
              colunas={[
                { chave: "fornecedor", titulo: "Fornecedor" },
                {
                  chave: "operacoes",
                  titulo: "Operações",
                  alinhar: "direita",
                  render: (l) => numero(l.operacoes),
                },
                {
                  chave: "valorBruto",
                  titulo: "Valor bruto",
                  alinhar: "direita",
                  render: (l) => moeda(l.valorBruto),
                },
                {
                  chave: "repasse",
                  titulo: "Repasse",
                  alinhar: "direita",
                  render: (l) => moeda(l.repasse),
                },
                {
                  chave: "receitaRed",
                  titulo: "Receita RED",
                  alinhar: "direita",
                  render: (l) => <strong>{moeda(l.receitaRed)}</strong>,
                },
              ]}
              linhas={porFornecedor}
              chave="fornecedorId"
              rodape={`Bruto movimentado: ${moeda(brutoFornecedores)}`}
              vazio={{ icone: "users", titulo: "Nenhuma operação com fornecedor no período." }}
            />
          </EstadoDaTela>
        </PanelCard>
      </div>
    </>
  );
}
