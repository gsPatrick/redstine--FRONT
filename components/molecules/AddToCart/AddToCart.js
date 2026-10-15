"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "@/components/atoms/Icon/Icon";
import QuantidadeSeletor, {
  minimaDe,
} from "@/components/molecules/QuantidadeSeletor/QuantidadeSeletor";
import { useStore } from "@/lib/StoreContext";
import styles from "./AddToCart.module.css";

/**
 * Adicionar ao carrinho.
 *
 * Duas ações, porque são duas intenções diferentes: quem está montando um
 * pedido de vários lotes quer continuar navegando, e quem já decidiu quer
 * fechar. Com um botão só, o segundo tinha de adicionar e depois procurar o
 * carrinho no cabeçalho.
 *
 * A confirmação ficava invisível: o estado "Adicionado" é verde, mas
 * `.dark:hover` é vermelho e tem especificidade maior — com o mouse ainda
 * sobre o botão, que é onde ele está logo após o clique, a cor da confirmação
 * perdia para a do hover. E ela sumia em 1,8s. O resultado é que o utilizador
 * clicava, nada parecia mudar, e ele clicava de novo (foi o que aconteceu: o
 * carrinho pulou de 1 para 3). Agora a confirmação vence o hover e dura mais.
 *
 * A quantidade começa na VENDA MÍNIMA do ativo e não desce dela — a regra vive
 * no `QuantidadeSeletor`, que é o mesmo seletor do carrinho.
 */
export default function AddToCart({
  product,
  withQuantity = false,
  variant = "dark",
  comIrParaCarrinho = false,
  aoLado = null,
}) {
  const { addToCart } = useStore();
  const router = useRouter();
  const minima = minimaDe(product);
  const saldo = Number.isFinite(Number(product.quantity)) ? Number(product.quantity) : null;
  const [quantity, setQuantity] = useState(minima);
  const [added, setAdded] = useState(false);
  const timer = useRef(null);

  // Sem isto, sair da página durante a confirmação deixa um setState pendente
  // sobre componente desmontado.
  useEffect(() => () => window.clearTimeout(timer.current), []);

  // O campo aceita vazio durante a digitação; o que vai ao carrinho nunca é.
  const efetiva = Math.max(minima, Number(quantity) || minima);

  const submit = () => {
    addToCart(product, efetiva);
    setAdded(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setAdded(false), 2600);
  };

  const submitEIr = () => {
    addToCart(product, efetiva);
    router.push("/cart");
  };

  return (
    <div className={`${styles.wrap} ${aoLado ? styles.wrapPainel : ""}`}>
      {withQuantity ? (
        <div className={styles.quantidade}>
          <QuantidadeSeletor
            valor={quantity}
            minimo={minima}
            maximo={saldo && saldo > 0 ? saldo : null}
            aoMudar={setQuantity}
            styles={styles}
          />
          {/* Abaixo do seletor, em texto pequeno: a quantidade disponível
              (descritivo, seção 9) e a venda mínima quando ela existe. */}
          {saldo > 0 ? (
            <p className={styles.minima}>
              {saldo} {product.unit || "unidade"}
              {saldo > 1 ? "s" : ""} {saldo > 1 ? "disponíveis" : "disponível"}
              {minima > 1 ? ` · mínimo ${minima}` : ""}
            </p>
          ) : minima > 1 ? (
            <p className={styles.minima}>Venda mínima: {minima}</p>
          ) : null}
        </div>
      ) : null}

      {/* Os dois CTAs lado a lado, em colunas iguais — é a diagramação do
          protótipo, e `aoLado` recebe o botão do WhatsApp porque a grade tem de
          ser de um componente só: em dois irmãos separados, as colunas ficavam
          com larguras diferentes. */}
      <div className={aoLado ? styles.dupla : styles.solo}>
        <button
          type="button"
          className={`${styles.button} ${styles[variant]} ${added ? styles.added : ""}`}
          onClick={submit}
          aria-live="polite"
        >
          <Icon name="cart" size={15} />
          {added ? "Adicionado ao carrinho" : "Adicionar ao carrinho"}
        </button>

        {aoLado}
      </div>

      {comIrParaCarrinho ? (
        <button type="button" className={styles.irAgora} onClick={submitEIr}>
          Adicionar e ir ao carrinho
        </button>
      ) : null}
    </div>
  );
}
