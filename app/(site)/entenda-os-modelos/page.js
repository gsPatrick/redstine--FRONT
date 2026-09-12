import PageHero from "@/components/organisms/PageHero/PageHero";
import Section from "@/components/atoms/Section/Section";
import SectionTitle from "@/components/atoms/SectionTitle/SectionTitle";
import Reveal from "@/components/atoms/Reveal/Reveal";
import Button from "@/components/atoms/Button/Button";
import ListCard from "@/components/molecules/ListCard/ListCard";
import FeatureCard from "@/components/molecules/FeatureCard/FeatureCard";
import ComparisonTable from "@/components/organisms/ComparisonTable/ComparisonTable";
import Faq from "@/components/organisms/Faq/Faq";
import CtaBand from "@/components/organisms/CtaBand/CtaBand";
import { entendaOsModelos as page } from "@/lib/pages";
import styles from "./page.module.css";

export const metadata = {
  title: "Modelos Comerciais — Redestine",
  description: page.hero.subtitle,
};

export default function EntendaOsModelosPage() {
  return (
    <>
      <PageHero {...page.hero} size="sm" />

      {page.models.map((model, index) => (
        <Section key={model.id} id={model.id} tone={index % 2 === 0 ? "tinted" : "light"}>
          <header className={styles.modelHead}>
            <Reveal animation="fadeInUp" delay={250} as="h2" className={styles.modelName}>
              {model.name}
            </Reveal>
            <Reveal animation="fadeInUp" delay={250}>
              <h3 className={styles.modelClaim}>{model.claim}</h3>
            </Reveal>
            <Reveal animation="fadeInUp" delay={250}>
              <p className={styles.modelIntro}>{model.intro}</p>
            </Reveal>
          </header>

          <div className={styles.duties}>
            <Reveal animation="fadeInUp">
              <ListCard title="RESPONSABILIDADES DA RED" items={model.redDuties} />
            </Reveal>
            <Reveal animation="fadeInUp" delay={120}>
              <ListCard title="RESPONSABILIDADES DO FORNECEDOR" items={model.supplierDuties} />
            </Reveal>
          </div>

          <div className={styles.split}>
            <Reveal animation="fadeInUp" className={styles.splitBox}>
              <h3 className={styles.splitTitle}>DIVISÃO DO RESULTADO</h3>
              <p className={styles.splitValue}>
                <span>{model.split.supplier}</span>
                <span className={styles.dash}>–</span>
                <span>{model.split.red}</span>
              </p>
            </Reveal>

            <Reveal animation="fadeInUp" delay={120} className={styles.splitBox}>
              <h3 className={styles.splitTitle}>MAIS INDICADO PARA</h3>
              <ul className={styles.bestList}>
                {model.bestFor.map((item) => (
                  <li key={item} className={styles.bestItem}>
                    <span className={styles.dot} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal animation="fadeInUp" delay={220} className={styles.modelAction}>
            <Button href="/painel/vender/enviar" variant="dark">
              Enviar Ativos
            </Button>
          </Reveal>
        </Section>
      ))}

      <Section tone="tinted">
        <SectionTitle title={page.pricingTitle} subtitle={page.pricingLead} subtitleAs="h3" />
        <div className={styles.pricing}>
          {page.pricingItems.map((item, index) => (
            <Reveal key={item} animation="fadeInUp" delay={Math.min(index, 6) * 70}>
              <span className={styles.chip}>{item}</span>
            </Reveal>
          ))}
        </div>
        <Reveal animation="fadeInUp" delay={300}>
          <p className={styles.pricingNote}>{page.pricingNote}</p>
        </Reveal>
        <Reveal animation="fadeInUp" delay={340}>
          <p className={styles.pricingWarning}>{page.pricingWarning}</p>
        </Reveal>
      </Section>

      <Section tone="light">
        <SectionTitle title={page.criteriaTitle} subtitle={page.criteriaLead} />
        <div className={styles.criteria}>
          {page.criteria.map((item, index) => (
            <Reveal key={item.title} animation="fadeInUp" delay={Math.min(index, 6) * 90}>
              <FeatureCard title={item.title} description={item.description} />
            </Reveal>
          ))}
        </div>
        <Reveal animation="fadeInUp" delay={420} className={styles.modelAction}>
          <Button href={page.criteriaCta.href} variant="dark">
            {page.criteriaCta.label}
          </Button>
        </Reveal>
      </Section>

      <ComparisonTable
        title={page.compareTitle}
        columns={page.compare.columns}
        rows={page.compare.rows}
      />

      <Faq tone="tinted" title={page.faqTitle} items={page.faq} />

      <CtaBand
        tone="light"
        title={page.ctaTitle}
        actions={[{ ...page.ctaAction, variant: "dark" }]}
      />
    </>
  );
}
