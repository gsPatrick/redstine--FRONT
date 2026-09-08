"use client";

import Icon from "@/components/atoms/Icon/Icon";
import { useStore } from "@/lib/StoreContext";
import styles from "./WishButton.module.css";

export default function WishButton({ product, size = 18, floating = false }) {
  const { isWished, toggleWishlist } = useStore();
  const active = isWished(product.id);

  return (
    <button
      type="button"
      className={`${styles.button} ${floating ? styles.floating : ""} ${active ? styles.active : ""}`}
      onClick={() => toggleWishlist(product)}
      aria-pressed={active}
      aria-label={active ? "Remover dos favoritos" : "Adicionar aos favoritos"}
    >
      <Icon name="heart" size={size} />
    </button>
  );
}
