import Section from "@/components/atoms/Section/Section";
import Button from "@/components/atoms/Button/Button";
import Icon from "@/components/atoms/Icon/Icon";
import Breadcrumb from "@/components/molecules/Breadcrumb/Breadcrumb";
import AddToCart from "@/components/molecules/AddToCart/AddToCart";
import WishButton from "@/components/molecules/WishButton/WishButton";
import ShareButton from "@/components/molecules/ShareButton/ShareButton";
import ProductGallery from "@/components/molecules/ProductGallery/ProductGallery";
import Accordion from "@/components/molecules/Accordion/Accordion";
import { formatPrice } from "@/lib/products";
import styles from "./ProductDetail.module.css";

export default function ProductDetail({ product }) {
  const category = product.categories[0];
  const whatsapp = `https://wa.me/5521997469757?text=${encodeURIComponent(
    `Olá! Tenho interesse no ativo: ${product.name}`
  )}`;

  const specs = product.attributes.filter((attribute) => attribute.values.length);

  const accordionItems = [
    {
      title: "Características e especificações",
      open: true,
      content: (
        <dl className={styles.specs}>
          {specs.map((attribute) => (
            <div key={attribute.name} className={styles.specRow}>
              <dt className={styles.specKey}>{attribute.name}</dt>
              <dd className={styles.specValue}>{attribute.values.join(", ")}</dd>
            </div>
          ))}
        </dl>
      ),
    },
    {
      title: "Disponibilidade e negociação",
      content: (
        <p>
          Disponibilidade, quantidade e condições comerciais são validadas pela RED antes da
          conclusão da compra.
        </p>
      ),
    },
    {
      title: "Retirada e transporte",
      content: (
        <p>
          Custos e responsabilidades de retirada, carregamento, transporte ou entrega devem ser
          confirmados antes da conclusão da compra.
        </p>
      ),
    },
  ];

  return (
    <Section tone="light" innerClassName={styles.inner}>
      <Breadcrumb
        items={[
          { label: "Início", href: "/" },
          { label: "Catálogo", href: "/shop" },
          ...(category
            ? [{ label: category.name, href: `/categoria-produto/${category.slug}` }]
            : []),
          { label: product.name },
        ]}
      />

      <div className={styles.layout}>
        <div className={styles.media}>
          <ProductGallery images={product.images} name={product.name} />
        </div>

        <div className={styles.info}>
          {category ? <p className={styles.category}>{category.name}</p> : null}

          <h1 className={styles.title}>{product.name}</h1>

          <ul className={styles.meta}>
            {product.condition ? (
              <li className={styles.metaItem}>Condição: {product.condition}</li>
            ) : null}
            {product.location ? (
              <li className={styles.metaItem}>Localização: {product.location}</li>
            ) : null}
            {product.brand ? <li className={styles.metaItem}>Marca: {product.brand}</li> : null}
          </ul>

          <p className={styles.price}>{formatPrice(product.price)}</p>

          {product.shortDescription ? (
            <p className={styles.summary}>{product.shortDescription}</p>
          ) : null}

          <div className={styles.actions}>
            <AddToCart product={product} withQuantity />
            <WishButton product={product} size={19} />
            {/* Compartilhar o ativo: um lote interessa a mais de uma pessoa
                dentro da mesma empresa, e o link precisa circular. */}
            <ShareButton
              titulo={product.name}
              texto={`Veja este ativo disponível na RED: ${product.name}`}
            />
          </div>

          <div className={styles.actions}>
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.whatsapp}
            >
              <Icon name="whatsapp" size={18} />
              Compre Pelo Whatsapp
            </a>
            <Button href="/cart" variant="outline" size="sm">
              Ver Carrinho
            </Button>
          </div>

          <Accordion items={accordionItems} />
        </div>
      </div>

      {product.description ? (
        <div className={styles.about}>
          <h2 className={styles.aboutTitle}>Sobre este ativo</h2>
          <div
            className={styles.aboutBody}
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </div>
      ) : null}
    </Section>
  );
}
