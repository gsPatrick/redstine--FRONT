import Image from "next/image";
import Section from "@/components/atoms/Section/Section";
import SectionTitle from "@/components/atoms/SectionTitle/SectionTitle";
import Reveal from "@/components/atoms/Reveal/Reveal";
import styles from "./Origins.module.css";

export default function Origins() {
  return (
    <Section tone="tinted">
      <SectionTitle title="A RED nasceu de operações reais" />

      <div className={styles.grid}>
        {[0, 1].map((index) => (
          <Reveal key={index} animation="fadeIn" delay={index * 140}>
            <div className={styles.frame}>
              <Image
                src="/images/placeholder.png"
                alt=""
                width={800}
                height={500}
                className={styles.image}
              />
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
