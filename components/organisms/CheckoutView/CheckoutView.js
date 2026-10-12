"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Section from "@/components/atoms/Section/Section";
import SectionTitle from "@/components/atoms/SectionTitle/SectionTitle";
import Button from "@/components/atoms/Button/Button";
import Icon from "@/components/atoms/Icon/Icon";
import Field from "@/components/molecules/Field/Field";
import PedidoConcluido from "./PedidoConcluido";
import { useStore } from "@/lib/StoreContext";
import { post } from "@/lib/api";
import { formatPrice } from "@/lib/products";
import styles from "./CheckoutView.module.css";

/**
 * Finalizar compra — DOIS passos, e só dois.
 *
 * O descritivo é explícito: "dados e forma de pagamento" e "pedido concluído",
 * sem passo intermediário de pagamento nem de confirmação. A razão é do
 * negócio, não de interface: a RED não cobra no ato. O pedido entra em análise,
 * a equipe confirma disponibilidade, preço e retirada, e só então se paga. Um
 * passo de pagamento no meio prometeria uma cobrança que não acontece.
 *
 * Por isso o passo 2 vive aqui dentro, no mesmo endereço, e não numa rota
 * própria: uma rota de confirmação seria recarregável e linkável, e mostraria
 * "pedido registrado" a quem não registrou nada.
 *
 * Campos: o documento separa obrigatórios de opcionais e a separação é
 * respeitada no `required` de cada um. Inscrição estadual é opcional porque
 * pessoa física não tem, e empresa é opcional porque metade dos compradores é
 * pessoa física — exigir qualquer um dos dois barraria o comprador certo.
 */

/** Bloco 1 — quem compra. */
const dadosDoComprador = [
  { label: "Nome completo", name: "nome", required: true, span: 2 },
  { label: "CPF / CNPJ", name: "documento", required: true },
  { label: "E-mail", name: "email", type: "email", required: true },
  {
    label: "Telefone / WhatsApp",
    name: "telefone",
    type: "tel",
    required: true,
    // O PDF pede indicação visual do WhatsApp: é por ali que a RED confirma o
    // pedido, e o comprador precisa de saber que o número será usado para isso.
    dica: "É por este número que a nossa equipe entra em contato no WhatsApp.",
  },
  { label: "Empresa", name: "empresa" },
  { label: "Inscrição estadual", name: "inscricaoEstadual" },
];

/** Bloco 1 — endereço de cobrança. */
const enderecoDeCobranca = [
  { label: "CEP", name: "cep", required: true },
  { label: "Cidade", name: "cidade", required: true },
  { label: "Estado", name: "estado", required: true },
  { label: "Endereço", name: "endereco", required: true, span: 2 },
  { label: "Bairro", name: "bairro", required: true },
  { label: "Observações do pedido", name: "observacoes", type: "textarea", span: 3 },
];

/**
 * Formas de PAGAMENTO — não modalidades de compra.
 *
 * "Sob consulta" estava listado aqui e saiu: é a modalidade em que o preço
 * ainda não existe, e portanto não há o que pagar. Misturar as duas coisas
 * deixava o comprador escolher "sob consulta" como se fosse meio de pagamento
 * e seguir para um pedido sem valor fechado.
 *
 * O Pix vem marcado e rotulado como recomendado, como o descritivo pede. A nota
 * de cada um diz QUANDO a cobrança chega, porque nenhuma delas é imediata: a
 * RED confirma o pedido antes de cobrar.
 */
const paymentMethods = [
  {
    id: "pix",
    label: "Pix",
    nota: "A chave é enviada depois da confirmação do pedido pela equipe.",
    recomendado: true,
  },
  {
    id: "cartao",
    label: "Cartão de crédito",
    nota: "Por maquininha ou link de pagamento, enviado depois da confirmação do pedido.",
  },
  {
    id: "boleto",
    label: "Boleto bancário",
    nota: "Emitido depois da confirmação, com vencimento em 2 dias úteis.",
  },
];

export default function CheckoutView() {
  const { cart, cartTotal, clearCart, ready } = useStore();
  // Defesa de borda: o ativo sob consulta nao chega mais ao carrinho pela
  // pagina do produto, mas carrinhos gravados antes disso podem ter um. Deixar
  // seguir geraria pedido com preco que nao foi negociado.
  const sobConsulta = cart.filter((l) => l.underConsultation);
  const totalItens = cart.reduce((n, l) => n + l.quantity, 0);
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

    try {
      const pedido = await post("/orders", {
        buyerName: d.get("nome"),
        buyerEmail: d.get("email"),
        buyerPhone: d.get("telefone"),
        buyerDocument: d.get("documento") || undefined,
        paymentMethod: method,
        notes: d.get("observacoes") || undefined,
        // O endereço vai estruturado, campo por campo: concatenado numa string
        // só, a gestão não conseguia separar cidade de bairro para combinar a
        // retirada.
        billing: {
          empresa: d.get("empresa") || null,
          inscricaoEstadual: d.get("inscricaoEstadual") || null,
          cep: d.get("cep") || null,
          cidade: d.get("cidade") || null,
          estado: d.get("estado") || null,
          bairro: d.get("bairro") || null,
          endereco: d.get("endereco") || null,
        },
        items: cart.map((line) => ({ assetId: line.id, quantity: line.quantity })),
      });

      setPlaced({
        reference: pedido.reference,
        criadoEm: pedido.createdAt || null,
        total: Number(pedido.total),
      });
      clearCart();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      setError(mensagemDeErro(e));
    } finally {
      setSending(false);
    }
  };

  // Passo 2 de 2.
  if (placed) return <PedidoConcluido pedido={placed} />;

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
        {/* Estado vazio: o texto e a unica coisa na tela, e encosta-lo na
            borda parece defeito. Centralizar aqui e deliberado. */}
        <SectionTitle title="Não há itens para finalizar" align="center" />
        <div className={styles.confirmActions}>
          <Button href="/shop" variant="dark">
            Começar a comprar
          </Button>
        </div>
      </Section>
    );
  }

  return (
    <Section tone="light">
      <SectionTitle
        title="Finalizar compra"
        subtitle="Preencha seus dados para concluir o pedido."
        align="start"
      />

      {/* Dois passos, mostrados como dois. O comprador vê onde está e que não
          existe uma etapa escondida de pagamento adiante. */}
      <ol className={styles.passos}>
        <li className={`${styles.passo} ${styles.passoAtivo}`}>
          <span className={styles.passoNumero}>1</span>
          Dados e forma de pagamento
        </li>
        <li className={styles.passo}>
          <span className={styles.passoNumero}>2</span>
          Pedido concluído
        </li>
      </ol>

      <form className={styles.layout} onSubmit={submit}>
        <div className={styles.main}>
          {/* UM bloco, como o PDF organiza: dados do comprador e, dentro do
              mesmo bloco, o endereço para faturamento como subtítulo interno.
              Dois cards separados davam ao endereço o mesmo peso dos dados, e
              o documento o trata como subdivisão. */}
          <fieldset className={styles.block}>
            <legend className={styles.legend}>1. Dados do comprador</legend>
            <div className={styles.grid}>
              {dadosDoComprador.map((field) => (
                <Field key={field.name} {...field} />
              ))}
            </div>

            <h3 className={styles.subtitulo}>Endereço para faturamento</h3>
            <div className={styles.grid}>
              {enderecoDeCobranca.map((field) => (
                <Field key={field.name} {...field} />
              ))}
            </div>
          </fieldset>

          <fieldset className={styles.block}>
            <legend className={styles.legend}>2. Forma de pagamento</legend>
            <p className={styles.apoioBloco}>
              Escolha a melhor forma de pagamento para o seu pedido.
            </p>
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
                      <span className={styles.methodLabel}>
                        {option.label}
                        {option.recomendado ? (
                          <span className={styles.recomendado}>Recomendado</span>
                        ) : null}
                      </span>
                      <span className={styles.methodNote}>{option.nota}</span>
                    </span>
                  </label>
                </li>
              ))}
            </ul>

            {/* Aceite obrigatório, pedido no descritivo. É `required` do próprio
                input: a validação do navegador já impede o envio e não há razão
                para duplicar a regra em JavaScript. */}
            <label className={styles.termos}>
              <input type="checkbox" name="termos" required className={styles.checkbox} />
              <span>
                Li e aceito os{" "}
                <Link href="/termos-de-uso">termos de uso</Link> e a{" "}
                <Link href="/politica-de-privacidade">política de privacidade</Link>, e entendo
                que o pedido passa por análise da RED antes da conclusão.
              </span>
            </label>

            <Link href="/cart" className={styles.voltar}>
              ← Voltar para o carrinho
            </Link>
          </fieldset>
        </div>

        <aside className={styles.summary}>
          <header className={styles.summaryTopo}>
            <h2 className={styles.summaryTitle}>Resumo do pedido</h2>
            <Link href="/cart" className={styles.editar}>
              Editar carrinho
            </Link>
          </header>

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
                <span className={styles.lineBody}>
                  <span className={styles.lineName}>{line.name}</span>
                  {line.sku ? <span className={styles.lineSku}>Código: {line.sku}</span> : null}
                  <span className={styles.lineQty}>Quantidade: {line.quantity}</span>
                </span>
                <span className={styles.linePrice}>
                  {formatPrice(line.price * line.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <dl className={styles.rows}>
            <div className={styles.row}>
              <dt>
                Subtotal ({totalItens} {totalItens === 1 ? "item" : "itens"})
              </dt>
              <dd>{formatPrice(cartTotal)}</dd>
            </div>
            <div className={styles.row}>
              <dt>Retirada</dt>
              <dd className={styles.muted}>A combinar</dd>
            </div>
          </dl>

          <div className={styles.total}>
            <span>Total</span>
            <strong>{formatPrice(cartTotal)}</strong>
          </div>

          {error ? (
            <p className={styles.error} role="alert">
              {error}
            </p>
          ) : null}

          {sobConsulta.length > 0 && (
            <p className={styles.bloqueio} role="alert">
              {sobConsulta.length === 1
                ? `"${sobConsulta[0].name}" é negociado sob consulta e não pode ser comprado direto.`
                : `${sobConsulta.length} itens do carrinho são negociados sob consulta e não podem ser comprados direto.`}{" "}
              Remova do carrinho e use <strong>Faça sua consulta</strong> na página do ativo.
            </p>
          )}

          {/*
            O CTA mais forte da página, e o único preenchido nela.

            O padrão do cliente reserva o sólido ao CTA de maior peso, um por
            página (PADROES.md, seção 2) — aqui ele é este. Vazado vermelho ao
            lado de "Editar carrinho" e "Voltar para o carrinho" não se
            distinguia do resto, e esta é a tela em que a ação principal tem de
            ser inequívoca.
          */}
          <button
            type="submit"
            className={styles.submit}
            disabled={sending || !cart.length || sobConsulta.length > 0}
          >
            {sending ? "Enviando…" : "Confirmar pedido"}
          </button>

          <p className={styles.note}>
            O envio do pedido não caracteriza reserva automática. Disponibilidade e condições são
            validadas pela RED.
          </p>

          <CartaoInfo icone="truck" titulo="Retirada e transporte">
            A retirada, o carregamento e o transporte são de responsabilidade do comprador e
            devem ser combinados com a nossa equipe após a conclusão.
          </CartaoInfo>

          <CartaoInfo icone="shield" titulo="Compra segura">
            Seus dados são protegidos e o pedido é confirmado pela nossa equipe antes da
            retirada.
          </CartaoInfo>

          <CartaoInfo icone="headset" titulo="Precisa de ajuda?">
            Fale com a nossa equipe antes de confirmar. Respondemos pelo WhatsApp em horário
            comercial.
            <a
              href="https://wa.me/5521997469757"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.whatsapp}
            >
              <Icon name="whatsapp" size={15} />
              Falar no WhatsApp
            </a>
          </CartaoInfo>

          <CartaoInfo icone="headset" titulo="Atendimento especializado">
            Tire suas dúvidas com a nossa equipe.
          </CartaoInfo>

          <CartaoInfo icone="creditCard" titulo="Diversas formas de pagamento">
            Pix, cartão de crédito e boleto bancário.
          </CartaoInfo>

          <CartaoInfo icone="cube" titulo="Produtos de qualidade">
            Equipamentos verificados pela curadoria e prontos para uso.
          </CartaoInfo>
        </aside>
      </form>
    </Section>
  );
}

/** Cartão informativo da coluna da direita — seis deles, todos no mesmo molde. */
function CartaoInfo({ icone, titulo, children }) {
  return (
    <div className={styles.cartaoInfo}>
      <span className={styles.cartaoIcone} aria-hidden="true">
        <Icon name={icone} size={15} />
      </span>
      <div>
        <strong>{titulo}</strong>
        <p>{children}</p>
      </div>
    </div>
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
    // Acontece com carrinho antigo: a linha foi gravada antes de a venda
    // mínima do ativo subir.
    BELOW_MIN_ORDER:
      e.message ||
      "Um dos ativos tem venda mínima maior do que a quantidade no carrinho. Ajuste a quantidade e tente de novo.",
    VALIDATION_ERROR: e.details?.[0]?.motivo || "Revise os campos destacados.",
  };
  return (
    porCodigo[e.code] ||
    e.message ||
    "Não foi possível registrar o pedido agora. Tente novamente em instantes."
  );
}
