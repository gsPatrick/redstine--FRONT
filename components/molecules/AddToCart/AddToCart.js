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
    <div className={styles.wrap}>
      {withQuantity ? (
        <div className={styles.quantidade}>
          <QuantidadeSeletor
            valor={quantity}
            minimo={minima}
            maximo={saldo && saldo > 0 ? saldo : null}
            aoMudar={setQuantity}
            styles={styles}
          />
          {minima > 1 ? (
            <p className={styles.minima}>
              Venda mínima: {minima} {product.unit || "unidade"}
              {minima > 1 ? "s" : ""}
            </p>
          ) : null}
        </div>
      ) : null}

      <button
        type="button"
        className={`${styles.button} ${styles[variant]} ${added ? styles.added : ""}`}
        onClick={submit}
        aria-live="polite"
      >
        <Icon name="cart" size={15} />
        {added ? "Adicionado ao carrinho" : "Adicionar ao carrinho"}
      </button>

      {comIrParaCarrinho ? (
        <button type="button" className={styles.irAgora} onClick={submitEIr}>
          Adicionar e ir ao carrinho
        </button>
      ) : null}
    </div>
  );
}
