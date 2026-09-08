import Button from "@/components/atoms/Button/Button";
import styles from "./ModelCard.module.css";

export default function ModelCard({ title, description, cta, href, image }) {
  return (
    <article className={styles.card} style={image ? { backgroundImage: `url(${image})` } : undefined}>
      <span className={styles.veil} aria-hidden="true" />
      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
        <div className={styles.action}>
          <Button href={href} variant="dark" size="sm">
            {cta}
          </Button>
        </div>
      </div>
    </article>
  );
}
