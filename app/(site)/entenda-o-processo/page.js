import PageHero from "@/components/organisms/PageHero/PageHero";
import Section from "@/components/atoms/Section/Section";
import Reveal from "@/components/atoms/Reveal/Reveal";
import Button from "@/components/atoms/Button/Button";
import CtaBand from "@/components/organisms/CtaBand/CtaBand";
import { entendaOProcesso } from "@/lib/pages";
import styles from "./page.module.css";

export const metadata = {
  title: "Entenda o Processo — Redestine",
  description: entendaOProcesso.hero.subtitle,
};

export default function EntendaOProcessoPage() {
  return (
    <>
      <PageHero {...entendaOProcesso.hero} size="lg" />

      <Section tone="tinted">
        <ol className={styles.timeline}>
          {entendaOProcesso.timeline.map((step, index) => (
            <li key={step} className={styles.node}>
              <Reveal animation="fadeInUp" delay={index * 110}>
                <span className={styles.marker}>{String(index + 1).padStart(2, "0")}</span>
                <span className={styles.nodeLabel}>{step}</span>
              </Reveal>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="light">
        <div className={styles.blocks}>
          {entendaOProcesso.blocks.map((block, index) => (
            <Reveal key={block.index} animation="fadeInUp" delay={index * 130}>
              <article className={styles.block}>
                <span className={styles.index}>{block.index}</span>
                <h2 className={styles.blockTitle}>{block.title}</h2>
                <p className={styles.blockText}>{block.description}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal animation="fadeInUp" delay={400} className={styles.action}>
          <Button href={entendaOProcesso.ctaAction.href} variant="dark">
            {entendaOProcesso.ctaAction.label}
          </Button>
        </Reveal>
      </Section>

      <CtaBand
        tone="tinted"
        title="Dê um novo destino aos seus ativos."
        text="Compre ativos disponíveis ou envie materiais, equipamentos e mobiliário para avaliação."
        actions={[
          { label: "Explorar Ativos", href: "/shop", variant: "dark" },
          { label: "Enviar Ativos", href: "/vender", variant: "outline" },
        ]}
      />
    </>
  );
}
