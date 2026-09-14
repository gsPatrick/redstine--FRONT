"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "@/components/atoms/Icon/Icon";
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
 */
export default function AddToCart({
  product,
  withQuantity = false,
  variant = "dark",
  comIrParaCarrinho = false,
}) {
  const { addToCart } = useStore();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const timer = useRef(null);

  // Sem isto, sair da página durante a confirmação deixa um setState pendente
  // sobre componente desmontado.
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const submit = () => {
    addToCart(product, quantity);
    setAdded(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setAdded(false), 2600);
  };

  const submitEIr = () => {
    addToCart(product, quantity);
    router.push("/cart");
  };

  return (
    <div className={styles.wrap}>
      {withQuantity ? (
        <div className={styles.stepper}>
          <button
            type="button"
            className={styles.step}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Diminuir quantidade"
          >
            −
          </button>
          <input
            type="number"
            min="1"
            className={styles.quantity}
            value={quantity}
            onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
            aria-label="Quantidade"
          />
          <button
            type="button"
            className={styles.step}
            onClick={() => setQuantity((q) => q + 1)}
            aria-label="Aumentar quantidade"
          >
            +
          </button>
        </div>
      ) : null}

      <button
        type="button"
        className={`${styles.button} ${styles[variant]} ${added ? styles.added : ""}`}
        onClick={submit}
        aria-live="polite"
      >
        <Icon name="cart" size={15} />
        {added ? "Adicionado ao carrinho" : "Adicionar"}
      </button>

      {comIrParaCarrinho ? (
        <button type="button" className={styles.irAgora} onClick={submitEIr}>
          Adicionar e ir ao carrinho
        </button>
      ) : null}
    </div>
  );
}
