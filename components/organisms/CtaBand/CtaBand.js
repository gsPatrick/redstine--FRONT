import Section from "@/components/atoms/Section/Section";
import Reveal from "@/components/atoms/Reveal/Reveal";
import Button from "@/components/atoms/Button/Button";
import styles from "./CtaBand.module.css";

export default function CtaBand({ tone = "tinted", title, text, actions = [] }) {
  return (
    <Section tone={tone} innerClassName={styles.inner}>
      <div className={styles.copy}>
        <Reveal animation="fadeInUp" delay={250} as="h2" className={styles.title}>
          {title}
        </Reveal>
        {text ? (
          <Reveal animation="fadeInUp" delay={250}>
            <p className={styles.text}>{text}</p>
          </Reveal>
        ) : null}
      </div>

      {actions.length ? (
        <Reveal animation="fadeInUp" delay={320} className={styles.actions}>
          {actions.map((action) => (
            <Button key={action.label} href={action.href} variant={action.variant || "dark"}>
              {action.label}
            </Button>
          ))}
        </Reveal>
      ) : null}
    </Section>
  );
}
