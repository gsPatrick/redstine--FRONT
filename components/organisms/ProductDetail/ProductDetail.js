import Section from "@/components/atoms/Section/Section";
import Breadcrumb from "@/components/molecules/Breadcrumb/Breadcrumb";
import AcoesDoAtivo from "./AcoesDoAtivo";
import ProductGallery from "@/components/molecules/ProductGallery/ProductGallery";
import Accordion from "@/components/molecules/Accordion/Accordion";
import Abas from "@/components/molecules/Abas/Abas";
import { formatPrice } from "@/lib/products";
import styles from "./ProductDetail.module.css";

/**
 * Página do ativo, na ordem do descritivo novo.
 *
 * A ordem dos blocos não é estética, é a sequência em que o comprador decide, e
 * o cliente escreveu-a explicitamente: categoria, título, código, texto curto,
 * preço, estoque e localização, botões, ações secundárias, acordeões, abas.
 * Mexer na ordem é mexer na decisão — não se reorganiza aqui por conveniência
 * de layout.
 *
 * Quatro regras do documento que o código tem de honrar e que se perdem com
 * facilidade numa refatoração:
 *
 *  1. O título vai em capitalização normal, NUNCA em caixa alta. O acervo vem
 *     do fornecedor em CAIXA ALTA ("CADEIRA GIRATÓRIA PRESIDENTE"), e por isso
 *     o título é normalizado aqui — ver `tituloLegivel`.
 *  2. O código do produto aparece SOZINHO, sem a marca ao lado. A marca já está
 *     na ficha técnica.
 *  3. O texto curto ocupa no máximo três linhas (recorte por CSS, não por
 *     corte de string: cortar o texto perderia palavra num resumo que o
 *     fornecedor escreveu inteiro).
 *  4. Os três acordeões nascem FECHADOS e são mutuamente exclusivos — "quando
 *     um abre o outro fecha". O `Accordion` já se comporta assim; o que mudou
 *     foi tirar o `open: true` do primeiro item.
 *
 * Continua componente de servidor. O que precisa de navegador — galeria,
 * quantidade, consulta, visualizações — está nas ilhas.
 */

/**
 * Título em capitalização normal.
 *
 * Só atua quando o nome vem TODO em caixa alta, que é o caso do catálogo
 * importado. Um nome já escrito corretamente passa intacto — reescrever
 * "Empilhadeira Toyota 8FGU25" estragaria a marca e o modelo.
 *
 * Preserva o que é sigla ou medida (até 3 letras, ou com dígito): "ABS", "220V"
 * e "M3" não viram "Abs", "220v" e "M3". E não capitaliza preposição no meio
 * do nome, que é o que distingue "Mesa de Reunião" de "Mesa De Reunião".
 */
const MINUSCULAS = new Set(["de", "da", "do", "das", "dos", "e", "em", "com", "para", "a", "o"]);

function tituloLegivel(nome) {
  if (!nome) return "";
  const letras = nome.replace(/[^A-Za-zÀ-ÿ]/g, "");
  const todoMaiusculo = letras.length > 3 && letras === letras.toUpperCase();
  if (!todoMaiusculo) return nome;

  return nome
    .toLocaleLowerCase("pt-BR")
    .split(/(\s+)/)
    .map((pedaco, indice) => {
      if (!pedaco.trim()) return pedaco;
      const original = nome.split(/(\s+)/)[indice] || "";
      // Sigla e medida voltam como estavam no original.
      if (/\d/.test(original) || (original.length <= 3 && original === original.toUpperCase())) {
        return original;
      }
      if (indice > 0 && MINUSCULAS.has(pedaco)) return pedaco;
      return pedaco.charAt(0).toLocaleUpperCase("pt-BR") + pedaco.slice(1);
    })
    .join("");
}

export default function ProductDetail({ product }) {
  const category = product.categories[0];
  const whatsapp = `https://wa.me/5521997469757?text=${encodeURIComponent(
    `Olá! Tenho interesse no ativo: ${product.name}`
  )}`;

  const specs = product.attributes.filter((attribute) => attribute.values.length);
  const sobConsulta = Boolean(product.underConsultation);
  const minima = Math.max(1, Number(product.minOrderQuantity || 1));
  const saldo = Number(product.quantity || 0);

  const accordionItems = [
    {
      // Nasce fechado, como os outros dois: o descritivo pede os três fechados
      // na entrada, e quem quer a ficha técnica vai à aba Especificações.
      title: "Características",
      content: specs.length ? (
        <dl className={styles.specs}>
          {specs.map((attribute) => (
            <div key={attribute.name} className={styles.specRow}>
              <dt className={styles.specKey}>{attribute.name}</dt>
              <dd className={styles.specValue}>{attribute.values.join(", ")}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p>As características deste ativo são confirmadas pela RED no atendimento.</p>
      ),
    },
    {
      title: "Condições comerciais",
      content: (
        <>
          <dl className={styles.specs}>
            {product.saleFormatLabel ? (
              <div className={styles.specRow}>
                <dt className={styles.specKey}>Forma de venda</dt>
                <dd className={styles.specValue}>{product.saleFormatLabel}</dd>
              </div>
            ) : null}
            {minima > 1 ? (
              <div className={styles.specRow}>
                <dt className={styles.specKey}>Venda mínima</dt>
                <dd className={styles.specValue}>
                  {minima} {product.unit || "unidade"}
                </dd>
              </div>
            ) : null}
            {saldo > 0 ? (
              <div className={styles.specRow}>
                <dt className={styles.specKey}>Quantidade disponível</dt>
                <dd className={styles.specValue}>
                  {saldo} {product.unit || "unidade"}
                </dd>
              </div>
            ) : null}
            {product.availabilityLabel ? (
              <div className={styles.specRow}>
                <dt className={styles.specKey}>Disponibilidade</dt>
                <dd className={styles.specValue}>{product.availabilityLabel}</dd>
              </div>
            ) : null}
          </dl>
          <p className={styles.acordeaoNota}>
            Disponibilidade, quantidade e condições comerciais são validadas pela RED antes da
            conclusão da compra.
          </p>
        </>
      ),
    },
    {
      title: "Retirada e transporte",
      content: (
        <>
          <p>
            {product.location
              ? `O ativo está em ${product.location} e a retirada é combinada com a equipe da RED.`
              : "A localização do ativo e a retirada são combinadas com a equipe da RED."}
          </p>
          <p className={styles.acordeaoNota}>
            Custos e responsabilidades de retirada, carregamento, transporte ou entrega devem ser
            confirmados antes da conclusão da compra.
          </p>
        </>
      ),
    },
  ];

  const abas = [
    {
      title: "Sobre o produto",
      content: product.description ? (
        <div dangerouslySetInnerHTML={{ __html: product.description }} />
      ) : product.shortDescription ? (
        <p>{product.shortDescription}</p>
      ) : null,
    },
    {
      // Aplicações não é campo próprio do ativo: vive em `attributes` quando a
      // curadoria a escreve. Sem ela, a aba não é renderizada — é o `Abas` que
      // descarta item sem conteúdo.
      title: "Aplicações",
      content: (() => {
        const linha = specs.find((a) => a.name === "Aplicações");
        if (!linha) return null;
        const itens = linha.values.join(";").split(/[;\n]/).map((t) => t.trim()).filter(Boolean);
        return (
          <ul>
            {itens.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        );
      })(),
    },
    {
      title: "Especificações",
      content: specs.length ? (
        <dl className={styles.specs}>
          {specs.map((attribute) => (
            <div key={attribute.name} className={styles.specRow}>
              <dt className={styles.specKey}>{attribute.name}</dt>
              <dd className={styles.specValue}>{attribute.values.join(", ")}</dd>
            </div>
          ))}
        </dl>
      ) : null,
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
          { label: tituloLegivel(product.name) },
        ]}
      />

      <div className={styles.layout}>
        <div className={styles.media}>
          <ProductGallery
            images={product.images}
            name={product.name}
            orientacao="vertical"
            zoom
          />
        </div>

        <div className={styles.info}>
          {category ? <p className={styles.category}>{category.name}</p> : null}

          <h1 className={styles.title}>{tituloLegivel(product.name)}</h1>

          {/* Código sozinho, sem a marca ao lado: a marca está na ficha. */}
          {product.sku ? <p className={styles.codigo}>Código: {product.sku}</p> : null}

          {product.shortDescription ? (
            <p className={styles.summary}>{product.shortDescription}</p>
          ) : null}

          {/* Sob consulta ocupa o MESMO lugar do preço — não há valor a exibir
              porque ele sai da cotação, e um número aqui prometeria um preço
              que não vale. O indicador de oportunidade abaixo é o que a gestão
              escreve, e é por isso que ele não é calculado. */}
          {sobConsulta ? (
            <div className={styles.precoBloco}>
              <p className={`${styles.price} ${styles.priceConsulta}`}>Sob consulta</p>
              {product.consultationNote ? (
                <p className={styles.oportunidade}>{product.consultationNote}</p>
              ) : null}
            </div>
          ) : (
            <div className={styles.precoBloco}>
              <p className={styles.price}>{formatPrice(product.price)}</p>
              {product.onSale && product.regularPrice > 0 ? (
                <p className={styles.oportunidade}>
                  {product.discountPercent ? `${product.discountPercent}% ` : ""}abaixo do preço de
                  mercado ({formatPrice(product.regularPrice)})
                </p>
              ) : null}
            </div>
          )}

          <ul className={styles.meta}>
            {saldo > 0 ? (
              <li className={styles.metaItem}>
                <strong>{saldo}</strong> {product.unit || "unidade"}
                {saldo > 1 ? "s" : ""} em estoque
              </li>
            ) : (
              <li className={`${styles.metaItem} ${styles.metaEsgotado}`}>Esgotado</li>
            )}
            {product.location ? (
              <li className={styles.metaItem}>Retirada em {product.location}</li>
            ) : null}
            {product.condition ? (
              <li className={styles.metaItem}>{product.condition}</li>
            ) : null}
          </ul>

          <AcoesDoAtivo product={product} whatsapp={whatsapp} />

          <Accordion items={accordionItems} />
        </div>
      </div>

      <Abas items={abas} />
    </Section>
  );
}
