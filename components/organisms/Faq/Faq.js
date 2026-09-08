import Section from "@/components/atoms/Section/Section";
import SectionTitle from "@/components/atoms/SectionTitle/SectionTitle";
import Accordion from "@/components/molecules/Accordion/Accordion";
import styles from "./Faq.module.css";

export default function Faq({ title, items, tone = "tinted" }) {
  return (
    <Section tone={tone}>
      <SectionTitle title={title} />
      <div className={styles.wrap}>
        <Accordion items={items.map((item) => ({ title: item.q, content: <p>{item.a}</p> }))} />
      </div>
    </Section>
  );
}
