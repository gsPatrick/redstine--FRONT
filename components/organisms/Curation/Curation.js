import Section from "@/components/atoms/Section/Section";
import SectionTitle from "@/components/atoms/SectionTitle/SectionTitle";
import Reveal from "@/components/atoms/Reveal/Reveal";
import Button from "@/components/atoms/Button/Button";
import ValueChip from "@/components/molecules/ValueChip/ValueChip";
import { curationPoints } from "@/lib/home";
import styles from "./Curation.module.css";

export default function Curation() {
  return (
    <Section tone="tinted" innerClassName={styles.inner}>
      <div className={styles.copy}>
        {/* Rótulo do bloco, no mesmo padrão dos demais — era o único bloco da
            home sem ele. */}
        <span className={styles.kicker}>Curadoria</span>
        <SectionTitle
          align="start"
          title="Não é só um marketplace. É Curadoria RED."
          subtitle="Fornecedores não publicam diretamente. Cada ativo é avaliado antes de integrar o catálogo."
          className={styles.head}
        />
        <Reveal animation="fadeInUp" delay={250}>
          <Button href="/como-funciona#curadoria" variant="dark" size="sm">
            Entenda a Curadoria
          </Button>
        </Reveal>
      </div>

      <ul className={styles.points}>
        {curationPoints.map((point, index) => (
          <li key={point.label}>
            <Reveal animation="fadeInUp" delay={index * 110}>
              <ValueChip label={point.label} tone={point.tone} shape={point.shape} />
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}
