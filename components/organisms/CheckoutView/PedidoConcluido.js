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

        <p className={styles.concluidoTexto}>
          Seu pedido está em análise pela equipe da RED. Confirmamos a disponibilidade, as
          condições comerciais e a retirada antes da conclusão da compra.
        </p>

        <p className={styles.concluidoTexto}>
          O próximo passo é nosso: entramos em contato pelo e-mail e pelo telefone informados
          para alinhar o pagamento e a retirada do ativo.
        </p>

        <div className={styles.avisoEmail}>
          <span className={styles.cartaoIcone} aria-hidden="true">
            <Icon name="clock" size={15} />
          </span>
          <p>
            Você vai receber um e-mail com o resumo deste pedido. Se ele não chegar em alguns
            minutos, verifique a caixa de spam.
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
          {/* `dark` é o vazado VERMELHO (ver o mapa de variantes do Button):
              fundo claro não leva vermelho cheio no padrão do cliente, e o
              sólido da página já foi gasto no "Confirmar pedido" do passo 1. */}
          <Button href="/shop" variant="dark">
            Continuar comprando
          </Button>
          <Button href="/painel" variant="outline">
            Minha conta
          </Button>
        </div>

        <p className={styles.concluidoAjuda}>
          Dúvidas sobre este pedido?{" "}
          <Link href="/contato">Fale com a nossa equipe</Link>.
        </p>
      </div>

      <FaixaBeneficios className={styles.beneficios} />
    </Section>
  );
}
