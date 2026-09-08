import Image from "next/image";
import styles from "./FeatureCard.module.css";

export default function FeatureCard({ title, description, image, index, align = "start" }) {
  return (
    <article className={`${styles.card} ${styles[align]}`}>
      {image ? (
        <span className={styles.glyph}>
          <Image src={image} alt="" width={64} height={64} className={styles.image} />
        </span>
      ) : null}
      {index ? <span className={styles.index}>{index}</span> : null}
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </article>
  );
}
