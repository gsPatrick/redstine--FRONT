import Button from "@/components/atoms/Button/Button";
import { processSteps } from "@/lib/home";
import styles from "./Process.module.css";

export default function Process() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.head}>
          <span className={styles.kicker}>Processo</span>
          <h2 className={styles.title}>Um processo estruturado do envio ao resultado.</h2>
        </div>

        <ol className={styles.steps}>
          {processSteps.map((step, i) => (
            <li key={step.title} className={styles.step}>
              <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepText}>{step.description}</p>
            </li>
          ))}
        </ol>

        <div className={styles.action}>
          <Button href="/como-funciona" variant="accent">
            Entenda o Processo
          </Button>
        </div>
      </div>
    </section>
  );
}
