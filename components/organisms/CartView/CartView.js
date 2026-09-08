"use client";

import Link from "next/link";
import Image from "next/image";
import Section from "@/components/atoms/Section/Section";
import SectionTitle from "@/components/atoms/SectionTitle/SectionTitle";
import Button from "@/components/atoms/Button/Button";
import Icon from "@/components/atoms/Icon/Icon";
import { useStore } from "@/lib/StoreContext";
import { formatPrice } from "@/lib/products";
import styles from "./CartView.module.css";

export default function CartView() {
  const { cart, cartTotal, setQuantity, removeFromCart, clearCart, ready } = useStore();

  if (!ready) {
    return (
      <Section tone="light">
        <p className={styles.loading}>Carregando carrinho…</p>
      </Section>
    );
  }

  if (!cart.length) {
    return (
      <Section tone="light">
        <SectionTitle title="Seu carrinho está vazio" />
        <div className={styles.emptyAction}>
          <Button href="/shop" variant="dark">
            Explorar Ativos
          </Button>
        </div>
      </Section>
    );
  }

  return (
    <Section tone="light">
      <SectionTitle title="Carrinho" align="start" />

      <div className={styles.layout}>
        <div className={styles.lines}>
          {cart.map((line) => (
            <article key={line.id} className={styles.line}>
              <Link href={`/produto/${line.slug}`} className={styles.media}>
                {line.image ? (
                  <Image
                    src={line.image}
                    alt={line.name}
                    width={140}
                    height={140}
                    className={styles.image}
                  />
                ) : null}
              </Link>

              <div className={styles.body}>
                <h3 className={styles.name}>
                  <Link href={`/produto/${line.slug}`}>{line.name}</Link>
                </h3>
                {line.condition ? (
                  <p className={styles.meta}>Condição: {line.condition}</p>
                ) : null}
                {line.location ? (
                  <p className={styles.meta}>Localização: {line.location}</p>
                ) : null}
                <p className={styles.unit}>{formatPrice(line.price)} / un.</p>
              </div>

              <div className={styles.controls}>
                <div className={styles.stepper}>
                  <button
                    type="button"
                    className={styles.step}
                    onClick={() => setQuantity(line.id, line.quantity - 1)}
                    aria-label="Diminuir"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    className={styles.quantity}
                    value={line.quantity}
                    onChange={(event) =>
                      setQuantity(line.id, Math.max(1, Number(event.target.value) || 1))
                    }
                    aria-label={`Quantidade de ${line.name}`}
                  />
                  <button
                    type="button"
                    className={styles.step}
                    onClick={() => setQuantity(line.id, line.quantity + 1)}
                    aria-label="Aumentar"
                  >
                    +
                  </button>
                </div>

                <p className={styles.lineTotal}>{formatPrice(line.price * line.quantity)}</p>

                <button
                  type="button"
                  className={styles.remove}
                  onClick={() => removeFromCart(line.id)}
                  aria-label={`Remover ${line.name}`}
                >
                  <Icon name="close" size={13} />
                </button>
              </div>
            </article>
          ))}

          <button type="button" className={styles.clear} onClick={clearCart}>
            Esvaziar carrinho
          </button>
        </div>

        <aside className={styles.summary}>
          <h3 className={styles.summaryTitle}>Resumo</h3>

          <dl className={styles.rows}>
            <div className={styles.row}>
              <dt>Subtotal</dt>
              <dd>{formatPrice(cartTotal)}</dd>
            </div>
            <div className={styles.row}>
              <dt>Retirada</dt>
              <dd className={styles.muted}>A combinar</dd>
            </div>
          </dl>

          <div className={styles.total}>
            <span>Total</span>
            <strong>{formatPrice(cartTotal)}</strong>
          </div>

          <p className={styles.note}>
            Custos e responsabilidades de retirada, carregamento e transporte são confirmados
            antes da conclusão da compra.
          </p>

          <div className={styles.summaryActions}>
            <Button href="/checkout" variant="dark">
              Finalizar compra
            </Button>
            <Button href="/shop" variant="outline" size="sm">
              Continuar comprando
            </Button>
          </div>
        </aside>
      </div>
    </Section>
  );
}
