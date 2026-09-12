import Link from "next/link";
import styles from "./Button.module.css";

/**
 * Botão do site.
 *
 * O cliente pediu um padrão (item 26): "precisamos definir um padrão (tamanho,
 * cor, se é vazado ou não) para botão CTA, outro (ou o mesmo) para destaque.
 * Percebi que usamos vários no site sem padronização."
 *
 * As cinco variantes que existem não eram o problema — elas cobrem duas
 * dimensões reais, e nenhuma sobra. O que faltava era a REGRA de quando usar
 * cada uma, e sem regra elas foram sendo escolhidas por gosto, página a
 * página. A regra é esta:
 *
 *                     | fundo claro        | fundo escuro ou imagem
 *   ------------------|--------------------|------------------------
 *   ação principal    | `dark`             | `solid`
 *   ação alternativa  | `outline`          | `ghost`
 *
 * E `accent` (vermelho cheio) é o destaque: o CTA de maior peso da página,
 * UM por página. Usar em dois tira o peso dos dois — se tudo grita, nada
 * grita. Foi o que aconteceu quando ele virou apenas "o botão vermelho".
 *
 * Tamanho: `lg` para CTA de banner e de fim de seção, `sm` para ação em linha
 * dentro de conteúdo. `md` fica sem emprego nesse padrão; existe só porque o
 * banner da home ainda o usa, e sai quando aquele bloco for padronizado.
 *
 * A escolha de par importa mais do que a variante isolada: principal e
 * alternativa lado a lado têm de vir do MESMO fundo, senão um dos dois some
 * ou berra.
 */
export default function Button({
  children,
  href,
  variant = "solid",
  size = "md",
  className = "",
  ...rest
}) {
  const cls = `${styles.button} ${styles[variant]} ${styles[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={cls} {...rest}>
        <span className={styles.label}>{children}</span>
      </Link>
    );
  }

  return (
    <button type="button" className={cls} {...rest}>
      <span className={styles.label}>{children}</span>
    </button>
  );
}
