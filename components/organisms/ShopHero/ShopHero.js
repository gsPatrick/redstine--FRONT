import Button from "@/components/atoms/Button/Button";
import Reveal from "@/components/atoms/Reveal/Reveal";
import KenBurnsSlideshow from "@/components/molecules/KenBurnsSlideshow/KenBurnsSlideshow";
import styles from "./ShopHero.module.css";

const slides = ["/images/2026/07/208303-de-que-modo-o-layout-do-armazem-pode-fazer-diferenca.jpg"];

export default function ShopHero({ title, subtitle, actions = [] }) {
  return (
    <section className={styles.hero}>
      <KenBurnsSlideshow slides={slides} duration={9000} transition={500} />
      <div className={styles.overlay} aria-hidden="true" />

      <div className={styles.inner}>
        <Reveal animation="fadeInUp" as="h1" className={styles.title}>
          {title}
        </Reveal>
        {subtitle ? (
          <Reveal animation="fadeInUp" delay={140}>
            <p className={styles.subtitle}>{subtitle}</p>
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
