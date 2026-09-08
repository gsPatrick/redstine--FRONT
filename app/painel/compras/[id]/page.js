"use client";

import { useParams } from "next/navigation";
import PageHeader from "@/components/panel/molecules/PageHeader/PageHeader";
import PanelCard from "@/components/panel/molecules/PanelCard/PanelCard";
import PanelButton from "@/components/panel/atoms/PanelButton/PanelButton";
import StatusPill from "@/components/panel/atoms/StatusPill/StatusPill";
import Timeline from "@/components/panel/molecules/Timeline/Timeline";
import PanelIcon from "@/components/panel/atoms/PanelIcon/PanelIcon";
import EstadoDaTela from "@/components/panel/molecules/EstadoDaTela/EstadoDaTela";
import { useRecurso } from "@/lib/painel/api-cliente";
import { moeda, quantidade, data as fmtData } from "@/lib/painel/formato";
import styles from "./detalhe.module.css";

/**
 * Detalhe da compra.
 *
 * A retirada vive DENTRO da compra: não existe página independente de Retiradas
 * na V1, ela é um estado deste pedido. O histórico abaixo conta como se chegou
 * até ele, com as etapas futuras apagadas em vez de escondidas.
 */
export default function DetalheCompraPage() {
  const { id } = useParams();
  const { dados: compra, carregando, erro, recarregar } = useRecurso(`/me/purchases/${id}`);
  const produto = compra?.itens?.[0];

  return (
    <>
      <PageHeader
        titulo={compra ? `Detalhe da Compra ${compra.pedido}` : "Detalhe da Compra"}
        trilha={[
          { label: "Comprar" },
          { label: "Minhas Compras", href: "/painel/compras" },
          { label: compra?.pedido || "—" },
        ]}
        acoes={
          <PanelButton href="/painel/compras" variant="outline" icon="arrowLeft" size="sm">
            Voltar para compras
          </PanelButton>
        }
      />

      <EstadoDaTela carregando={carregando} erro={erro} onTentarNovamente={recarregar} altura={360}>
        {compra && (
          <div className={styles.grade}>
            <PanelCard titulo="Produto" className={styles.produto}>
              <div className={styles.foto}>
                {produto?.imagem ? (
                  <img src={produto.imagem} alt={produto.nome} />
                ) : (
                  <PanelIcon name="image" size={26} />
                )}
              </div>
              <h3 className={styles.nome}>{produto?.nome || "—"}</h3>
              <dl className={styles.linhas}>
                <Linha rotulo="Quantidade" valor={quantidade(produto?.quantidade)} />
                <Linha rotulo="Código RED" valor={produto?.codigo || "—"} />
                {compra.itens?.length > 1 && (
                  <Linha rotulo="Itens no pedido" valor={compra.itens.length} />
                )}
              </dl>
            </PanelCard>

            <PanelCard titulo="Compra">
              <dl className={styles.linhas}>
                <Linha rotulo="Data da compra" valor={fmtData(compra.data, { comHora: true })} />
                <Linha rotulo="Valor total" valor={moeda(compra.valor)} destaque />
                <Linha rotulo="Forma de pagamento" valor={rotuloPagamento(compra.formaPagamento)} />
                <Linha rotulo="Status" valor={<StatusPill status={compra.status} />} />
              </dl>
            </PanelCard>

            <PanelCard titulo="Histórico" className={styles.historico}>
              <Timeline eventos={compra.historico || []} />
            </PanelCard>

            <PanelCard titulo="Retirada" className={styles.retirada}>
              {compra.retirada ? (
                <dl className={styles.linhas}>
                  <Linha rotulo="Local" valor={compra.retirada.local || "A combinar"} />
                  <Linha rotulo="Endereço" valor={compra.retirada.endereco || "A combinar"} />
                  <Linha
                    rotulo="Responsável"
                    valor={
                      compra.retirada.responsavel
                        ? `${compra.retirada.responsavel}${
                            compra.retirada.contato ? ` — ${compra.retirada.contato}` : ""
                          }`
                        : "A definir"
                    }
                  />
                  <Linha
                    rotulo="Data agendada"
                    valor={
                      compra.retirada.agendamento
                        ? fmtData(compra.retirada.agendamento, { comHora: true })
                        : "Aguardando agendamento"
                    }
                  />
                  <Linha rotulo="Instruções" valor={compra.retirada.instrucoes || "—"} />
                </dl>
              ) : (
                <p className={styles.semRetirada}>
                  <PanelIcon name="alert" size={15} />
                  Esta compra foi cancelada, portanto não há retirada associada.
                </p>
              )}
            </PanelCard>
          </div>
        )}
      </EstadoDaTela>
    </>
  );
}

const ROTULO_PAGAMENTO = {
  pix: "PIX",
  boleto: "Boleto",
  cartao: "Cartão",
  transferencia: "Transferência bancária",
  consulta: "A combinar com o comercial",
};

const rotuloPagamento = (v) => ROTULO_PAGAMENTO[v] || v || "—";

function Linha({ rotulo, valor, destaque }) {
  return (
    <div className={styles.linha}>
      <dt>{rotulo}</dt>
      <dd className={destaque ? styles.destaque : ""}>{valor}</dd>
    </div>
  );
}
