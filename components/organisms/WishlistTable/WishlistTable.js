"use client";

import Link from "next/link";
import Image from "next/image";
import Section from "@/components/atoms/Section/Section";
import SectionTitle from "@/components/atoms/SectionTitle/SectionTitle";
import Icon from "@/components/atoms/Icon/Icon";
import Button from "@/components/atoms/Button/Button";
import { useStore } from "@/lib/StoreContext";
import { formatPrice } from "@/lib/products";
import styles from "./WishlistTable.module.css";

function Table() {
  const { wishlist, toggleWishlist, addToCart, ready } = useStore();

  if (!ready) return <p className={styles.empty}>Carregando…</p>;

  if (!wishlist.length) {
    return (
      <div className={styles.emptyBox}>
        <p className={styles.empty}>Nenhum produto foi adicionado à lista de desejos</p>
        <Button href="/shop" variant="dark" size="sm">
          Explorar Ativos
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.scroller}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col" className={styles.head}>
              Nome do produto
            </th>
            <th scope="col" className={styles.head}>
              Preço unitário
            </th>
            <th scope="col" className={styles.head}>
              Status do estoque
            </th>
            <th scope="col" className={styles.head} />
          </tr>
        </thead>
        <tbody>
          {wishlist.map((item) => (
            <tr key={item.id}>
              <td className={styles.cell}>
                <div className={styles.product}>
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt=""
                      width={64}
                      height={64}
                      className={styles.thumb}
                    />
                  ) : null}
                  <Link href={`/produto/${item.slug}`} className={styles.name}>
                    {item.name}
                  </Link>
                </div>
              </td>
              <td className={styles.cell}>{formatPrice(item.price)}</td>
              <td className={styles.cell}>
                <span className={item.inStock ? styles.inStock : styles.outStock}>
                  {item.inStock ? "Em estoque" : "Indisponível"}
                </span>
              </td>
              <td className={styles.cell}>
                <div className={styles.actions}>
                  <button
                    type="button"
                    className={styles.cart}
                    onClick={() =>
                      addToCart(
                        {
                          id: item.id,
                          slug: item.slug,
                          name: item.name,
                          price: item.price,
                          images: item.image ? [{ src: item.image }] : [],
                          condition: null,
                          location: null,
                        },
                        1
                      )
                    }
                  >
                    <Icon name="cart" size={14} />
                    Adicionar
                  </button>
                  <button
                    type="button"
                    className={styles.remove}
                    onClick={() => toggleWishlist({ ...item, images: [] })}
                    aria-label={`Remover ${item.name}`}
                  >
                    <Icon name="close" size={13} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function WishlistTable({ bare = false }) {
  if (bare) {
    return (
      <>
        <h3 className={styles.bareTitle}>Minha lista de desejos</h3>
        <Table />
      </>
    );
  }

  return (
    <Section tone="light">
      <SectionTitle title="Minha lista de desejos" align="start" />
      <Table />
    </Section>
  );
}
