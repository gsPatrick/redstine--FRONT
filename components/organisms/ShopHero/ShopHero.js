import PageHero from "@/components/organisms/PageHero/PageHero";

/* Imagem padrão da frente de compra (mantida do componente anterior). */
const SHOP_IMAGE = "/images/2026/07/208303-de-que-modo-o-layout-do-armazem-pode-fazer-diferenca.jpg";

/**
 * ShopHero agora é só um invólucro de PageHero.
 *
 * PORQUÊ: os dois componentes faziam exatamente a mesma coisa (imagem Ken
 * Burns + véu + título + apoio + CTAs) com CSS duplicado, e por isso tinham
 * alturas diferentes — 520px aqui contra 340px no PageHero. Era a origem
 * direta do "site com banners de todos os tamanhos". Unificando, existe um
 * único conjunto de variantes de altura.
 *
 * A API pública é a mesma de antes (title, subtitle, actions), então nenhuma
 * página precisa mudar. O `size` foi acrescentado com default "cover" porque
 * /shop é a capa "COMPRAR" da especificação; /categoria-produto é página
 * SECUNDÁRIA e deve receber size="sm".
 */
export default function ShopHero({ title, subtitle, actions = [], size = "cover", image }) {
  return (
    <PageHero
      image={image || SHOP_IMAGE}
      title={title}
      subtitle={subtitle}
      actions={actions}
      size={size}
    />
  );
}
