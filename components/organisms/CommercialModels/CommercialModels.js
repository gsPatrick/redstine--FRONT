import Button from "@/components/atoms/Button/Button";
import { commercialModels } from "@/lib/home";
import styles from "./CommercialModels.module.css";

export default function CommercialModels() {
  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <span className={styles.kicker}>Modelos comerciais</span>
        <h2 className={styles.title}>
          Dois modelos.
          <br />
          A mesma gestão comercial
        </h2>
      </div>

      <div className={styles.panels}>
        {commercialModels.map((model, i) => (
          <article
            key={model.title}
            className={styles.panel}
            style={{ backgroundImage: `url(${model.image})` }}
          >
            <span className={styles.veil} aria-hidden="true" />

            <div className={styles.body}>
              <span className={styles.index}>{String(i + 1).padStart(2, "0")}.</span>
              <h3 className={styles.panelTitle}>{model.title}</h3>
              <p className={styles.text}>{model.description}</p>
              <div className={styles.action}>
                <Button href={model.href} variant="solid" size="sm">
                  {model.cta}
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
