"use client";

import { useEffect, useState } from "react";
import Button from "@/components/atoms/Button/Button";
import KenBurnsSlideshow from "@/components/molecules/KenBurnsSlideshow/KenBurnsSlideshow";
import styles from "./Hero.module.css";

const slides = [
  "/images/2026/07/distribuidora-de-material-de-construcao-1.jpg",
  "/images/2026/07/Capa-do-artigo.jpg",
  "/images/2026/07/2.webp",
];

/**
 * Mesma estrutura do HeroExperience (Integrated Biosciences), do LandingHero
 * (BankerPro) e do PublicHero (Eterniza):
 * - moldura com inset e cantos arredondados sobre o vazio
 * - no load, o painel abre a partir de um ponto central (clip-path)
 * - no primeiro scroll (scrollY > 8), a moldura estoura para tela cheia
 * - o conteúdo vive DENTRO do banner, nunca vaza para o vazio
 *
 * O fundo é o slideshow Ken Burns original do site clonado.
 */
export default function Hero() {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const onScroll = () => setExpanded(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section className={styles.experience} id="top">
      <div className={styles.mediaBg}>
        <div className={`${styles.frame} ${expanded ? styles.expanded : ""}`}>
          <div className={styles.canvas} aria-hidden="true">
            <KenBurnsSlideshow slides={slides} duration={5000} transition={500} />
            <div className={styles.veil} />
          </div>

          <div className={styles.content}>
            <div className={styles.copy}>
              <h1 className={styles.heading}>
                Ativos parados podem
                <br />
                voltar a gerar valor.
              </h1>

              <div className={styles.actions}>
                <Button href="/shop" variant="solid" size="md">
                  Comprar
                </Button>
                <Button href="/vender" variant="ghost" size="md">
                  Vender
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
