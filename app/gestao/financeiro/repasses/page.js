"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import PageHeader from "@/components/panel/molecules/PageHeader/PageHeader";
import PanelCard from "@/components/panel/molecules/PanelCard/PanelCard";
import DataTable from "@/components/panel/molecules/DataTable/DataTable";
import StatCard from "@/components/panel/molecules/StatCard/StatCard";
import TabFilter from "@/components/panel/molecules/TabFilter/TabFilter";
import PanelButton from "@/components/panel/atoms/PanelButton/PanelButton";
import StatusPill from "@/components/panel/atoms/StatusPill/StatusPill";
import PanelIcon from "@/components/panel/atoms/PanelIcon/PanelIcon";
import EstadoDaTela from "@/components/panel/molecules/EstadoDaTela/EstadoDaTela";
import { useLista, programarRepasses, pagarRepasses, comFiltros } from "@/lib/painel/api-cliente";
import { moeda, data as fmtData } from "@/lib/painel/formato";
import styles from "../financeiro.module.css";
import proprios from "./repasses.module.css";

/**
 * Financeiro — Repasses.
 *
 * O prazo é regra de negócio, não meta interna: 48 horas contadas do registro
 * de conclusão integral. Por isso a coluna "Prazo" não mostra só a data —
 * mostra quanto falta, e um repasse vencido aparece em vermelho. Um número que
 * só aparece depois de estourado não serve como alerta.
 *
 * Quem calcula o aging é a API (`horasRestantes` e `situacao`): o limiar de
 * "vencendo" vem das configurações, e replicá-lo aqui faria a tela discordar do
 * backend no dia em que o cliente mudasse o valor.
 */
function faltam(horas) {
  if (horas === null || horas === undefined) return "sem prazo";
  if (horas < 0) {
    const h = Math.abs(horas);
    return h < 24 ? `${Math.round(h)} h em atraso` : `${Math.floor(h / 24)} d em atraso`;
  }
  if (horas < 1) return "vence agora";
  if (horas < 24) return `em ${Math.round(horas)} h`;
  return `em ${Math.floor(horas / 24)} d`;
}

const ABAS = [
  { valor: "devidos", label: "Devidos" },
  { valor: "programados", label: "Programados" },
  { valor: "pagos", label: "Pagos" },
];

export default function RepassesPage() {
  const [aba, setAba] = useState("devidos");
  const [selecionados, setSelecionados] = useState([]);
  const [agindo, setAgindo] = useState(false);
  const [erroAcao, setErroAcao] = useState(null);

  const lista = useLista(comFiltros("/management/financial/payouts", { aba, perPage: 100 }));
  const linhas = lista.linhas;
  const resumo = lista.meta?.resumo;

  const abas = ABAS.map((a) => ({
    ...a,
    contador: resumo?.contagem?.[a.valor] ?? undefined,
  }));

  const alternar = (id) =>
    setSelecionados((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  async function agir(acao) {
    setAgindo(true);
    setErroAcao(null);
    try {
      await acao();
      setSelecionados([]);
      await lista.recarregar();
    } catch (e) {
      setErroAcao(e.message);
    } finally {
      setAgindo(false);
    }
  }

  const colunas = [
    ...(aba === "pagos"
      ? []
      : [
          {
            chave: "sel",
            titulo: "",
            largura: 40,
            alinhar: "centro",
            render: (l) => (
              <input
                type="checkbox"
                className={proprios.check}
                checked={selecionados.includes(l.id)}
                onChange={() => alternar(l.id)}
                aria-label={`Selecionar ${l.venda}`}
              />
            ),
          },
        ]),
    { chave: "venda", titulo: "Venda", ordenavel: true, largura: 86 },
    { chave: "fornecedor", titulo: "Fornecedor", ordenavel: true, largura: 175 },
    { chave: "ativo", titulo: "Ativo", ordenavel: true },
    {
      chave: "valor",
      titulo: "Valor do repasse",
      ordenavel: true,
      alinhar: "direita",
      largura: 145,
      render: (l) => <strong>{moeda(l.valor)}</strong>,
    },
    {
      chave: "prazo",
      titulo: aba === "pagos" ? "Data do pagamento" : "Prazo (48h)",
      ordenavel: true,
      largura: 165,
      valor: (l) => new Date(l.pagoEm || l.prazo || 0).getTime(),
      render: (l) => {
        if (aba === "pagos") return fmtData(l.pagoEm);
        const tom =
          l.situacao === "vencido"
            ? proprios.vencido
            : l.situacao === "vencendo"
            ? proprios.vencendo
            : proprios.noPrazo;
        return (
          <span className={`${proprios.prazo} ${tom}`}>
            {fmtData(l.prazo)}
            <em>{faltam(l.horasRestantes)}</em>
          </span>
        );
      },
    },
    {
      chave: "status",
      titulo: "Status",
      ordenavel: true,
      largura: 172,
      render: (l) => <StatusPill status={l.status} />,
    },
    {
      chave: "acao",
      titulo: "Ação",
      alinhar: "centro",
      largura: 68,
      render: (l) => (
        <Link
          href={`/gestao/financeiro/movimentacoes/${l.id}`}
          className={styles.verBtn}
          aria-label={`Ver ${l.venda}`}
        >
          <PanelIcon name="eye" size={16} />
        </Link>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        titulo="Repasses"
        descricao="Valores devidos aos fornecedores e o prazo de cada um."
        trilha={[{ label: "Financeiro" }, { label: "Repasses" }]}
      />

      <EstadoDaTela carregando={lista.carregando} erro={lista.erro} onTentarNovamente={lista.recarregar} esqueleto="cards" quantidade={4}>
      {resumo && (
      <div className={proprios.kpis}>
        <StatCard
          rotulo="A repassar"
          valor={moeda(resumo.aRepassar, { curta: true })}
          icone="clock"
          tone="warn"
          nota={`${resumo.contagem.devidos} repasses devidos`}
          destaque
        />
        <StatCard
          rotulo="Vencidos"
          valor={moeda(resumo.vencidos, { curta: true })}
          icone="alert"
          tone="accent"
          nota={`Fora do prazo de ${resumo.prazoHoras}h`}
          destaque={resumo.vencidos > 0}
        />
        <StatCard
          rotulo="Programados"
          valor={moeda(resumo.programados, { curta: true })}
          icone="calendar"
          tone="info"
          nota={`${resumo.contagem.programados} pagamentos agendados`}
        />
        <StatCard
          rotulo="Repassado"
          valor={moeda(resumo.repassado, { curta: true })}
          icone="checkCircle"
          tone="ok"
          nota={`${resumo.contagem.pagos} pagamentos concluídos`}
        />
      </div>
      )}
      </EstadoDaTela>

      {erroAcao && <p className={proprios.erroAcao}>{erroAcao}</p>}

      <PanelCard padding="none">
        <div className={proprios.barra}>
          <TabFilter opcoes={abas} valor={aba} onChange={setAba} className={proprios.abas} />
          {selecionados.length > 0 && (
            <div className={proprios.lote}>
              <span>
                {selecionados.length} selecionado{selecionados.length > 1 ? "s" : ""} ·{" "}
                {moeda(
                  linhas.filter((l) => selecionados.includes(l.id)).reduce((a, l) => a + l.valor, 0)
                )}
              </span>
              <PanelButton
                size="sm"
                variant="outline"
                icon="calendar"
                disabled={agindo}
                onClick={() =>
                  agir(() =>
                    programarRepasses(selecionados, new Date(Date.now() + 86400000).toISOString())
                  )
                }
              >
                Programar pagamento
              </PanelButton>
              <PanelButton
                size="sm"
                variant="success"
                icon="check"
                disabled={agindo}
                onClick={() => agir(() => pagarRepasses(selecionados, { paymentMethod: "pix" }))}
              >
                Marcar como pago
              </PanelButton>
            </div>
          )}
        </div>

        <EstadoDaTela carregando={lista.carregando} erro={lista.erro} onTentarNovamente={lista.recarregar} esqueleto="tabela" colunas={8}>
        <DataTable
          colunas={colunas}
          linhas={linhas}
          rodape={`${linhas.length} repasse${linhas.length === 1 ? "" : "s"} nesta aba`}
          vazio={{ icone: "wallet", titulo: "Nenhum repasse nesta situação." }}
        />
        </EstadoDaTela>
      </PanelCard>

      <p className={styles.nota}>
        O prazo começa a contar a partir do registro de conclusão integral da operação — venda
        confirmada, pagamento do comprador confirmado, retirada concluída e sem pendência em aberto.
      </p>
    </>
  );
}
