import Button from "@/components/atoms/Button/Button";
import { priceClaim } from "@/lib/home";
import styles from "./PriceClaim.module.css";

export default function PriceClaim() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.copy}>
          <span className={styles.kicker}>{priceClaim.kicker}</span>

          <p className={styles.statement}>
            <span className={styles.lead}>{priceClaim.lead}</span>
            <span className={styles.line}>
              <span className={styles.figure}>{priceClaim.figure}</span>
              <span className={styles.trail}>{priceClaim.trail}</span>
            </span>
          </p>
        </div>

        <div className={styles.aside}>
          <p className={styles.support}>{priceClaim.support}</p>
          {/* Painel escuro: o vazado vermelho do padrão reprova em contraste
              aqui, então o CTA é o `solid` (branco cheio) do fundo escuro.
              `lg` porque é CTA de banner. */}
          <Button href={priceClaim.cta.href} variant="solid" size="lg">
            {priceClaim.cta.label}
          </Button>
        </div>
      </div>
    </section>
  );
}
