import Button from "@/components/atoms/Button/Button";
import Reveal from "@/components/atoms/Reveal/Reveal";
import KenBurnsSlideshow from "@/components/molecules/KenBurnsSlideshow/KenBurnsSlideshow";
import styles from "./PageHero.module.css";

/**
 * Banner de topo — componente canônico de TODAS as páginas que não são a Home.
 *
 * O cliente definiu três níveis de altura (ver bannerHeights.module.css).
 * Este componente é o único lugar que os aplica; ShopHero virou um invólucro
 * daqui justamente para não existirem duas implementações do mesmo banner com
 * alturas diferentes (era o caso: ShopHero tinha 520px fixos próprios).
 *
 * Nomes canônicos de `size`: "cover" | "main" | "sub".
 * Os nomes antigos continuam aceitos porque as páginas não são editadas por
 * este agente e já passam "lg"/"md":
 *   md -> main   (era 340px, coincide com a referência: nada muda)
 *   lg -> main   (era 420px: colapsa para o padrão da interna principal)
 *   sm -> sub
 */
const SIZE_ALIAS = {
  cover: "cover",
  main: "main",
  sub: "sub",
  md: "main",
  lg: "main",
  sm: "sub",
};

export default function PageHero({
  image,
  title,
  subtitle,
  subtitleAs: SubTag = "p",
  actions = [],
  size = "main",
}) {
  const variant = SIZE_ALIAS[size] || "main";

  return (
    <section className={`${styles.hero} ${styles[variant]}`}>
      {image ? <KenBurnsSlideshow slides={[image]} duration={12000} transition={500} /> : null}
      <div className={styles.overlay} aria-hidden="true" />

      <div className={styles.inner}>
        <Reveal animation="fadeInUp" as="h1" className={styles.title}>
          {title}
        </Reveal>

        {subtitle ? (
          <Reveal animation="fadeInUp" delay={140}>
            <SubTag className={styles.subtitle}>{subtitle}</SubTag>
          </Reveal>
        ) : null}

        {actions.length ? (
          <Reveal animation="fadeInUp" delay={220} className={styles.actions}>
            {/* Padrão de botão do item 26: o fundo do banner é sempre imagem
                escura, então o par correto é "solid" (principal) + "ghost"
                (alternativa), em size "lg". Normalizado aqui em vez de nas
                páginas para que nenhuma capa possa fugir do padrão — algumas
                passam variant pensado para fundo claro. */}
            {actions.map((action, i) => (
              <Button
                key={action.label}
                href={action.href}
                variant={i === 0 ? "solid" : "ghost"}
                size="lg"
              >
                {action.label}
              </Button>
            ))}
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
