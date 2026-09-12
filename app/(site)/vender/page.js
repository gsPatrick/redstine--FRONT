import PageHero from "@/components/organisms/PageHero/PageHero";
import ListColumns from "@/components/organisms/ListColumns/ListColumns";
import Section from "@/components/atoms/Section/Section";
import SectionTitle from "@/components/atoms/SectionTitle/SectionTitle";
import Reveal from "@/components/atoms/Reveal/Reveal";
import FeatureCard from "@/components/molecules/FeatureCard/FeatureCard";
import ModelCard from "@/components/molecules/ModelCard/ModelCard";
import StepsGrid from "@/components/organisms/StepsGrid/StepsGrid";
import EnvioAcesso from "./EnvioAcesso";
import CtaBand from "@/components/organisms/CtaBand/CtaBand";
import { vender } from "@/lib/pages";
import styles from "./page.module.css";

export const metadata = {
  title: "Vender — Redestine",
  description: vender.hero.subtitle,
};

export default function VenderPage() {
  return (
    <>
      <PageHero {...vender.hero} />

      <ListColumns tone="tinted" title={vender.originsTitle} columns={vender.origins} />

      <Section tone="light">
        <SectionTitle title={vender.sourcingTitle} />
        <Reveal animation="fadeInUp" delay={250}>
          <p className={styles.sourcing}>{vender.sourcing}</p>
        </Reveal>
      </Section>

      <Section tone="tinted">
        <SectionTitle title={vender.benefitsTitle} />
        <div className={styles.benefits}>
          {vender.benefits.map((benefit, index) => (
            <Reveal key={benefit.title} animation="fadeInUp" delay={index * 110}>
              <FeatureCard title={benefit.title} description={benefit.description} />
            </Reveal>
          ))}
        </div>
      </Section>

      <StepsGrid
        tone="light"
        note={vender.editorNote}
        title={vender.stepsTitle}
        steps={vender.steps}
        cta={vender.stepsCta}
        columns={4}
      />

      <Section tone="tinted">
        <SectionTitle title={vender.modelsTitle} />
        <div className={styles.models}>
          {vender.models.map((model, index) => (
            <Reveal key={model.title} animation="fadeInUp" delay={index * 140}>
              <ModelCard {...model} />
            </Reveal>
          ))}
        </div>
      </Section>

      <EnvioAcesso title={vender.formTitle} note={vender.formNote} id="enviar" />

      <CtaBand
        tone="light"
        title={vender.ctaTitle}
        actions={[{ ...vender.ctaAction, variant: "dark" }]}
      />
    </>
  );
}
