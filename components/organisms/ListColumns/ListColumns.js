import Section from "@/components/atoms/Section/Section";
import SectionTitle from "@/components/atoms/SectionTitle/SectionTitle";
import Reveal from "@/components/atoms/Reveal/Reveal";
import Button from "@/components/atoms/Button/Button";
import ListCard from "@/components/molecules/ListCard/ListCard";
import styles from "./ListColumns.module.css";

export default function ListColumns({ tone = "light", title, subtitle, columns, cta, id }) {
  return (
    <Section tone={tone} id={id}>
      {title ? <SectionTitle title={title} subtitle={subtitle} /> : null}

      <div className={styles.grid} data-count={columns.length}>
        {columns.map((column, index) => (
          <Reveal key={column.title} animation="fadeInUp" delay={index * 120}>
            <ListCard title={column.title} items={column.items} lead={column.lead} />
          </Reveal>
        ))}
      </div>

      {cta ? (
        <Reveal animation="fadeInUp" delay={400} className={styles.action}>
          <Button href={cta.href} variant="accent">
            {cta.label}
          </Button>
        </Reveal>
      ) : null}
    </Section>
  );
}
