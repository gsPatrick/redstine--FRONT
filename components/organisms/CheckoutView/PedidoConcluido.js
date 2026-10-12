import Link from "next/link";
import Section from "@/components/atoms/Section/Section";
import Button from "@/components/atoms/Button/Button";
import Icon from "@/components/atoms/Icon/Icon";
import FaixaBeneficios from "@/components/molecules/FaixaBeneficios/FaixaBeneficios";
import styles from "./CheckoutView.module.css";

/**
 * Passo 2 de 2: pedido concluído.
 *
 * O descritivo é explícito em ter EXATAMENTE dois passos — "dados e forma de
 * pagamento" e "pedido concluído", sem passo intermediário de pagamento ou de
 * confirmação. Por isso esta tela não é uma rota própria: ela é o mesmo
 * endereço do checkout depois de o pedido existir. Uma rota `/pedido/[ref]`
 * seria acessível por recarregamento e por link, e o comprador que voltasse a
 * ela veria "pedido registrado" sem nada ter sido registrado.
 *
 * O que ela diz é o que é verdade hoje: o pedido foi REGISTRADO e está em
 * análise. Não há cobrança automática — a RED confirma disponibilidade, preço
 * e retirada antes de concluir. Prometer "pagamento aprovado" aqui seria
 * mentira enquanto o gateway não estiver ligado.
 */
/** Informações complementares, com os textos da seção 2.3 do PDF. */
const BENEFICIOS_DO_PEDIDO = [
  {
    icone: "headset",
    titulo: "Atendimento especializado",
    texto: "Tire suas dúvidas com a nossa equipe.",
  },
  { icone: "shield", titulo: "Compra segura", texto: "Seus dados estão protegidos." },
  {
    icone: "creditCard",
    titulo: "Diversas formas de pagamento",
    texto: "Pix, cartão de crédito e boleto bancário.",
  },
  {
    icone: "cube",
    titulo: "Produtos de qualidade",
    texto: "Equipamentos verificados e prontos para uso.",
  },
];

export default function PedidoConcluido({ pedido }) {
  const quando = pedido.criadoEm ? new Date(pedido.criadoEm) : new Date();
  const data = quando.toLocaleDateString("pt-BR");
  const hora = quando.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  return (
    <Section tone="light">
      <div className={styles.concluido}>
        <span className={styles.selo} aria-hidden="true">
          <Icon name="check" size={26} />
        </span>

        <h1 className={styles.concluidoTitulo}>Pedido registrado com sucesso!</h1>

        {/* Os dois textos são os do PDF. A tela confirma o REGISTRO e nada
            mais: não afirma que disponibilidade ou retirada já estão
            confirmadas, porque não estão. */}
        <p className={styles.concluidoTexto}>
          Seu pedido foi recebido e está em análise pela nossa equipe.
        </p>

        <p className={styles.concluidoTexto}>
          Em breve entraremos em contato para confirmar a disponibilidade, as condições
          comerciais e a retirada.
        </p>

        <div className={styles.avisoEmail}>
          <span className={styles.cartaoIcone} aria-hidden="true">
            <Icon name="clock" size={15} />
          </span>
          <p>
            Você vai receber um e-mail com os detalhes deste pedido. Verifique a caixa de
            entrada e também a de spam.
          </p>
        </div>

        <dl className={styles.dadosPedido}>
          <div>
            <dt>Número do pedido</dt>
            <dd className={styles.referencia}>{pedido.reference}</dd>
          </div>
          <div>
            <dt>Data e hora</dt>
            <dd>
              {data} às {hora}
            </dd>
          </div>
        </dl>

        <div className={styles.concluidoAcoes}>
          {/* Vermelho PREENCHIDO: o PDF pede "botão vermelho principal", e
              nesta tela ele é o único CTA de peso — o sólido por página que a
              seção 2 do PADROES autoriza. */}
          <Link href="/shop" className={styles.ctaPrincipal}>
            Continuar comprando
          </Link>
          <Button href="/painel" variant="outline">
            Minha conta
          </Button>
        </div>

        <p className={styles.concluidoAjuda}>
          Dúvidas sobre este pedido?{" "}
          <Link href="/contato">Fale com a nossa equipe</Link>.
        </p>
      </div>

      {/* Textos da seção 2.3 do PDF. */}
      <FaixaBeneficios className={styles.beneficios} itens={BENEFICIOS_DO_PEDIDO} />
    </Section>
  );
}
