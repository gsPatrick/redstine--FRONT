import ProductCard from "@/components/molecules/ProductCard/ProductCard";
import styles from "./ProductGrid.module.css";

export default function ProductGrid({ products, empty = "Nenhum ativo encontrado." }) {
  if (!products.length) {
    return <p className={styles.empty}>{empty}</p>;
  }

  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
