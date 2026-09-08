import Hero from "@/components/organisms/Hero/Hero";
import Intro from "@/components/organisms/Intro/Intro";
import PriceClaim from "@/components/organisms/PriceClaim/PriceClaim";
import CategoryGrid from "@/components/organisms/CategoryGrid/CategoryGrid";
import FeaturedProducts from "@/components/organisms/FeaturedProducts/FeaturedProducts";
import Participation from "@/components/organisms/Participation/Participation";
import Efficiency from "@/components/organisms/Efficiency/Efficiency";
import Process from "@/components/organisms/Process/Process";
import Curation from "@/components/organisms/Curation/Curation";
import CommercialModels from "@/components/organisms/CommercialModels/CommercialModels";
import Circularity from "@/components/organisms/Circularity/Circularity";
import RealOperation from "@/components/organisms/RealOperation/RealOperation";
import Partners from "@/components/organisms/Partners/Partners";
import FinalCta from "@/components/organisms/FinalCta/FinalCta";
import { getFeaturedProducts } from "@/lib/products";

export const metadata = {
  title: "Redestine",
  description:
    "A RED transforma materiais, equipamentos e mobiliário em novas oportunidades. Compre ativos disponíveis ou envie os seus para avaliação.",
};

export default async function HomePage() {
  const featured = await getFeaturedProducts(9);

  return (
    <>
      <Hero />
      <Intro />
      <PriceClaim />
      <CategoryGrid />
      <FeaturedProducts products={featured} />
      <Participation />
      <Efficiency />
      <Process />
      <Curation />
      <CommercialModels />
      <Circularity />
      <RealOperation />
      <Partners />
      <FinalCta />
    </>
  );
}
