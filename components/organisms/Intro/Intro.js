import { introText, introHighlights } from "@/lib/home";
import styles from "./Intro.module.css";

export default function Intro() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <span className={styles.kicker}>A operação</span>

        <div className={styles.columns}>
          <p className={styles.text}>{introText}</p>

          <ul className={styles.list}>
            {introHighlights.map((item) => (
              <li key={item} className={styles.item}>
                {/* Marca de verificação em vez de só uma linha divisória: eram
                    três frases soltas com o mesmo peso do parágrafo ao lado, e
                    não liam como destaque. */}
                <span className={styles.check} aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M20 6L9 17l-5-5"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
