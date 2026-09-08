"use client";

import { useParams } from "next/navigation";
import PageHeader from "@/components/panel/molecules/PageHeader/PageHeader";
import PanelCard from "@/components/panel/molecules/PanelCard/PanelCard";
import PanelButton from "@/components/panel/atoms/PanelButton/PanelButton";
import StatusPill from "@/components/panel/atoms/StatusPill/StatusPill";
import Timeline from "@/components/panel/molecules/Timeline/Timeline";
import EstadoDaTela from "@/components/panel/molecules/EstadoDaTela/EstadoDaTela";
import { useRecurso } from "@/lib/painel/api-cliente";
import { moeda, numero, percentual, data as fmtData } from "@/lib/painel/formato";
import styles from "./detalhe.module.css";

/**
 * Detalhe financeiro da venda.
 *
 * "Regras Comerciais" mostra o percentual APLICADO naquela venda, não o atual
 * da modalidade — é o snapshot da seção 8. Se o RED Catálogo mudar de 65% para
 * 60% amanhã, esta tela continua exibindo 65%, porque foi isso que foi
 * acordado, calculado e pago.
 */
export default function DetalheVendaPage() {
  const { id } = useParams();
  const { dados: m, carregando, erro, recarregar } = useRecurso(
    `/management/financial/movements/${id}`
  );

  return (
    <>
      <PageHeader
        titulo={m ? `Detalhe da Venda ${m.venda}` : "Detalhe da Venda"}
        trilha={[
          { label: "Financeiro" },
          { label: "Movimentações", href: "/gestao/financeiro/movimentacoes" },
          { label: m?.venda || "—" },
        ]}
        acoes={
          <PanelButton
            href="/gestao/financeiro/movimentacoes"
            variant="outline"
            icon="arrowLeft"
            size="sm"
          >
            Voltar para movimentações
          </PanelButton>
        }
      />

      <EstadoDaTela carregando={carregando} erro={erro} onTentarNovamente={recarregar} altura={380}>
        {m && (
          <>
            <div className={styles.grade}>
              <PanelCard titulo="Informações da Venda">
                <dl className={styles.linhas}>
                  <Linha rotulo="Venda" valor={m.venda} />
                  <Linha rotulo="Data" valor={fmtData(m.data, { comHora: true })} />
                  <Linha rotulo="Cliente" valor={m.cliente} />
                  <Linha rotulo="Fornecedor" valor={m.fornecedor} />
                  <Linha rotulo="Ativo" valor={m.ativo} />
                  <Linha rotulo="Quantidade" valor={`${numero(m.quantidade)} unidades`} />
                  <Linha rotulo="Valor bruto" valor={moeda(m.regras.valorBruto)} destaque />
                  <Linha rotulo="Status da retirada" valor={m.statusRetirada || "—"} />
                </dl>
              </PanelCard>

              <PanelCard titulo="Regras Comerciais" descricao="Congeladas no momento da venda">
                <dl className={styles.linhas}>
                  <Linha rotulo="Modelo comercial" valor={m.regras.modelo} />
                  <Linha rotulo="% Fornecedor" valor={percentual(m.regras.participacaoFornecedor)} />
                  <Linha rotulo="% RED" valor={percentual(m.regras.participacaoRed)} />
                  <Linha rotulo="Valor bruto" valor={moeda(m.regras.valorBruto)} />
                  <Linha
                    rotulo="Custos aprovados"
                    valor={
                      m.regras.custosAprovados
                        ? `− ${moeda(m.regras.custosAprovados)}`
                        : moeda(0)
                    }
                  />
                  <Linha rotulo="Valor líquido" valor={moeda(m.regras.valorLiquido)} separador />
                  <Linha rotulo="Valor fornecedor" valor={moeda(m.regras.valorFornecedor)} destaque />
                  <Linha rotulo="Receita RED" valor={moeda(m.regras.receitaRed)} destaque />
                </dl>

                {m.custos?.length > 0 && (
                  <ul className={styles.custos}>
                    {m.custos.map((c) => (
                      <li key={c.id}>
                        <span>{c.descricao || c.tipo}</span>
                        <strong>{moeda(c.valor)}</strong>
                      </li>
                    ))}
                  </ul>
                )}
              </PanelCard>

              <PanelCard titulo="Status Financeiro">
                <dl className={styles.linhas}>
                  <Linha
                    rotulo="Status atual"
                    valor={<StatusPill status={m.financeiro.status} />}
                  />
                  <Linha
                    rotulo="Data prevista para pagamento"
                    valor={m.financeiro.previsaoPagamento ? fmtData(m.financeiro.previsaoPagamento) : "—"}
                  />
                  <Linha
                    rotulo="Data do pagamento"
                    valor={m.financeiro.pagamento ? fmtData(m.financeiro.pagamento) : "—"}
                  />
                  <Linha rotulo="Meio" valor={m.financeiro.meio || "—"} />
                  <Linha rotulo="Comprovante" valor={m.financeiro.comprovante || "—"} />
                </dl>

                {m.financeiro.statusChave !== "pago" && (
                  <p className={styles.prazo}>
                    O repasse é devido em até {m.financeiro.prazoHoras} horas a partir do registro de
                    conclusão integral da operação.
                  </p>
                )}
              </PanelCard>
            </div>

            <PanelCard titulo="Histórico da Venda" className={styles.historico}>
              <Timeline eventos={m.historico || []} />
            </PanelCard>
          </>
        )}
      </EstadoDaTela>
    </>
  );
}

function Linha({ rotulo, valor, destaque, separador }) {
  return (
    <div className={`${styles.linha} ${separador ? styles.separador : ""}`}>
      <dt>{rotulo}</dt>
      <dd className={destaque ? styles.destaque : ""}>{valor}</dd>
    </div>
  );
}
