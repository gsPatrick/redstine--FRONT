import { efficiency } from "@/lib/home";
import styles from "./Efficiency.module.css";

export default function Efficiency() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.head}>
          <span className={styles.kicker}>Ganhos</span>
          <h2 className={styles.title}>Mais eficiência em cada etapa da operação</h2>
        </div>

        <div className={styles.grid}>
          {efficiency.map((item, i) => (
            <article key={item.title} className={styles.card}>
              <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardText}>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
