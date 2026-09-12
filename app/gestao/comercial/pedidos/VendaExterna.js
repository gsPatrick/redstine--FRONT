"use client";

import { useState } from "react";
import PanelField from "@/components/panel/molecules/PanelField/PanelField";
import PanelButton from "@/components/panel/atoms/PanelButton/PanelButton";
import PanelIcon from "@/components/panel/atoms/PanelIcon/PanelIcon";
import { useLista, comFiltros, registrarVendaExterna } from "@/lib/painel/api-cliente";
import { moeda, numero } from "@/lib/painel/formato";
import { ROTULO_CANAL, CANAIS_EXTERNOS, FORMAS_PAGAMENTO } from "@/lib/painel/pedidos";
import styles from "./pedidos.module.css";

/**
 * Registro de venda fechada fora do site (revisão do cliente, item 11).
 *
 * "Forma de registro de vendas fora do site no sistema."
 *
 * A RED fecha negócio por WhatsApp e por telefone. Enquanto essas vendas não
 * entravam no sistema, três coisas ficavam erradas ao mesmo tempo: o site
 * continuava a oferecer um ativo já vendido, o fornecedor não tinha repasse
 * gerado, e os números da gestão mostravam menos do que a RED vendeu.
 *
 * O formulário é deliberadamente o mesmo VOCABULÁRIO do pedido do site —
 * comprador, item, quantidade, forma de pagamento — porque é o mesmo pedido do
 * outro lado. A API cria e CONFIRMA numa chamada, e é a confirmação que baixa
 * o estoque e grava o repasse com o percentual vigente.
 *
 * Duas escolhas que merecem justificação:
 *
 *  - O ATIVO é escolhido por busca no catálogo publicado, nunca digitado. Um
 *    campo de texto livre criaria venda sem ativo — sem baixa de estoque e sem
 *    fornecedor a quem repassar, que é exatamente o problema que este item
 *    existe para resolver.
 *  - O PREÇO vem preenchido com o do catálogo mas é editável. A venda por
 *    telefone é negociada; obrigar o preço publicado faria o operador editar o
 *    ativo só para poder registrar a venda, alterando o catálogo público por
 *    causa de um caso pontual.
 */
export default function VendaExterna({ aoRegistrar }) {
  const [busca, setBusca] = useState("");
  const [ativo, setAtivo] = useState(null);
  const [gravando, setGravando] = useState(false);
  const [falha, setFalha] = useState(null);
  // Marcados em estado, e não só lidos do FormData no envio: os campos de
  // comprovante e de local só aparecem depois de marcar. Visíveis sempre, o
  // operador preenchia o comprovante sem marcar "recebido" e o valor era
  // descartado em silêncio.
  const [pago, setPago] = useState(false);
  const [retirado, setRetirado] = useState(false);

  // Só procura a partir de dois caracteres: uma busca vazia devolveria o
  // catálogo inteiro numa lista de escolha, que não é uma lista de escolha.
  const termo = busca.trim();
  const { linhas: encontrados, carregando } = useLista(
    termo.length >= 2 ? comFiltros("/assets", { search: termo, perPage: 8 }) : null
  );

  const enviar = (e) => {
    e.preventDefault();
    if (!ativo) {
      setFalha("Escolha o ativo vendido.");
      return;
    }

    const f = new FormData(e.currentTarget);
    const t = (k) => f.get(k)?.toString().trim() || undefined;
    setFalha(null);
    setGravando(true);

    registrarVendaExterna({
      channel: f.get("channel"),
      buyerName: t("buyerName"),
      buyerEmail: t("buyerEmail"),
      buyerPhone: t("buyerPhone"),
      buyerDocument: t("buyerDocument"),
      paymentMethod: f.get("paymentMethod"),
      notes: t("notes"),
      items: [
        {
          assetId: ativo.id,
          quantity: Number(f.get("quantity")),
          unitPrice: Number(f.get("unitPrice")),
        },
      ],
      // Só viaja o que o operador marcou: mandar `aguardando` explicitamente
      // sobrescreveria o estado inicial com o mesmo valor e gravaria uma
      // mudança de pagamento que nunca aconteceu na auditoria.
      ...(pago ? { paymentStatus: "pago", paymentReference: t("paymentReference") } : {}),
      ...(retirado ? { pickupStatus: "concluida", pickupLocation: t("pickupLocation") } : {}),
    })
      .then((pedido) => aoRegistrar?.(pedido))
      .catch((err) => setFalha(err.details?.[0]?.motivo || err.message))
      .finally(() => setGravando(false));
  };

  return (
    <form className={styles.vendaExterna} onSubmit={enviar}>
      {falha && (
        <p className={styles.erroForm}>
          <PanelIcon name="alert" size={15} />
          {falha}
        </p>
      )}

      <p className={styles.notaPasso}>
        A venda é registrada e confirmada na mesma ação: a quantidade do ativo é baixada e o
        repasse ao fornecedor é gerado com o percentual vigente hoje, como em qualquer venda.
      </p>

      {/* 1. O ativo */}
      <div className={styles.blocoForm}>
        <strong className={styles.tituloBloco}>Ativo vendido</strong>

        {ativo ? (
          <div className={styles.ativoEscolhido}>
            <span>
              <strong>{ativo.name}</strong>
              <em>
                {ativo.sku} · {numero(ativo.quantity)} {ativo.unit || "un."} em estoque ·{" "}
                {ativo.underConsultation ? "sob consulta" : moeda(ativo.price)}
              </em>
            </span>
            <PanelButton type="button" variant="ghost" size="sm" onClick={() => setAtivo(null)}>
              Trocar
            </PanelButton>
          </div>
        ) : (
          <>
            <PanelField
              label="Buscar no catálogo publicado"
              name="buscaAtivo"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Nome, código ou marca…"
              dica="Só ativos publicados podem ser vendidos — o estoque precisa de existir para baixar."
            />
            {termo.length >= 2 && (
              <ul className={styles.resultados}>
                {carregando && <li className={styles.resultadoVazio}>Buscando…</li>}
                {!carregando && !encontrados.length && (
                  <li className={styles.resultadoVazio}>Nenhum ativo publicado com esse termo.</li>
                )}
                {encontrados.map((a) => (
                  <li key={a.id}>
                    <button type="button" onClick={() => setAtivo(a)} disabled={a.quantity < 1}>
                      <strong>{a.name}</strong>
                      <em>
                        {a.sku} · {numero(a.quantity)} {a.unit || "un."} ·{" "}
                        {a.underConsultation ? "sob consulta" : moeda(a.price)}
                        {a.quantity < 1 ? " · esgotado" : ""}
                      </em>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {ativo && (
          <div className={styles.linhaCampos}>
            <PanelField
              label="Quantidade"
              name="quantity"
              type="number"
              min={1}
              max={ativo.quantity}
              defaultValue={1}
              required
              dica={`Disponível: ${numero(ativo.quantity)} ${ativo.unit || "un."}`}
            />
            <PanelField
              label="Preço unitário praticado"
              name="unitPrice"
              type="number"
              step="0.01"
              min={0.01}
              defaultValue={ativo.price || ""}
              required
              dica="O valor negociado. Não altera o preço do catálogo."
            />
          </div>
        )}
      </div>

      {/* 2. Quem comprou e por onde */}
      <div className={styles.blocoForm}>
        <strong className={styles.tituloBloco}>Comprador e canal</strong>
        <div className={styles.gradeCampos}>
          <PanelField
            label="Canal"
            name="channel"
            as="select"
            defaultValue="whatsapp"
            opcoes={CANAIS_EXTERNOS.map((c) => ({ valor: c, label: ROTULO_CANAL[c] }))}
            dica="Como a venda foi fechada."
          />
          <PanelField
            label="Forma de pagamento"
            name="paymentMethod"
            as="select"
            defaultValue="pix"
            opcoes={FORMAS_PAGAMENTO}
          />
          <PanelField label="Nome do comprador" name="buyerName" required />
          <PanelField
            label="E-mail do comprador"
            name="buyerEmail"
            type="email"
            required
            dica="O pedido precisa de um e-mail: é por onde o comprovante e o acompanhamento saem."
          />
          <PanelField label="Telefone" name="buyerPhone" />
          <PanelField label="CPF / CNPJ" name="buyerDocument" />
        </div>
      </div>

      {/* 3. O que já aconteceu */}
      <div className={styles.blocoForm}>
        <strong className={styles.tituloBloco}>Pagamento e retirada</strong>
        <p className={styles.notaPasso}>
          A venda de WhatsApp costuma chegar ao sistema já paga e já retirada. Marcar aqui evita
          repetir os mesmos passos na tela do pedido — e é o que permite concluir a operação e
          liberar o repasse.
        </p>
        <label className={styles.marcar}>
          <input
            type="checkbox"
            name="pago"
            checked={pago}
            onChange={(e) => setPago(e.target.checked)}
          />
          Pagamento já recebido
        </label>
        {pago && (
          <PanelField
            label="Comprovante / referência"
            name="paymentReference"
            placeholder="ID do PIX, número da transferência…"
          />
        )}
        <label className={styles.marcar}>
          <input
            type="checkbox"
            name="retirado"
            checked={retirado}
            onChange={(e) => setRetirado(e.target.checked)}
          />
          Produto já retirado
        </label>
        {retirado && <PanelField label="Local da retirada" name="pickupLocation" />}
        <PanelField
          label="Observações"
          name="notes"
          as="textarea"
          rows={2}
          className={styles.campoLargo}
          dica="Contexto da negociação. Fica registrado no pedido."
        />
      </div>

      <div className={styles.acoesBloco}>
        <PanelButton type="submit" variant="success" disabled={gravando || !ativo}>
          {gravando ? "Registrando…" : "Registrar venda"}
        </PanelButton>
      </div>
    </form>
  );
}
