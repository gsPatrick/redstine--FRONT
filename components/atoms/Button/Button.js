import Link from "next/link";
import styles from "./Button.module.css";

/**
 * Botão do site.
 *
 * PADRÃO VIGENTE — seção 2 do PADROES.md. Citação do cliente:
 * "eu particularmente gosto de botão vazado (só as linhas, outline e cta
 * interno) e não gosto de botão preto, mas agora como faz parte da cor da
 * marca, pode ser que faça mais sentido; de qualquer forma vazado e vermelho é
 * a minha preferência".
 *
 * Em uma frase: o padrão do site é VAZADO VERMELHO. O preto sai de cena como
 * padrão e fica para a ação secundária. Sólido preenchido é exceção.
 *
 * MAPA DE VARIANTES
 * -----------------
 * Os nomes são legados (há dezenas de chamadas espalhadas) — o que mudou foi o
 * que cada nome PINTA. Ler a coluna "papel", nunca o nome.
 *
 *   variante   | papel                        | fundo  | pinta
 *   -----------|------------------------------|--------|--------------------------
 *   `dark`     | PRIMÁRIO (padrão do site)    | claro  | vazado vermelho
 *   `accent`   | primário, idem `dark`        | claro  | vazado vermelho
 *   `outline`  | secundário                   | claro  | vazado neutro (preto)
 *   `ghost`    | secundário sobre imagem      | escuro | vazado branco
 *   `solid`    | principal sobre imagem       | escuro | branco preenchido
 *
 * `dark` e `accent` pintam igual de propósito: as duas eram "o botão primário"
 * em metades diferentes do site (uma preta, outra vermelha cheia) e agora
 * convergem no vazado vermelho que o cliente escolheu. Unificar os dois nomes
 * em um só exigiria editar as dezenas de chamadas; o padrão vale de qualquer
 * modo, e uma renomeação em massa pode vir depois sem mudar nada visualmente.
 *
 * CONTRASTE — os dois fundos têm requisitos OPOSTOS
 * ------------------------------------------------
 * O vermelho da marca (`--color-accent`, #c40404) sobre BRANCO dá 5,7:1, acima
 * do mínimo AA de 4,5:1 para texto e de 3:1 para a borda. Sobre o preto do
 * site (#1a1b1b) o MESMO vermelho cai para 2,7:1 e reprova nos dois critérios —
 * vermelho escuro e preto estão quase na mesma luminância.
 *
 * Por isso vazado vermelho é proibido sobre fundo escuro ou foto: lá o vazado
 * é BRANCO (`ghost`, ~17:1), e o preenchido é branco com texto preto
 * (`solid`). Quem usa `dark`/`accent` dentro de um painel escuro está com o
 * botão ilegível, não com um botão fora do padrão.
 *
 * SÓLIDO PREENCHIDO
 * -----------------
 * Reservado ao CTA de maior peso da página — um por página. Sobre fundo escuro
 * é `solid`. Não existe variante de vermelho cheio sobre fundo claro neste
 * padrão: o cliente prefere o vazado, e um vermelho cheio ao lado de um vazado
 * vermelho lê como dois primários.
 *
 * TAMANHO
 * -------
 * `lg` em banner e fim de seção, `sm` em ação dentro de conteúdo (seção 2 do
 * PADROES.md). `md` é o default histórico e equivale ao tamanho base.
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
