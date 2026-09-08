import Section from "@/components/atoms/Section/Section";
import Reveal from "@/components/atoms/Reveal/Reveal";
import styles from "./page.module.css";

export const metadata = { title: "Hello world! — Redestine" };

export default function HelloWorldPage() {
  return (
    <Section tone="light">
      <article className={styles.post}>
        <Reveal animation="fadeInUp" as="h1" className={styles.title}>
          Hello world!
        </Reveal>

        <Reveal animation="fadeInUp" delay={120}>
          <p className={styles.meta}>
            <time dateTime="2026-06-23T13:02:42-03:00">23 de junho de 2026</time>
          </p>
        </Reveal>

        <Reveal animation="fadeInUp" delay={180}>
          <div className={styles.body}>
            <p>
              Welcome to WordPress. This is your first post. Edit or delete it, then start
              writing!
            </p>
          </div>
        </Reveal>
      </article>
    </Section>
  );
}
