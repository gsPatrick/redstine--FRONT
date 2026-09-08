import Reveal from "@/components/atoms/Reveal/Reveal";
import styles from "./SectionTitle.module.css";

export default function SectionTitle({
  title,
  subtitle,
  subtitleAs: SubTag = "p",
  align = "center",
  as: Tag = "h2",
  tone = "dark",
  className = "",
  children,
}) {
  return (
    <header className={`${styles.head} ${styles[align]} ${styles[tone]} ${className}`}>
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
