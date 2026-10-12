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

/**
 * Campos da ficha que NÃO pertencem ao card "Características".
 *
 * O descritivo (seção 5) é explícito: o card leva "somente informações próprias
 * do produto". Localização é do card de retirada, e forma de venda,
 * disponibilidade, quantidade, estoque e venda mínima são do card de condições
 * comerciais. Despejar a ficha inteira nos três cards repetia a mesma linha em
 * dois lugares, que é o que a seção 14 manda evitar.
 */
const FORA_DE_CARACTERISTICAS = new Set([
  "Localização",
  "Forma de venda",
  "Disponibilidade",
  "Quantidade disponível",
  "Estoque",
  "Venda mínima",
]);

/** Lista campo-à-esquerda / valor-à-direita, o formato que o documento pede. */
function Lista({ linhas, styles: estilos }) {
  const validas = linhas.filter(([, valor]) => valor !== null && valor !== undefined && valor !== "");
  if (!validas.length) return null;
  return (
    <dl className={estilos.specs}>
      {validas.map(([campo, valor]) => (
        <div key={campo} className={estilos.specRow}>
          <dt className={estilos.specKey}>{campo}</dt>
          <dd className={estilos.specValue}>{valor}</dd>
        </div>
      ))}
    </dl>
  );
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

  // Só o que é do PRÓPRIO produto: condição, tipo, material, cor, tamanho,
  // marca e os campos técnicos. O resto da ficha pertence aos outros dois cards.
  const caracteristicas = specs.filter((a) => !FORA_DE_CARACTERISTICAS.has(a.name));

  const loteFechado = product.saleFormatLabel === "Lote";

  const accordionItems = [
    {
      // Nasce fechado, como os outros dois: o descritivo pede os três fechados
      // na entrada, e quem quer a ficha completa vai à aba Especificações.
      title: "Características",
      content: caracteristicas.length ? (
        <Lista
          linhas={caracteristicas.map((a) => [a.name, a.values.join(", ")])}
          styles={styles}
        />
      ) : (
        <p>As características deste ativo são confirmadas pela RED no atendimento.</p>
      ),
    },
    {
      // Campos do descritivo, seção 6. "Possibilidade de negociação", "Reserva"
      // e "Garantia" são as mesmas regras para todo o acervo — não são campo do
      // ativo, são a política da RED escrita onde o comprador pergunta.
      title: "Condições comerciais",
      content: (
        <>
          <Lista
            linhas={[
              ["Unidade de venda", product.saleFormatLabel || product.unit || "Unidade"],
              [
                "Venda mínima",
                minima > 1 ? `${minima} ${product.unit || "unidade"}` : "1 unidade",
              ],
              // Lote fechado tem de ficar EXPLÍCITO (seção 7 do descritivo):
              // quem compra um lote não escolhe a quantidade.
              loteFechado
                ? ["Lote fechado", "O lote é vendido inteiro, sem fracionamento."]
                : null,
              [
                "Possibilidade de negociação",
                "Entre em contato com nossa equipe e veja a possibilidade de negociação.",
              ],
              ["Reserva do produto", "Sujeito à disponibilidade em estoque."],
              [
                "Garantia",
                product.conditionKey === "sem_uso"
                  ? "Ativo sem uso. Eventual garantia de fábrica é confirmada no atendimento."
                  : "Ativo usado, vendido no estado em que se encontra, sem garantia.",
              ],
            ].filter(Boolean)}
            styles={styles}
          />
          <p className={styles.acordeaoNota}>
            Disponibilidade, quantidade e condições comerciais são validadas pela RED antes da
            conclusão da compra.
          </p>
        </>
      ),
    },
    {
      // Campos do descritivo, seção 8. A RED não tem frete integrado, prazo de
      // entrega nem transportadora própria, e o documento manda não apresentar
      // nada disso — por isso aqui só há retirada.
      title: "Retirada e transporte",
      content: (
        <>
          <Lista
            linhas={[
              [
                "Local de retirada",
                product.location
                  ? `${product.location}. O endereço completo é confirmado após a compra.`
                  : "Confirmado pela equipe da RED após a compra.",
              ],
              [
                "Retirada no local",
                "O comprador retira o ativo no local indicado, em data combinada com a equipe.",
              ],
              ["Transporte", "O transporte é de responsabilidade do comprador."],
              [
                "Carregamento",
                "O apoio ao carregamento depende do local e é confirmado no agendamento.",
              ],
              ["Agendamento", "A retirada deve ser agendada previamente com a equipe da RED."],
              ["Dúvidas", "Fale com a nossa equipe pelo WhatsApp antes de agendar."],
            ]}
            styles={styles}
          />
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
      // Vem de `attributes.aplicacoes`, escrito na gestão. Sem ele a aba não é
      // renderizada — é o `Abas` que descarta item sem conteúdo, e aba vazia é
      // pior do que aba ausente.
      title: "Aplicações",
      content: product.applications?.length ? (
        <ul>
          {product.applications.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null,
    },
    {
      // A ficha COMPLETA, incluindo o que o card "Características" deixou de
      // fora: é aqui que o descritivo põe "as especificações detalhadas".
      title: "Especificações",
      content: specs.length ? (
        <Lista linhas={specs.map((a) => [a.name, a.values.join(", ")])} styles={styles} />
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
            /* O indicador fica AO LADO de "Sob consulta", como o descritivo
               pede (seção 10), e não abaixo: abaixo é onde mora o estoque. */
            <div className={`${styles.precoBloco} ${styles.precoLinha}`}>
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
