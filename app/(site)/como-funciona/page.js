import PageHero from "@/components/organisms/PageHero/PageHero";
import StepsGrid from "@/components/organisms/StepsGrid/StepsGrid";
import ListColumns from "@/components/organisms/ListColumns/ListColumns";
import Section from "@/components/atoms/Section/Section";
import SectionTitle from "@/components/atoms/SectionTitle/SectionTitle";
import Reveal from "@/components/atoms/Reveal/Reveal";
import ModelCard from "@/components/molecules/ModelCard/ModelCard";
import Faq from "@/components/organisms/Faq/Faq";
import CtaBand from "@/components/organisms/CtaBand/CtaBand";
import { comoFunciona } from "@/lib/pages";
import styles from "./page.module.css";

export const metadata = {
  title: "Como Funciona — Redestine",
  description: comoFunciona.hero.subtitle,
};

export default function ComoFuncionaPage() {
  return (
    <>
      <PageHero {...comoFunciona.hero} />

      <StepsGrid
        tone="tinted"
        note={comoFunciona.editorNote}
        title={comoFunciona.stepsTitle}
        steps={comoFunciona.steps}
        columns={4}
      />

      <ListColumns
        id="curadoria"
        tone="light"
        title={comoFunciona.curationTitle}
        columns={comoFunciona.curation}
        cta={comoFunciona.curationCta}
      />

      <Section tone="tinted">
        <SectionTitle title={comoFunciona.bridgeTitle} />
        <div className={styles.bridge}>
          {comoFunciona.bridge.map((side, index) => (
            /* Era o ultimo bloco de duas colunas com formato proprio: 214px
               contra os 330px do mesmo formato nas outras paginas. Passa a
               usar o ModelCard, que e o painel padrao (PADROES.md, secao 5). */
            <Reveal key={side.kicker} animation="fadeInUp" delay={index * 140}>
              <ModelCard {...side} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Faq tone="light" title={comoFunciona.faqTitle} items={comoFunciona.faq} />

      <CtaBand
        tone="tinted"
        title={comoFunciona.ctaTitle}
        actions={comoFunciona.ctaActions}
      />
    </>
  );
}
