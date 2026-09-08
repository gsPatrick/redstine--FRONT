import Button from "@/components/atoms/Button/Button";
import Reveal from "@/components/atoms/Reveal/Reveal";
import KenBurnsSlideshow from "@/components/molecules/KenBurnsSlideshow/KenBurnsSlideshow";
import styles from "./PageHero.module.css";

export default function PageHero({
  image,
  title,
  subtitle,
  subtitleAs: SubTag = "p",
  actions = [],
  size = "md",
}) {
  return (
    <section className={`${styles.hero} ${styles[size]}`}>
      {image ? <KenBurnsSlideshow slides={[image]} duration={12000} transition={500} /> : null}
      <div className={styles.overlay} aria-hidden="true" />

      <div className={styles.inner}>
        <Reveal animation="fadeInUp" as="h1" className={styles.title}>
          {title}
        </Reveal>

        {subtitle ? (
          <Reveal animation="fadeInUp" delay={140}>
            <SubTag className={styles.subtitle}>{subtitle}</SubTag>
          </Reveal>
        ) : null}

        {actions.length ? (
          <Reveal animation="fadeInUp" delay={220} className={styles.actions}>
            {actions.map((action) => (
              <Button key={action.label} href={action.href} variant={action.variant}>
                {action.label}
              </Button>
            ))}
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
