import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/products";
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
