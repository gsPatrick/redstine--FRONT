import { notFound } from "next/navigation";
import ProductDetail from "@/components/organisms/ProductDetail/ProductDetail";
import FeaturedProducts from "@/components/organisms/FeaturedProducts/FeaturedProducts";
import { getProduct, getProductsByCategory } from "@/lib/products";

/**
 * Página do ativo.
 *
 * Sem `generateStaticParams`: o catálogo é vivo — a curadoria publica e retira
 * ativos —, e congelar as rotas no build faria um ativo novo devolver 404 até
 * o próximo deploy. As páginas são renderizadas sob demanda e revalidadas pelo
 * cliente da API.
 */
export async function generateMetadata({ params }) {
  const product = await getProduct(params.slug);
  if (!product) return { title: "Ativo não encontrado — Redestine" };

  return {
    title: `${product.name} — Redestine`,
    description: product.shortDescription?.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.shortDescription?.slice(0, 160),
      images: product.images?.[0]?.src ? [product.images[0].src] : [],
    },
  };
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  // Relacionados: mesma categoria, sem o próprio ativo. Vem filtrado da API em
  // vez de trazer o catálogo inteiro para descartar quase tudo no servidor.
  const categorySlug = product.categories?.[0]?.slug;
  const daCategoria = categorySlug ? await getProductsByCategory(categorySlug) : [];
  const related = daCategoria.filter((item) => item.id !== product.id).slice(0, 8);

  return (
    <>
      <ProductDetail product={product} />
      {related.length ? <FeaturedProducts products={related} /> : null}
    </>
  );
}
