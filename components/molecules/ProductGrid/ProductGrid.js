import ProductCard from "@/components/molecules/ProductCard/ProductCard";
import ProductSkeleton from "@/components/molecules/ProductSkeleton/ProductSkeleton";
import EmptyBlock from "@/components/molecules/EmptyBlock/EmptyBlock";
import styles from "./ProductGrid.module.css";

/**
 * Grade de ativos.
 *
 * Três estados, nunca um espaço em branco:
 *
 *   carregando — esqueletos com a forma e a altura dos cards reais, para a
 *                página não saltar quando os dados chegam;
 *   vazio      — bloco que diz por que não há nada e oferece uma saída;
 *   com dados  — os cards.
 *
 * O estado vazio antes era um parágrafo solto no meio de uma seção larga, o
 * que lia como conteúdo faltando em vez de resposta.
 */
export default function ProductGrid({
  products,
  carregando = false,
  vazio,
  esqueletos = 8,
}) {
  if (carregando) {
    return (
      <div className={styles.grid}>
        <ProductSkeleton quantidade={esqueletos} />
      </div>
    );
  }

  if (!products?.length) {
    return (
      <EmptyBlock
        tipo={vazio?.tipo ?? "busca"}
        titulo={vazio?.titulo ?? "Nenhum ativo encontrado."}
        descricao={
          vazio?.descricao ??
          "Tente remover algum filtro ou buscar por outro termo."
        }
        acao={vazio?.acao}
      />
    );
  }

  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
