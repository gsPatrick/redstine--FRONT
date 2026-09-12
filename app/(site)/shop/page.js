import { Suspense } from "react";
import ShopHero from "@/components/organisms/ShopHero/ShopHero";
import Section from "@/components/atoms/Section/Section";
import Reveal from "@/components/atoms/Reveal/Reveal";
import CategoryCard from "@/components/molecules/CategoryCard/CategoryCard";
import Catalog from "@/components/organisms/Catalog/Catalog";
import BuyingSteps from "@/components/organisms/BuyingSteps/BuyingSteps";
import BuyingModes from "@/components/organisms/BuyingModes/BuyingModes";
import CtaBand from "@/components/organisms/CtaBand/CtaBand";
import SectionTitle from "@/components/atoms/SectionTitle/SectionTitle";
import { shopHero, shopIntro, getShopCategories } from "@/lib/shop";
import { getCatalogo } from "@/lib/products";
import styles from "./page.module.css";

export const metadata = {
  title: "Catálogo — Redestine",
  description: shopHero.subtitle,
};

/**
 * Página Comprar.
 *
 * Componente de servidor assíncrono: o catálogo vem da API a cada revalidação,
 * não de um JSON congelado no build. A busca por termo já entra filtrada pelo
 * banco — trazer o catálogo inteiro para filtrar no navegador não escala
 * quando o acervo crescer.
 *
 * Ordem da página, depois da revisão do cliente (item 29): banner, título, os
 * três cards de categoria, filtros + produtos, como comprar, modalidades, CTA.
 */
export default async function ShopPage({ searchParams }) {
  const term = typeof searchParams?.s === "string" ? searchParams.s : "";
  // As duas leituras são independentes: buscar em paralelo evita somar as
  // latências das chamadas numa página que já espera pelo catálogo.
  const [{ produtos: products, filtros }, categories] = await Promise.all([
    getCatalogo(term ? { search: term } : {}),
    getShopCategories(),
  ]);

  return (
    <>
      <ShopHero {...shopHero} />

      {/* Item 29: banner, TÍTULO, os três cards — e só depois filtros e grid.
          Antes os cards vinham colados no banner e o único título da página
          aparecia depois deles, já dentro do bloco de filtros. O título entra
          fora do elemento, como na home, que foi o padrão que o cliente
          aprovou. */}
      <Section tone="light">
        <SectionTitle title={shopIntro.title} subtitle={shopIntro.subtitle} />

        <div className={styles.categories}>
          {categories.map((category, index) => (
            <Reveal key={category.name} animation="fadeIn" delay={index * 120}>
              {/* Card MAIOR: `subcategories` é o que o diferencia do da home. */}
              <CategoryCard {...category} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Suspense>
        <Catalog
          products={products}
          filtrosDaApi={filtros}
          initialTerm={term}
          title="Busque por produto, categoria ou localização"
        />
      </Suspense>

      <BuyingSteps />
      <BuyingModes />

      <CtaBand
        tone="light"
        title="Encontre uma oportunidade para sua operação"
        actions={[{ label: "Explorar Ativos", href: "#comprar", variant: "dark" }]}
      />
    </>
  );
}
