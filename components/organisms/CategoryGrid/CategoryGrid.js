import CategoryCard from "@/components/molecules/CategoryCard/CategoryCard";
import { categoryCards } from "@/lib/home";
import styles from "./CategoryGrid.module.css";

/**
 * As três frentes da RED — versão leve, para a home.
 *
 * Revisão do cliente (item 1): a home fica com os cards MENORES, sem as
 * subcategorias, e a página Comprar recebe os cards maiores, com elas. O
 * raciocínio dele: "deixar a home mais leve e levar mais informação para a
 * página Comprar". Quem chega na home precisa entender que existem três
 * frentes; quem já está em Comprar é que quer saber quais são as quinze.
 *
 * Por isso o mapa de subcategorias (que vinha do menu principal) saiu daqui e
 * passou a viver na página Comprar, alimentado pela API. Aqui o card recebe só
 * nome, descrição curta, imagem do produto e CTA.
 *
 * O subtítulo longo também migrou para Comprar: é lá que ele informa alguém
 * que já decidiu comprar. Na home, kicker + título bastam.
 */
export default function CategoryGrid() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.head}>
          <span className={styles.kicker}>Catálogo</span>
          {/* Título próprio, curto. A copy longa ("Encontre ativos para obras,
              empresas e novos projetos" + parágrafo de origem dos ativos) foi
              para a Comprar: repetir a mesma frase nas duas páginas faria a
              segunda parecer a mesma seção outra vez. */}
          <h2 className={styles.title}>Três frentes, um só catálogo.</h2>
        </div>

        <div className={styles.grid}>
          {categoryCards.map((category, i) => (
            <CategoryCard
              key={category.name}
              {...category}
              // Sem `subcategories`: é isso que distingue o card menor do maior.
              index={`${String(i + 1).padStart(2, "0")}.`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
