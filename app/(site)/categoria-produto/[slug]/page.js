import { notFound } from "next/navigation";
import ShopHero from "@/components/organisms/ShopHero/ShopHero";
import Catalog from "@/components/organisms/Catalog/Catalog";
import BuyingSteps from "@/components/organisms/BuyingSteps/BuyingSteps";
import { getProductsByCategory, productCategories } from "@/lib/products";
import { shopCategories } from "@/lib/shop";

export function generateStaticParams() {
  return productCategories.map((category) => ({ slug: category.slug }));
}

export function generateMetadata({ params }) {
  const category = productCategories.find((item) => item.slug === params.slug);
  return { title: category ? `${category.name} — Redestine` : "Categoria — Redestine" };
}

export default async function CategoryPage({ params }) {
  const category = productCategories.find((item) => item.slug === params.slug);
  if (!category) notFound();

  const products = await getProductsByCategory(category.slug);
  const meta = shopCategories.find((item) => item.name === category.name);

  return (
    <>
      <ShopHero
        title={category.name}
        subtitle={meta?.description}
        actions={[{ label: "Ver ativos", href: "#comprar", variant: "solid" }]}
      />

      <Catalog
        products={products}
        title={`${products.length} ${products.length === 1 ? "ativo" : "ativos"} em ${category.name}`}
        vazio={`Nenhum ativo publicado em ${category.name} no momento.`}
      />

      <BuyingSteps />
    </>
  );
}
