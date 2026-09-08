import Link from "next/link";
import styles from "./Breadcrumb.module.css";

export default function Breadcrumb({ items }) {
  return (
    <nav className={styles.crumbs} aria-label="Navegação estrutural">
      <ol className={styles.list}>
        {items.map((item, index) => (
          <li key={item.label} className={styles.item}>
            {item.href && index < items.length - 1 ? (
              <Link href={item.href} className={styles.link}>
                {item.label}
              </Link>
            ) : (
              <span className={styles.current}>{item.label}</span>
            )}
            {index < items.length - 1 ? (
              <span className={styles.sep} aria-hidden="true">
                /
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}
