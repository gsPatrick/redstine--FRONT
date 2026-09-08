import styles from "./Section.module.css";

export default function Section({
  children,
  tone = "light",
  size = "md",
  id,
  className = "",
  innerClassName = "",
}) {
  return (
    <section id={id} className={`${styles.section} ${styles[tone]} ${styles[size]} ${className}`}>
      <div className={`${styles.inner} ${innerClassName}`}>{children}</div>
    </section>
  );
}
