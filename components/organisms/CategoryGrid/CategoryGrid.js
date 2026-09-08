import CategoryCard from "@/components/molecules/CategoryCard/CategoryCard";
import { categoryCards } from "@/lib/home";
import { mainNav } from "@/lib/navigation";
import styles from "./CategoryGrid.module.css";

/**
 * As três frentes da RED.
 *
 * Cada card carrega as próprias subcategorias — assim o bloco apresenta, de uma
 * vez, as 3 categorias e as 15 frentes de produto. Era isso que o bloco
 * seguinte fazia sozinho, repetindo as mesmas três categorias; ele saiu.
 *
 * As subcategorias saem do menu principal para não existirem duas listas que
 * precisem ser mantidas em sincronia.
 */
const subcategoriasPorCategoria = Object.fromEntries(
  (mainNav.find((item) => item.columns)?.columns ?? []).map((col) => [
    col.label,
    // "Outros" fica de fora: é um destino do catálogo, não uma frente de
    // produto que valha anunciar na home.
    col.items.filter((sub) => sub.label !== "Outros").map((sub) => sub.label),
  ])
);

export default function CategoryGrid() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.head}>
          <span className={styles.kicker}>Catálogo</span>
          <h2 className={styles.title}>
            Encontre ativos para obras, empresas e novos projetos.
          </h2>
          <p className={styles.subtitle}>
            Materiais, equipamentos e mobiliário provenientes de estoques, obras, reformas,
            desmobilizações e operações corporativas.
          </p>
        </div>

        <div className={styles.grid}>
          {categoryCards.map((category, i) => (
            <CategoryCard
              key={category.name}
              {...category}
              subcategories={subcategoriasPorCategoria[category.name] ?? []}
              index={`${String(i + 1).padStart(2, "0")}.`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
