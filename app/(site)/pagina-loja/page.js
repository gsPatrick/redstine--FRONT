import PageHero from "@/components/organisms/PageHero/PageHero";
import Section from "@/components/atoms/Section/Section";
import SectionTitle from "@/components/atoms/SectionTitle/SectionTitle";
import Reveal from "@/components/atoms/Reveal/Reveal";
import Button from "@/components/atoms/Button/Button";
import CategoryCard from "@/components/molecules/CategoryCard/CategoryCard";
import FeatureCard from "@/components/molecules/FeatureCard/FeatureCard";
import FeaturedProducts from "@/components/organisms/FeaturedProducts/FeaturedProducts";
import CtaBand from "@/components/organisms/CtaBand/CtaBand";
import { paginaLoja } from "@/lib/pages";
import { getFeaturedProducts, getProductsByCategory } from "@/lib/products";
import styles from "./page.module.css";

export const metadata = {
  title: "Loja — Redestine",
};

/**
 * Página herdada do site anterior.
 *
 * Continua no ar porque ainda há links apontando para ela, mas o conteúdo é o
 * mesmo da página Comprar. Assíncrona como as demais — os ativos vêm da API,
 * e as duas listas partilham a mesma busca em vez de pedir duas vezes.
 */
export default async function PaginaLojaPage() {
  const destaques = await getFeaturedProducts(8);

  // Uma busca por bloco, em paralelo: sequencial multiplicaria o tempo de
  // resposta pelo número de blocos.
  const porBloco = Object.fromEntries(
    await Promise.all(
      paginaLoja.novelties.map(async (b) => [b.slug, (await getProductsByCategory(b.slug)).slice(0, 4)])
    )
  );

  return (
    <>
      <PageHero {...paginaLoja.hero} />

      <FeaturedProducts products={destaques} title={paginaLoja.featuredTitle} />

      <Section tone="light">
        <SectionTitle title={paginaLoja.assetsTitle} />
        <div className={styles.grid}>
          {destaques.map((product, index) => (
            <Reveal key={product.id} animation="fadeIn" delay={Math.min(index, 4) * 90}>
              <article className={styles.stub}>
                <p className={styles.stubName}>{product.name}</p>
                <h3 className={styles.stubPrice}>Valor Sob Consulta</h3>
                <Button href={`/produto/${product.slug}`} variant="dark" size="sm">
                  Ver Ativo
                </Button>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="tinted">
        <Reveal animation="fadeInUp" delay={250}>
          <h2 className={styles.kicker}>{paginaLoja.exploreKicker}</h2>
        </Reveal>
        <SectionTitle title={paginaLoja.exploreTitle} />

        <div className={styles.categories}>
          {paginaLoja.exploreCards.map((card, index) => (
            <Reveal key={card.name} animation="fadeIn" delay={index * 120}>
              <CategoryCard {...card} />
            </Reveal>
          ))}
        </div>
      </Section>

      {paginaLoja.novelties.map((block, blockIndex) => (
        <Section key={block.title} tone={blockIndex % 2 === 0 ? "light" : "tinted"}>
          <Reveal animation="fadeInUp" delay={250}>
            <h2 className={styles.kicker}>{block.kicker}</h2>
          </Reveal>
          <SectionTitle title={block.title} />

          <div className={styles.grid}>
            {(porBloco[block.slug] || []).map((product, index) => (
                <Reveal key={product.id} animation="fadeIn" delay={index * 90}>
                  <article className={styles.stub}>
                    <p className={styles.stubName}>{product.name}</p>
                    <h3 className={styles.stubPrice}>Valor Sob Consulta</h3>
                    <Button href={`/produto/${product.slug}`} variant="dark" size="sm">
                      Ver Ativo
                    </Button>
                  </article>
                </Reveal>
            ))}
          </div>
        </Section>
      ))}

      <Section tone="light">
        <Reveal animation="fadeInUp" delay={250}>
          <h2 className={styles.kicker}>{paginaLoja.extraKicker}</h2>
        </Reveal>
        <SectionTitle title={paginaLoja.extraTitle} />

        <div className={styles.extras}>
          {paginaLoja.extraBoxes.map((box, index) => (
            <Reveal key={index} animation="fadeInUp" delay={index * 110}>
              <FeatureCard
                title={box.title}
                description={box.description}
                image="/images/placeholder.png"
                align="center"
              />
            </Reveal>
          ))}
        </div>
      </Section>

      <CtaBand
        tone="tinted"
        title={paginaLoja.closingTitle}
        text={paginaLoja.closingText}
        actions={paginaLoja.closingActions}
      />
    </>
  );
}
