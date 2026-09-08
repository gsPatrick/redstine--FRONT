import Link from "next/link";
import PanelIcon from "../../atoms/PanelIcon/PanelIcon";
import styles from "./PanelBreadcrumb.module.css";

export default function PanelBreadcrumb({ itens = [], className = "" }) {
  return (
    <nav className={`${styles.trilha} ${className}`} aria-label="Você está aqui">
      {itens.map((item, i) => (
        <span key={item.label} className={styles.item}>
          {i > 0 && <PanelIcon name="chevronRight" size={12} className={styles.sep} />}
          {item.href && i < itens.length - 1 ? (
            <Link href={item.href}>{item.label}</Link>
          ) : (
            <span aria-current="page">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
