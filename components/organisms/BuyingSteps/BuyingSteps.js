import Section from "@/components/atoms/Section/Section";
import SectionTitle from "@/components/atoms/SectionTitle/SectionTitle";
import Reveal from "@/components/atoms/Reveal/Reveal";
import Button from "@/components/atoms/Button/Button";
import FeatureCard from "@/components/molecules/FeatureCard/FeatureCard";
import { buyingSteps } from "@/lib/shop";
import styles from "./BuyingSteps.module.css";

/**
 * Jornada de compra resumida.
 *
 * O titulo vem por prop com este default porque o cliente nomeou o bloco:
 * "pode ter título do bloco de 'jornada de venda resumida' e 'jornada de
 * compra resumida'". A frase anterior descrevia a experiencia; o nome diz o
 * que o bloco E, e e isso que permite ao leitor saber que existe uma versao
 * completa em outro lugar.
 */
export default function BuyingSteps({ title = "Jornada de compra resumida" }) {
  return (
    <Section tone="tinted" id="funciona">
      <SectionTitle
        kicker="Como comprar"
        title={title}
        subtitle="Da escolha à retirada, simples, prático e econômico."
      />

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
