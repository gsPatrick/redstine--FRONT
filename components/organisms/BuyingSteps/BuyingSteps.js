import Section from "@/components/atoms/Section/Section";
import SectionTitle from "@/components/atoms/SectionTitle/SectionTitle";
import Reveal from "@/components/atoms/Reveal/Reveal";
import Button from "@/components/atoms/Button/Button";
import FeatureCard from "@/components/molecules/FeatureCard/FeatureCard";
import { buyingSteps } from "@/lib/shop";
import styles from "./BuyingSteps.module.css";

export default function BuyingSteps() {
  return (
    <Section tone="tinted" id="funciona">
      <Reveal animation="fadeInUp" delay={250}>
        <h2 className={styles.note}>alterar imagens para numeros</h2>
      </Reveal>

      <SectionTitle title="Da escolha à retirada, simples, prático e econômico." />

      <ol className={styles.grid}>
        {buyingSteps.map((step, index) => (
          <li key={step.title} className={styles.item}>
            <Reveal animation="fadeInUp" delay={index * 110} className={styles.cell}>
              <FeatureCard
                title={step.title}
                description={step.description}
                image={step.image}
              />
            </Reveal>
          </li>
        ))}
      </ol>

      <Reveal animation="fadeInUp" delay={450} className={styles.action}>
        <Button href="/como-funciona" variant="dark">
          Entenda o Processo
        </Button>
      </Reveal>
    </Section>
  );
}
