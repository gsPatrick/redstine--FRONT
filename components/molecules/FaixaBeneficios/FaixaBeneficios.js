import Icon from "@/components/atoms/Icon/Icon";
import styles from "./FaixaBeneficios.module.css";

/**
 * Faixa de benefícios.
 *
 * Aparece no carrinho, no checkout e na confirmação do pedido — os três
 * descritivos pedem a mesma faixa, e três cópias dela é como nasce a versão em
 * que um dos lugares promete algo que os outros dois não prometem.
 *
 * O conteúdo é o que a RED pode cumprir hoje: curadoria, atendimento e as
 * formas de pagamento. Nada de prazo de entrega — a retirada é combinada caso a
 * caso e o número não existe.
 */
const PADRAO = [
  {
    icone: "shield",
    titulo: "Compra segura",
    texto: "Ativos conferidos e pedido acompanhado pela equipe da RED.",
  },
  {
    icone: "headset",
    titulo: "Atendimento especializado",
    texto: "Equipe que conhece o ativo e as condições de retirada.",
  },
  {
    icone: "creditCard",
    titulo: "Diversas formas de pagamento",
    texto: "Pix, cartão de crédito ou boleto bancário.",
  },
  {
    icone: "cube",
    titulo: "Produtos de qualidade",
    texto: "Cada ativo passa pela curadoria antes de ir ao catálogo.",
  },
];

export default function FaixaBeneficios({ itens = PADRAO, className = "" }) {
  return (
    <ul className={`${styles.faixa} ${className}`}>
      {itens.map((item) => (
        <li key={item.titulo} className={styles.item}>
          <span className={styles.icone} aria-hidden="true">
            <Icon name={item.icone} size={17} />
          </span>
          <span className={styles.corpo}>
            <strong className={styles.titulo}>{item.titulo}</strong>
            <span className={styles.texto}>{item.texto}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
