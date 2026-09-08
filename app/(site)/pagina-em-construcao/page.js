import Section from "@/components/atoms/Section/Section";
import Button from "@/components/atoms/Button/Button";
import Reveal from "@/components/atoms/Reveal/Reveal";
import styles from "./page.module.css";

export const metadata = {
  title: "Página em construção — Redestine",
};

export default function PaginaEmConstrucaoPage() {
  return (
    <Section tone="light" size="lg" innerClassName={styles.inner}>
      <Reveal animation="fadeInUp" as="h1" className={styles.title}>
        PAGINA EM CONSTRUÇÃO
      </Reveal>
      <Reveal animation="fadeInUp" delay={160} className={styles.action}>
        <Button href="/" variant="dark">
          Voltar ao início
        </Button>
      </Reveal>
    </Section>
  );
}
