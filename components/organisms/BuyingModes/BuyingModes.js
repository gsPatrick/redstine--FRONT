import Section from "@/components/atoms/Section/Section";
import SectionTitle from "@/components/atoms/SectionTitle/SectionTitle";
import Reveal from "@/components/atoms/Reveal/Reveal";
import Button from "@/components/atoms/Button/Button";
import { buyingModes } from "@/lib/shop";
import styles from "./BuyingModes.module.css";

export default function BuyingModes() {
  return (
    <Section tone="light">
      <SectionTitle title="Compra direta ou sob consulta" />

      <div className={styles.grid}>
        {buyingModes.map((mode, index) => (
          <Reveal key={mode.title} animation="fadeInUp" delay={index * 140}>
            <article className={styles.card}>
              <h3 className={styles.kicker}>{mode.title}</h3>
              <p className={styles.description}>{mode.description}</p>
              {mode.cta ? (
                <div className={styles.action}>
                  <Button href={mode.href} variant="dark" size="sm">
                    {mode.cta}
                  </Button>
                </div>
              ) : null}
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal animation="fadeInUp" delay={300}>
        <h2 className={styles.note}>FAZER ANCORA DOS CARDS PARA CATEGORIA NOVA</h2>
      </Reveal>
    </Section>
  );
}
