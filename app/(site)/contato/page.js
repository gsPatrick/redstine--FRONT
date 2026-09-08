import PageHero from "@/components/organisms/PageHero/PageHero";
import Section from "@/components/atoms/Section/Section";
import SectionTitle from "@/components/atoms/SectionTitle/SectionTitle";
import Reveal from "@/components/atoms/Reveal/Reveal";
import Button from "@/components/atoms/Button/Button";
import CtaBand from "@/components/organisms/CtaBand/CtaBand";
import { contato } from "@/lib/pages";
import styles from "./page.module.css";

export const metadata = {
  title: "Contato — Redestine",
  description: contato.hero.subtitle,
};

export default function ContatoPage() {
  return (
    <>
      <PageHero {...contato.hero} />

      <Section tone="tinted">
        <SectionTitle title={contato.channelsTitle} />
        <div className={styles.channels}>
          {contato.channels.map((channel, index) => (
            <Reveal key={channel.kicker} animation="fadeInUp" delay={index * 110}>
              <article className={styles.card}>
                <h3 className={styles.kicker}>{channel.kicker}</h3>
                <p className={styles.description}>{channel.description}</p>
                {channel.cta ? (
                  <div className={styles.action}>
                    {channel.external ? (
                      <a
                        href={channel.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.link}
                      >
                        {channel.cta}
                      </a>
                    ) : (
                      <Button href={channel.href} variant="dark" size="sm">
                        {channel.cta}
                      </Button>
                    )}
                  </div>
                ) : null}
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="light" innerClassName={styles.noticeInner}>
        <div className={styles.noticeCopy}>
          <Reveal animation="fadeInUp" delay={250} as="h2" className={styles.noticeTitle}>
            {contato.noticeTitle}
          </Reveal>
          <Reveal animation="fadeInUp" delay={250}>
            <p className={styles.noticeText}>{contato.notice}</p>
          </Reveal>
        </div>

        <Reveal animation="fadeInUp" delay={320}>
          <a
            href={contato.noticeCta.href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            {contato.noticeCta.label}
          </a>
        </Reveal>
      </Section>

      <CtaBand tone="tinted" title={contato.ctaTitle} actions={contato.ctaActions} />
    </>
  );
}
