"use client";

import { useState } from "react";
import Image from "next/image";
import Section from "@/components/atoms/Section/Section";
import SectionTitle from "@/components/atoms/SectionTitle/SectionTitle";
import Button from "@/components/atoms/Button/Button";
import Field from "@/components/molecules/Field/Field";
import { useStore } from "@/lib/StoreContext";
import { useSession } from "@/lib/auth/SessionContext";
import { post } from "@/lib/api";
import { formatPrice } from "@/lib/products";
import styles from "./CheckoutView.module.css";

const billing = [
  { label: "Nome", name: "nome", required: true },
  { label: "Sobrenome", name: "sobrenome", required: true },
  { label: "Empresa", name: "empresa" },
  { label: "CPF / CNPJ", name: "documento", required: true },
  { label: "E-mail", name: "email", type: "email", required: true },
  { label: "Telefone", name: "telefone", type: "tel", required: true },
  { label: "CEP", name: "cep", required: true },
  { label: "Cidade", name: "cidade", required: true },
  { label: "Endereço", name: "endereco", span: 2, required: true },
  { label: "Observações do pedido", name: "observacoes", type: "textarea", span: 2 },
];

const paymentMethods = [
  { id: "pix", label: "Pix", note: "Chave enviada após a confirmação do pedido." },
  { id: "boleto", label: "Boleto bancário", note: "Vencimento em 2 dias úteis." },
  { id: "consulta", label: "Sob consulta", note: "Condições definidas na negociação." },
];

export default function CheckoutView() {
  const { cart, cartTotal, clearCart, ready } = useStore();
  const { autenticado } = useSession();
  const [method, setMethod] = useState("pix");
  const [placed, setPlaced] = useState(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fecha o pedido na API.
   *
   * Antes esta função inventava uma referência com o relógio do navegador e
   * limpava o carrinho — o pedido não existia em lugar nenhum. Agora quem
   * gera a referência, valida a disponibilidade e baixa o estoque é o
   * servidor, e a referência exibida é a real.
   *
   * O carrinho só é limpo depois do sucesso: se a API recusar, o comprador
   * mantém tudo e pode corrigir.
   */
  const submit = async (event) => {
    event.preventDefault();
    setError(null);
    setSending(true);

    const d = new FormData(event.currentTarget);
    const endereco = [d.get("endereco"), d.get("cidade"), d.get("cep")]
      .filter(Boolean)
      .join(" — ");

    try {
      const pedido = await post("/orders", {
        buyerName: [d.get("nome"), d.get("sobrenome")].filter(Boolean).join(" "),
        buyerEmail: d.get("email"),
        buyerPhone: d.get("telefone"),
        buyerDocument: d.get("documento") || undefined,
        paymentMethod: method,
        notes: d.get("observacoes") || undefined,
        billing: {
          empresa: d.get("empresa") || null,
          cep: d.get("cep") || null,
          cidade: d.get("cidade") || null,
          endereco: endereco || null,
        },
        items: cart.map((line) => ({ assetId: line.id, quantity: line.quantity })),
      });

      setPlaced({
        reference: pedido.reference,
        total: Number(pedido.total),
        items: cart.length,
      });
      clearCart();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      setError(mensagemDeErro(e));
    } finally {
      setSending(false);
    }
  };

  if (placed) {
    return (
      <Section tone="light">
        <SectionTitle
          title="Pedido registrado"
          subtitle={`Sua solicitação ${placed.reference} foi registrada. A RED confirmará disponibilidade, condições comerciais e retirada antes da conclusão.`}
        />
        <div className={styles.confirmActions}>
          <Button href="/shop" variant="dark">
            Continuar comprando
          </Button>
          <Button href="/painel" variant="outline">
            Minha conta
          </Button>
        </div>
      </Section>
    );
  }

  if (!ready) {
    return (
      <Section tone="light">
        <p className={styles.loading}>Carregando…</p>
      </Section>
    );
  }

  if (!cart.length) {
    return (
      <Section tone="light">
        <SectionTitle title="Não há itens para finalizar" />
        <div className={styles.confirmActions}>
          <Button href="/shop" variant="dark">
            Explorar Ativos
          </Button>
        </div>
      </Section>
    );
  }

  return (
    <Section tone="light">
      <SectionTitle title="Finalizar compra" align="start" />

      <form className={styles.layout} onSubmit={submit}>
        <div className={styles.main}>
          <fieldset className={styles.block}>
            <legend className={styles.legend}>Dados de faturamento</legend>
            <div className={styles.grid}>
              {billing.map((field) => (
                <Field key={field.name} {...field} />
              ))}
            </div>
          </fieldset>

          <fieldset className={styles.block}>
            <legend className={styles.legend}>Forma de pagamento</legend>
            <ul className={styles.methods}>
              {paymentMethods.map((option) => (
                <li key={option.id}>
                  <label
                    className={`${styles.method} ${method === option.id ? styles.methodActive : ""}`}
                  >
                    <input
                      type="radio"
                      name="pagamento"
                      value={option.id}
                      checked={method === option.id}
                      onChange={() => setMethod(option.id)}
                      className={styles.radioInput}
                    />
                    <span className={styles.radio} aria-hidden="true" />
                    <span className={styles.methodBody}>
                      <span className={styles.methodLabel}>{option.label}</span>
                      <span className={styles.methodNote}>{option.note}</span>
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </fieldset>
        </div>

        <aside className={styles.summary}>
          <h3 className={styles.summaryTitle}>Seu pedido</h3>

          <ul className={styles.lines}>
            {cart.map((line) => (
              <li key={line.id} className={styles.line}>
                {line.image ? (
                  <Image
                    src={line.image}
                    alt=""
                    width={56}
                    height={56}
                    className={styles.thumb}
                  />
                ) : null}
                <span className={styles.lineName}>
                  {line.name}
                  <span className={styles.lineQty}>× {line.quantity}</span>
                </span>
                <span className={styles.linePrice}>
                  {formatPrice(line.price * line.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <div className={styles.total}>
            <span>Total</span>
            <strong>{formatPrice(cartTotal)}</strong>
          </div>

          <p className={styles.note}>
            O envio do pedido não caracteriza reserva automática. Disponibilidade e condições são
            validadas pela RED.
          </p>

          {error ? (
            <p className={styles.error} role="alert">
              {error}
            </p>
          ) : null}

          <button type="submit" className={styles.submit} disabled={sending || !cart.length}>
            {sending ? "Enviando…" : "Enviar pedido"}
          </button>
        </aside>
      </form>
    </Section>
  );
}

/**
 * Erros que o comprador precisa entender.
 *
 * "ASSET_UNAVAILABLE" e "INSUFFICIENT_QUANTITY" acontecem quando alguém comprou
 * antes — é uma corrida real num acervo de peça única, e a mensagem tem de
 * dizer o que fazer, não repetir o código do servidor.
 */
function mensagemDeErro(e) {
  const porCodigo = {
    ASSET_UNAVAILABLE:
      "Um dos ativos do seu carrinho deixou de estar disponível. Revise o carrinho e tente de novo.",
    INSUFFICIENT_QUANTITY:
      "A quantidade pedida é maior do que a disponível para um dos ativos. Ajuste a quantidade e tente de novo.",
    ASSET_NOT_FOUND: "Um dos ativos do seu carrinho não existe mais. Remova-o e tente de novo.",
    VALIDATION_ERROR: e.details?.[0]?.motivo || "Revise os campos destacados.",
  };
  return (
    porCodigo[e.code] ||
    e.message ||
    "Não foi possível registrar o pedido agora. Tente novamente em instantes."
  );
}
