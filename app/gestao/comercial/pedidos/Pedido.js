"use client";

import { useState } from "react";
import PanelField from "@/components/panel/molecules/PanelField/PanelField";
import PanelButton from "@/components/panel/atoms/PanelButton/PanelButton";
import PanelIcon from "@/components/panel/atoms/PanelIcon/PanelIcon";
import StatusPill from "@/components/panel/atoms/StatusPill/StatusPill";
import EstadoDaTela from "@/components/panel/molecules/EstadoDaTela/EstadoDaTela";
import {
  useRecurso,
  confirmarPedido,
  mudarStatusDoPedido,
  registrarPagamento,
  registrarRetirada,
  concluirPedido,
} from "@/lib/painel/api-cliente";
import { moeda, data as fmtData } from "@/lib/painel/formato";
import {
  ROTULO_PEDIDO,
  ROTULO_PAGAMENTO,
  ROTULO_RETIRADA,
  ROTULO_CONDICAO,
  STATUS_PAGAMENTO,
  STATUS_RETIRADA,
  TRANSICOES_PEDIDO,
} from "@/lib/painel/pedidos";
import styles from "./pedidos.module.css";

/**
 * Operação de um pedido.
 *
 * A ordem na tela é a ordem do trabalho: confirmar a venda, acertar pagamento,
 * acertar retirada, concluir. Concluir fica por último e desabilitado
 * enquanto faltar alguma condição — e a lista diz QUAIS faltam, lida da própria
 * API, em vez de deixar o operador clicar e receber um erro genérico.
 *
 * Só a conclusão libera o repasse ao fornecedor. É por isso que ela não é um
 * status que se escolhe na lista: é uma verificação.
 */
export default function Pedido({ id, aoMudar }) {
  const { dados: pedido, carregando, erro, recarregar } = useRecurso(`/orders/${id}`);
  const { dados: pendencias, recarregar: recarregarPendencias } = useRecurso(
    `/orders/${id}/completion`
  );

  const [gravando, setGravando] = useState(false);
  const [falha, setFalha] = useState(null);

  const proteger = async (fn) => {
    setFalha(null);
    setGravando(true);
    try {
      await fn();
      recarregar();
      recarregarPendencias();
      aoMudar?.();
    } catch (e) {
      setFalha(e.details?.[0]?.motivo || e.message);
    } finally {
      setGravando(false);
    }
  };

  if (carregando || erro || !pedido) {
    return (
      <EstadoDaTela
        carregando={carregando}
        erro={erro}
        onTentarNovamente={recarregar}
        esqueleto="bloco"
        altura={320}
      >
        <span />
      </EstadoDaTela>
    );
  }

  const transicoes = TRANSICOES_PEDIDO[pedido.status] || [];
  const faltam = (pendencias?.condicoes || []).filter((c) => !c.ok);

  return (
    <div className={styles.pedido}>
      {falha && (
        <p className={styles.erroForm}>
          <PanelIcon name="alert" size={15} />
          {falha}
        </p>
      )}

      <div className={styles.topoPedido}>
        <span className={styles.ref}>{pedido.reference}</span>
        <StatusPill status={ROTULO_PEDIDO[pedido.status] || pedido.status} />
      </div>

      <dl className={styles.dados}>
        <Dado rotulo="Comprador" valor={pedido.buyerName} />
        <Dado rotulo="E-mail" valor={pedido.buyerEmail} />
        <Dado rotulo="Telefone" valor={pedido.buyerPhone} />
        <Dado rotulo="Documento" valor={pedido.buyerDocument} />
        <Dado rotulo="Feito em" valor={fmtData(pedido.createdAt, { comHora: true })} />
        <Dado rotulo="Forma de pagamento" valor={pedido.paymentMethod?.toUpperCase()} />
      </dl>

      <div className={styles.itens}>
        <strong className={styles.tituloBloco}>Itens</strong>
        <ul>
          {(pedido.itens || []).map((i) => (
            <li key={i.id}>
              <span>{i.nameSnapshot}</span>
              <em>
                {i.quantity} × {moeda(Number(i.unitPrice))}
              </em>
              <strong>{moeda(Number(i.total))}</strong>
            </li>
          ))}
        </ul>
        <div className={styles.totais}>
          <span>Subtotal {moeda(Number(pedido.subtotal))}</span>
          {Number(pedido.approvedCosts) > 0 && (
            <span>Custos {moeda(Number(pedido.approvedCosts))}</span>
          )}
          <strong>Total {moeda(Number(pedido.total))}</strong>
        </div>
      </div>

      {/* 1. Confirmar */}
      {pedido.status === "aguardando_confirmacao" && (
        <div className={styles.passo}>
          <div>
            <strong className={styles.tituloBloco}>Confirmar a venda</strong>
            <p className={styles.notaPasso}>
              O comprador está vendo &ldquo;aguardando confirmação&rdquo;. A venda só entra nos
              números da gestão depois deste passo.
            </p>
          </div>
          <PanelButton
            variant="success"
            disabled={gravando}
            onClick={() => proteger(() => confirmarPedido(id))}
          >
            {gravando ? "Confirmando…" : "Confirmar venda"}
          </PanelButton>
        </div>
      )}

      {/* 2. Pagamento */}
      <form
        className={styles.blocoForm}
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          proteger(() =>
            registrarPagamento(id, {
              status: f.get("statusPagamento"),
              reference: f.get("referenciaPagamento")?.toString().trim() || undefined,
            })
          );
        }}
      >
        <strong className={styles.tituloBloco}>
          Pagamento
          <StatusPill
            status={ROTULO_PAGAMENTO[pedido.paymentStatus] || pedido.paymentStatus}
            tone={pedido.paymentStatus === "pago" ? "ok" : "warn"}
            size="sm"
          />
        </strong>
        <div className={styles.linhaCampos}>
          <PanelField
            label="Situação"
            name="statusPagamento"
            as="select"
            defaultValue={pedido.paymentStatus}
            opcoes={STATUS_PAGAMENTO.map((v) => ({ valor: v, label: ROTULO_PAGAMENTO[v] }))}
          />
          <PanelField
            label="Comprovante / referência"
            name="referenciaPagamento"
            placeholder="ID da transação, número do PIX…"
          />
          <PanelButton type="submit" variant="outline" disabled={gravando}>
            Salvar
          </PanelButton>
        </div>
        {pedido.paymentConfirmedAt && (
          <span className={styles.quando}>
            Confirmado em {fmtData(pedido.paymentConfirmedAt, { comHora: true })}
          </span>
        )}
      </form>

      {/* 3. Retirada */}
      <form
        className={styles.blocoForm}
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          const t = (k) => f.get(k)?.toString().trim() || undefined;
          proteger(() =>
            registrarRetirada(id, {
              status: f.get("statusRetirada"),
              local: t("local"),
              endereco: t("endereco"),
              responsavel: t("responsavel"),
              contato: t("contato"),
              agendamento: t("agendamento") || undefined,
              instrucoes: t("instrucoes"),
            })
          );
        }}
      >
        <strong className={styles.tituloBloco}>
          Retirada
          <StatusPill
            status={ROTULO_RETIRADA[pedido.pickupStatus] || pedido.pickupStatus}
            tone={pedido.pickupStatus === "concluida" ? "ok" : "neutral"}
            size="sm"
          />
        </strong>
        <div className={styles.gradeCampos}>
          <PanelField
            label="Situação"
            name="statusRetirada"
            as="select"
            defaultValue={pedido.pickupStatus}
            opcoes={STATUS_RETIRADA.map((v) => ({ valor: v, label: ROTULO_RETIRADA[v] }))}
          />
          <PanelField
            label="Data agendada"
            name="agendamento"
            type="datetime-local"
            defaultValue={
              pedido.pickupScheduledAt
                ? new Date(pedido.pickupScheduledAt).toISOString().slice(0, 16)
                : ""
            }
          />
          <PanelField label="Local" name="local" defaultValue={pedido.pickupLocation || ""} />
          <PanelField label="Endereço" name="endereco" defaultValue={pedido.pickupAddress || ""} />
          <PanelField
            label="Responsável"
            name="responsavel"
            defaultValue={pedido.pickupContactName || ""}
          />
          <PanelField
            label="Contato"
            name="contato"
            defaultValue={pedido.pickupContactPhone || ""}
          />
          <PanelField
            label="Instruções"
            name="instrucoes"
            as="textarea"
            rows={2}
            defaultValue={pedido.pickupInstructions || ""}
            className={styles.campoLargo}
            dica="O comprador vê isto no Detalhe da Compra."
          />
        </div>
        <div className={styles.acoesBloco}>
          <PanelButton type="submit" variant="outline" disabled={gravando}>
            Salvar retirada
          </PanelButton>
        </div>
      </form>

      {/* 4. Situação e conclusão */}
      <div className={styles.blocoForm}>
        <strong className={styles.tituloBloco}>Concluir a operação</strong>

        {pedido.status === "concluido" ? (
          <p className={styles.concluido}>
            Operação concluída
            {pedido.operationCompletedAt
              ? ` em ${fmtData(pedido.operationCompletedAt, { comHora: true })}`
              : ""}
            . O repasse ao fornecedor foi liberado.
          </p>
        ) : (
          <>
            <ul className={styles.condicoes}>
              {(pendencias?.condicoes || []).map((c) => (
                <li key={c.chave} className={c.ok ? styles.condicaoOk : styles.condicaoFalta}>
                  <PanelIcon name={c.ok ? "checkCircle" : "clock"} size={14} />
                  {ROTULO_CONDICAO[c.chave] || c.chave}
                </li>
              ))}
            </ul>

            <p className={styles.notaPasso}>
              {faltam.length
                ? "Só é possível concluir depois que todas as condições acima estiverem cumpridas. A conclusão é o que libera o repasse ao fornecedor."
                : "Tudo pronto. Concluir libera o repasse ao fornecedor."}
            </p>

            <div className={styles.acoesBloco}>
              {transicoes.includes("cancelado") && (
                <PanelButton
                  type="button"
                  variant="ghost"
                  disabled={gravando}
                  onClick={() => {
                    const motivo = window.prompt("Motivo do cancelamento:");
                    if (motivo === null) return;
                    proteger(() => mudarStatusDoPedido(id, "cancelado", motivo || undefined));
                  }}
                >
                  Cancelar pedido
                </PanelButton>
              )}
              <PanelButton
                variant="success"
                disabled={gravando || !pendencias?.pode}
                onClick={() => proteger(() => concluirPedido(id))}
              >
                {gravando ? "Concluindo…" : "Concluir operação"}
              </PanelButton>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Dado({ rotulo, valor }) {
  if (!valor) return null;
  return (
    <div className={styles.item}>
      <dt>{rotulo}</dt>
      <dd>{valor}</dd>
    </div>
  );
}
