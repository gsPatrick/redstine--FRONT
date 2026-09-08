import Section from "@/components/atoms/Section/Section";
import SectionTitle from "@/components/atoms/SectionTitle/SectionTitle";
import Reveal from "@/components/atoms/Reveal/Reveal";
import Button from "@/components/atoms/Button/Button";
import FeatureCard from "@/components/molecules/FeatureCard/FeatureCard";
import styles from "./StepsGrid.module.css";

export default function StepsGrid({
  tone = "light",
  title,
  note,
  steps,
  cta,
  columns = 5,
  id,
}) {
  return (
    <Section tone={tone} id={id}>
      {note ? (
        <Reveal animation="fadeInUp" delay={250}>
          <h2 className={styles.note}>{note}</h2>
        </Reveal>
      ) : null}

      {title ? <SectionTitle title={title} /> : null}

      <ol className={styles.grid} data-columns={columns}>
        {steps.map((step, index) => (
          <li key={step.title} className={styles.item}>
            <Reveal animation="fadeInUp" delay={Math.min(index, 6) * 100} className={styles.cell}>
              <FeatureCard
                title={step.title}
                description={step.description}
                image={step.image}
              />
            </Reveal>
          </li>
        ))}
      </ol>

      {cta ? (
        <Reveal animation="fadeInUp" delay={450} className={styles.action}>
          <Button href={cta.href} variant="accent">
            {cta.label}
          </Button>
        </Reveal>
      ) : null}
    </Section>
  );
}
