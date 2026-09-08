import styles from "./ListCard.module.css";

export default function ListCard({ title, items, lead }) {
  return (
    <article className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      {lead ? <p className={styles.lead}>{lead}</p> : null}
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item} className={styles.item}>
            <span className={styles.dot} aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}
