import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/products";
import ViewCount from "./ViewCount";
import styles from "./ProductCard.module.css";

export default function ProductCard({ product }) {
  const image = product.images[0];
  const category = product.categories[0];
  const href = `/produto/${product.slug}`;

  return (
    <article className={styles.card}>
      <div className={styles.media}>
        <Link href={href} className={styles.mediaLink} aria-label={product.name}>
          {image ? (
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              sizes="(max-width: 767px) 50vw, (max-width: 1024px) 50vw, 25vw"
              className={styles.image}
            />
          ) : null}
        </Link>

        {product.condition ? <span className={styles.badge}>{product.condition}</span> : null}

        {/*
          Visualizações (revisão do cliente, item 33).

          Sobre a imagem, no canto oposto à condição, e não numa linha nova: o
          card tem altura fixa e alinhamento acordado com o cliente ("títulos e
          elementos começando na mesma linha"). Uma linha extra empurraria preço
          e botão para alturas diferentes nos cards que têm contagem e nos que
          ainda não têm — e o `ViewCount` não renderiza nada quando é zero,
          portanto o desalinhamento seria intermitente, que é pior.

          O número já vem no payload do catálogo: não há chamada por card.
        */}
        <ViewCount views={product.views} className={styles.viewsBadge} compacto />
      </div>

      {category ? <span className={styles.category}>{category.name}</span> : null}

      <h3 className={styles.name}>
        <Link href={href} className={styles.nameLink}>
          {product.name}
        </Link>
      </h3>

      <p className={styles.price}>{formatPrice(product.price)}</p>

      <p className={styles.location}>
        {product.location ? `Localização: ${product.location}` : " "}
      </p>

      <Link href={href} className={styles.action}>
        Ver Ativo
      </Link>
    </article>
  );
}
