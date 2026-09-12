import Reveal from "@/components/atoms/Reveal/Reveal";
import styles from "./SectionTitle.module.css";

/**
 * Título de seção.
 *
 * Dois padrões que o cliente pediu para unificar (item 30): o rótulo pequeno
 * em vermelho acima do título, e o alinhamento à esquerda.
 *
 * O rótulo (`kicker`) existia em dez componentes, cada um com o seu CSS —
 * mesma intenção escrita dez vezes, e por isso divergindo. Passa a morar aqui.
 *
 * `align` nasce em "start" porque a referência é a home, que o cliente
 * aprovou. Centralizar continua possível e é o certo em estado vazio, onde o
 * texto é a única coisa na tela e encostá-lo na borda parece defeito — por
 * isso essas telas passam `align="center"` explicitamente, em vez de herdar.
 */
export default function SectionTitle({
  title,
  subtitle,
  kicker,
  subtitleAs: SubTag = "p",
  align = "start",
  as: Tag = "h2",
  tone = "dark",
  className = "",
  children,
}) {
  return (
    <header className={`${styles.head} ${styles[align]} ${styles[tone]} ${className}`}>
      {kicker ? (
        <Reveal animation="fadeInUp" delay={250}>
          <span className={styles.kicker}>{kicker}</span>
        </Reveal>
      ) : null}
      <Reveal animation="fadeInUp" delay={250}>
        <Tag className={styles.title}>{title}</Tag>
      </Reveal>
      {subtitle ? (
        <Reveal animation="fadeInUp" delay={250}>
          <SubTag className={styles.subtitle}>{subtitle}</SubTag>
        </Reveal>
      ) : null}
      {children}
    </header>
  );
}
