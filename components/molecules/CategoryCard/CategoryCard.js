import Link from "next/link";
import Image from "next/image";
import styles from "./CategoryCard.module.css";

/**
 * Card de categoria.
 *
 * Duas mudanças pedidas na revisão de layout V2:
 *
 * 1. Contorno colorido em vez de fundo chapado — uma cor da marca por
 *    categoria. Fundo cheio pesava e competia com as imagens; o contorno dá
 *    identidade sem encher a página de blocos de cor.
 * 2. As subcategorias entram aqui. Com elas dentro do card, o bloco separado
 *    que repetia as três categorias só para listar as quinze frentes deixou de
 *    ter função — e foi removido.
 */
export default function CategoryCard({
  name,
  description,
  cta,
  href,
  image,
  brand = "red",
  index,
  subcategories = [],
}) {
  return (
    <Link href={href} className={`${styles.card} ${styles[brand]}`}>
      <div className={styles.tile}>
        <Image
          src={image}
          alt=""
          width={640}
          height={640}
          sizes="(max-width: 900px) 90vw, 30vw"
          className={styles.image}
        />
      </div>

      <div className={styles.body}>
        {index ? <span className={styles.index}>{index}</span> : null}
        <h3 className={styles.title}>{name}</h3>
        <p className={styles.description}>{description}</p>

        {subcategories.length > 0 && (
          <ul className={styles.subs}>
            {subcategories.map((sub) => (
              <li key={sub}>{sub}</li>
            ))}
          </ul>
        )}

        <span className={styles.cta}>
          {cta}
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M5 12h13M13 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </Link>
  );
}
