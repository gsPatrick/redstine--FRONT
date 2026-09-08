import Image from "next/image";
import PageHero from "@/components/organisms/PageHero/PageHero";
import Section from "@/components/atoms/Section/Section";
import SectionTitle from "@/components/atoms/SectionTitle/SectionTitle";
import Reveal from "@/components/atoms/Reveal/Reveal";
import FeatureCard from "@/components/molecules/FeatureCard/FeatureCard";
import CtaBand from "@/components/organisms/CtaBand/CtaBand";
import RealOperation from "@/components/organisms/RealOperation/RealOperation";
import { aboutOperation } from "@/lib/home";
import { sobreRed } from "@/lib/pages";
import styles from "./page.module.css";

export const metadata = {
  title: "Sobre a RED — Redestine",
  description: sobreRed.hero.subtitle,
};

export default function SobreRedPage() {
  return (
    <>
      <PageHero {...sobreRed.hero} />

      <Section tone="light">
        <Reveal animation="fadeIn" className={styles.frame}>
          <Image
            src={sobreRed.featureImage}
            alt=""
            width={1200}
            height={675}
            className={styles.image}
          />
        </Reveal>
      </Section>

      <Section tone="tinted">
        <SectionTitle title={sobreRed.problemTitle} />
        <div className={styles.prose}>
          {sobreRed.problem.map((paragraph, index) => (
            <Reveal key={paragraph} animation="fadeInUp" delay={index * 120}>
              <p className={styles.paragraph}>{paragraph}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="light">
        <SectionTitle title={sobreRed.pillarsTitle} />
        <div className={styles.pillars}>
          {sobreRed.pillars.map((pillar, index) => (
            <Reveal key={pillar.title} animation="fadeInUp" delay={index * 130}>
              <FeatureCard title={pillar.title} description={pillar.description} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="tinted">
        <SectionTitle title={sobreRed.fieldTitle} />
        <div className={styles.prose}>
          {sobreRed.field.map((paragraph, index) => (
            <Reveal key={paragraph} animation="fadeInUp" delay={index * 120}>
              <p className={styles.paragraph}>{paragraph}</p>
            </Reveal>
          ))}
          {/* Sem Reveal: o cliente pediu para retirar o efeito destes destaques
              e deixar somente as palavras. */}
          <p className={styles.chain}>{sobreRed.fieldChain}</p>
        </div>
      </Section>

      {/* Apoio visual do bloco de origem: fotografias reais de operações,
          materiais e produtos comercializados — diferentes das da home. */}
      <RealOperation
        fotos={aboutOperation}
        kicker="Operação real"
        titulo="O modelo começou no campo, antes de chegar à plataforma."
      />

      <Section tone="light">
        <SectionTitle title={sobreRed.missionTitle} subtitle={sobreRed.mission} />
      </Section>

      <CtaBand tone="tinted" title={sobreRed.ctaTitle} actions={sobreRed.ctaActions} />
    </>
  );
}
