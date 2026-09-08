import styles from "./ValueChip.module.css";

export default function ValueChip({ label, tone = "deep", shape = "left" }) {
  return (
    <div className={`${styles.chip} ${styles[tone]} ${styles[shape]}`}>
      <span className={styles.label}>{label}</span>
    </div>
  );
}
