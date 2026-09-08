import Button from "@/components/atoms/Button/Button";
import { participation } from "@/lib/home";
import styles from "./Participation.module.css";

export default function Participation() {
  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <span className={styles.kicker}>Participe</span>
        <h2 className={styles.title}>Como participar da RED</h2>
      </div>

      <div className={styles.panels}>
        {participation.map((card, i) => (
          <article
            key={card.kicker}
            className={styles.panel}
            style={{ backgroundImage: `url(${card.image})` }}
          >
            <span className={styles.veil} aria-hidden="true" />

            <div className={styles.body}>
              <span className={styles.index}>{String(i + 1).padStart(2, "0")}.</span>
              <h3 className={styles.panelTitle}>{card.kicker}</h3>
              <p className={styles.text}>{card.description}</p>
              <div className={styles.action}>
                <Button href={card.href} variant="solid" size="sm">
                  {card.cta}
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
