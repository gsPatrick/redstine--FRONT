import Section from "@/components/atoms/Section/Section";
import SectionTitle from "@/components/atoms/SectionTitle/SectionTitle";
import Reveal from "@/components/atoms/Reveal/Reveal";
import ModelCard from "@/components/molecules/ModelCard/ModelCard";
import { buyingModes } from "@/lib/shop";
import styles from "./BuyingModes.module.css";

/**
 * Compra Direta / Sob Consulta, no fim da página Comprar.
 *
 * Usa o MESMO componente dos demais blocos de 2 colunas (`ModelCard`), e não
 * um card próprio — é o que a seção 5 do PADROES.md pede. O desenho anterior
 * era um card claro com borda e 230px de altura: mesma diagramação da Home,
 * estética e altura diferentes.
 */
export default function BuyingModes() {
  return (
    <Section tone="light">
      <SectionTitle title="Compra direta ou sob consulta" />

      <div className={styles.grid}>
        {buyingModes.map((mode, index) => (
          <Reveal key={mode.title} animation="fadeInUp" delay={index * 140}>
            <ModelCard {...mode} />
          </Reveal>
        ))}
      </div>

      <Reveal animation="fadeInUp" delay={300}>
        <h2 className={styles.note}>FAZER ANCORA DOS CARDS PARA CATEGORIA NOVA</h2>
      </Reveal>
    </Section>
  );
}
