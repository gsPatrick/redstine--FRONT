import { Suspense } from "react";
import ShopHero from "@/components/organisms/ShopHero/ShopHero";
import Section from "@/components/atoms/Section/Section";
import Reveal from "@/components/atoms/Reveal/Reveal";
import CategoryCard from "@/components/molecules/CategoryCard/CategoryCard";
import Catalog from "@/components/organisms/Catalog/Catalog";
import BuyingSteps from "@/components/organisms/BuyingSteps/BuyingSteps";
import BuyingModes from "@/components/organisms/BuyingModes/BuyingModes";
import CtaBand from "@/components/organisms/CtaBand/CtaBand";
import { shopHero, shopCategories } from "@/lib/shop";
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
 */
export default async function ShopPage({ searchParams }) {
  const term = typeof searchParams?.s === "string" ? searchParams.s : "";
  const { produtos: products, filtros } = await getCatalogo(term ? { search: term } : {});

  return (
    <>
      <ShopHero {...shopHero} />

      <Section tone="light">
        <div className={styles.categories}>
          {shopCategories.map((category, index) => (
            <Reveal key={category.name} animation="fadeIn" delay={index * 120}>
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
