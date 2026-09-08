"use client";

import { useState } from "react";
import Icon from "@/components/atoms/Icon/Icon";
import { useStore } from "@/lib/StoreContext";
import styles from "./AddToCart.module.css";

export default function AddToCart({ product, withQuantity = false, variant = "dark" }) {
  const { addToCart } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const submit = () => {
    addToCart(product, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
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
      >
        <Icon name="cart" size={15} />
        {added ? "Adicionado" : "Adicionar"}
      </button>
    </div>
  );
}
