import Link from "next/link";
import styles from "./PanelLogo.module.css";

/**
 * Marca do painel, em texto.
 *
 * O logo do site e um JPG de fundo branco: no tema escuro ele vira uma caixa
 * branca no canto da barra. Redesenhar a assinatura em texto resolve isso, fica
 * nitido em qualquer densidade de ecra e herda a cor do tema — "RED" no
 * vermelho da marca, "estine" na cor de texto do ambiente.
 */
export default function PanelLogo({ className = "" }) {
  return (
    <Link href="/" className={`${styles.logo} ${className}`} aria-label="RED — página inicial">
      <span className={styles.red}>RED</span>
      <span className={styles.estine}>estine</span>
    </Link>
  );
}
