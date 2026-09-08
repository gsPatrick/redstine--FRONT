import Section from "@/components/atoms/Section/Section";
import SectionTitle from "@/components/atoms/SectionTitle/SectionTitle";
import Reveal from "@/components/atoms/Reveal/Reveal";
import Button from "@/components/atoms/Button/Button";
import AnimatedHeadline from "@/components/molecules/AnimatedHeadline/AnimatedHeadline";
import { audiences } from "@/lib/home";
import styles from "./Audiences.module.css";

export default function Audiences() {
  return (
    <Section tone="tinted" innerClassName={styles.inner}>
      <Reveal animation="fadeInUp" delay={250}>
        <h2 className={styles.note}>aqui acho valido 2 banners</h2>
      </Reveal>

      <SectionTitle title="Quem participa da RED" className={styles.head} />

      <div className={styles.rows}>
        {audiences.map((audience, index) => (
          <Reveal key={audience.prefix} animation="fadeInUp" delay={index * 140}>
            <AnimatedHeadline prefix={audience.prefix} words={audience.words} />
          </Reveal>
        ))}
      </div>

      <Reveal animation="fadeInUp" delay={320} className={styles.action}>
        <Button href="/vender" variant="dark">
          Enviar Ativos
        </Button>
      </Reveal>
    </Section>
  );
}
