import Link from "next/link";
import { mainNav } from "@/lib/navigation";
import styles from "./ProductTypes.module.css";

// As 3 categorias e suas subcategorias vivem no menu — reaproveitadas aqui
// para nao existirem duas listas que precisam ser mantidas em sincronia.
const categorias = mainNav.find((item) => item.columns)?.columns ?? [];

const TONS = ["ink", "accent", "bone"];

export default function ProductTypes() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.head}>
          <span className={styles.kicker}>O que circula na RED</span>
          <h2 className={styles.title}>
            Construção, equipamentos e mobiliário — quinze frentes de produto.
          </h2>
        </div>

        <div className={styles.grid}>
          {categorias.map((cat, i) => (
            <article key={cat.label} className={`${styles.card} ${styles[TONS[i]]}`}>
              <header className={styles.cardHead}>
                <span className={styles.index}>{String(i + 1).padStart(2, "0")}.</span>
                <h3 className={styles.cardTitle}>{cat.label}</h3>
              </header>

              <ul className={styles.list}>
                {cat.items
                  .filter((sub) => sub.label !== "Outros")
                  .map((sub) => (
                    <li key={sub.label} className={styles.item}>
                      {sub.label}
                    </li>
                  ))}
              </ul>

              <Link href={cat.href} className={styles.link}>
                Ver categoria
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M5 12h13M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
