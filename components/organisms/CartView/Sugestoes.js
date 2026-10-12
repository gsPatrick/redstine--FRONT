"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Icon from "@/components/atoms/Icon/Icon";
import ProductCard from "@/components/molecules/ProductCard/ProductCard";
import { get } from "@/lib/api";
import styles from "./CartView.module.css";

/**
 * "Você também pode se interessar" — três ativos da mesma categoria.
 *
 * Busca no cliente, e não no servidor da página: o carrinho vive no
 * localStorage, logo a categoria de referência só se conhece no navegador. Uma
 * versão de servidor teria de receber a categoria por query string, e o
 * endereço do carrinho passaria a depender do conteúdo dele.
 *
 * Falha em silêncio: a sugestão é um extra. Mostrar "não foi possível carregar
 * sugestões" por cima do carrinho chamaria atenção para o que não importa
 * enquanto o comprador está a decidir o que importa.
 *
 * O que já está no carrinho é excluído — sugerir o item que a pessoa acabou de
 * adicionar é o erro clássico desta faixa.
 */
export default function Sugestoes({ categorySlug, categoria, excluir = [] }) {
  const [itens, setItens] = useState([]);

  useEffect(() => {
    if (!categorySlug) return undefined;
    let vivo = true;

    // Pede mais do que os três que vai mostrar: parte do resultado pode já
    // estar no carrinho, e sem margem a faixa ficaria com um ou dois.
    get(`/assets?category=${encodeURIComponent(categorySlug)}&perPage=8`)
      .then((resposta) => {
        if (!vivo) return;
        // A listagem vem paginada, e `api()` devolve `{ data, meta }` nesse
        // caso; sem paginação devolveria o array direto.
        const lista = (Array.isArray(resposta) ? resposta : resposta?.data || [])
          .filter((p) => !excluir.includes(p.id))
          .slice(0, 3);
        setItens(lista);
      })
      .catch(() => {
        /* sugestão é extra: sem rede, a faixa simplesmente não aparece */
      });

    return () => {
      vivo = false;
    };
    // `excluir` é recriado a cada render do pai; comparar pelo conteúdo evita
    // refazer a busca a cada mudança de quantidade no carrinho.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categorySlug, excluir.join(",")]);

  if (!itens.length) return null;

  return (
    <section className={styles.sugestoes}>
      <header className={styles.sugestoesTopo}>
        <div>
          <h2 className={styles.sugestoesTitulo}>Você também pode se interessar</h2>
          {/* Texto de apoio do descritivo (seção 12), com a categoria dinâmica:
              diz POR QUE estes três e não outros quaisquer. */}
          {categoria ? (
            <p className={styles.sugestoesApoio}>Mais itens de {categoria}</p>
          ) : null}
        </div>
        <Link href={`/categoria-produto/${categorySlug}`} className={styles.verMais}>
          Ver mais produtos
          <Icon name="arrowRight" size={12} />
        </Link>
      </header>

      <div className={styles.sugestoesGrade}>
        {itens.map((produto) => (
          <ProductCard key={produto.id} product={produto} />
        ))}
      </div>
    </section>
  );
}
