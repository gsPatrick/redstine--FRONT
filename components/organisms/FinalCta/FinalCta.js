import Section from "@/components/atoms/Section/Section";
import Reveal from "@/components/atoms/Reveal/Reveal";
import Button from "@/components/atoms/Button/Button";
import styles from "./FinalCta.module.css";

export default function FinalCta() {
  return (
    <Section tone="tinted" innerClassName={styles.inner}>
      <div className={styles.panel}>
        <span className={styles.veil} aria-hidden="true" />

        <div className={styles.copy}>
          <Reveal animation="fadeInUp" delay={250} as="h2" className={styles.title}>
            Dê um novo destino aos seus ativos.
          </Reveal>
          <Reveal animation="fadeInUp" delay={250}>
            <p className={styles.text}>
              Compre ativos disponíveis ou envie materiais, equipamentos e mobiliário para
              avaliação.
            </p>
          </Reveal>
        </div>

        <Reveal animation="fadeInUp" delay={320} className={styles.actions}>
          <Button href="/shop" variant="solid">
            Explorar Ativos
          </Button>
          <Button href="/painel/vender/enviar" variant="ghost">
            Enviar Ativos
          </Button>
        </Reveal>
      </div>
    </Section>
  );
}
