import Section from "@/components/atoms/Section/Section";
import Reveal from "@/components/atoms/Reveal/Reveal";
import styles from "./PolicyBody.module.css";

export default function PolicyBody({ blocks }) {
  return (
    <Section tone="light">
      <div className={styles.body}>
        {blocks.map((block, index) => (
          <Reveal key={block.heading} animation="fadeInUp" delay={Math.min(index, 6) * 70}>
            <section className={styles.block}>
              <h2 className={styles.heading}>{block.heading}</h2>
              {block.lead ? <p className={styles.lead}>{block.lead}</p> : null}
              <ul className={styles.list}>
                {block.items.map((item) => (
                  <li key={item} className={styles.item}>
                    <span className={styles.dot} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
