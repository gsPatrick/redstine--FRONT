"use client";

import Link from "next/link";
import Image from "next/image";
import Section from "@/components/atoms/Section/Section";
import SectionTitle from "@/components/atoms/SectionTitle/SectionTitle";
import Button from "@/components/atoms/Button/Button";
import Icon from "@/components/atoms/Icon/Icon";
import QuantidadeSeletor from "@/components/molecules/QuantidadeSeletor/QuantidadeSeletor";
import FaixaBeneficios from "@/components/molecules/FaixaBeneficios/FaixaBeneficios";
import Sugestoes from "./Sugestoes";
import { useStore } from "@/lib/StoreContext";
import { formatPrice } from "@/lib/products";
import styles from "./CartView.module.css";

/**
 * Carrinho, no formato do descritivo novo.
 *
 * Duas colunas: as linhas à esquerda, o resumo do pedido fixo à direita. Cada
 * linha é um cartão HORIZONTAL que repete o que a página do produto mostrava —
 * categoria, nome, código, condição, localização, estado de estoque, preço
 * unitário e total da linha. A razão é concreta: o carrinho é a última tela
 * antes de se comprometer, e voltar à página do produto para conferir o código
 * do ativo é onde a compra se perde.
 *
 * Três regras do documento que o código precisa de honrar:
 *
 *  1. O seletor de quantidade respeita a VENDA MÍNIMA, igual à da página do
 *     produto. É o mesmo componente, e o `StoreContext` reaplica o limite —
 *     porque a linha do carrinho vive no localStorage e pode ter sido gravada
 *     antes de a mínima mudar.
 *  2. Cada linha tem "Salvar para depois" e "Excluir". Salvar move o item para
 *     uma lista separada: continuar no carrinho com um sinalizador faria o
 *     subtotal somar o que o comprador tirou do pedido.
 *  3. Há um respiro GRANDE antes de "Você também pode se interessar". É
 *     deliberado no documento: sem ele a faixa de sugestão encosta no carrinho
 *     e lê-se como parte do pedido.
 */
export default function CartView() {
  const {
    cart,
    saved,
    cartTotal,
    setQuantity,
    removeFromCart,
    saveForLater,
    moveToCart,
    removeSaved,
    clearCart,
    ready,
  } = useStore();

  if (!ready) {
    return (
      <Section tone="light">
        <p className={styles.loading}>Carregando carrinho…</p>
      </Section>
    );
  }

  if (!cart.length && !saved.length) {
    return (
      <Section tone="light">
        {/* Estado vazio: o texto e a unica coisa na tela, e encosta-lo na
            borda parece defeito. Centralizar aqui e deliberado. */}
        <SectionTitle title="Seu carrinho está vazio" align="center" />
        <div className={styles.emptyAction}>
          <Button href="/shop" variant="dark">
            Começar a comprar
          </Button>
        </div>
      </Section>
    );
  }

  // Categoria de referência das sugestões: a do primeiro item. Não é a mais
  // frequente de propósito — um carrinho de dois itens de categorias
  // diferentes não tem "a mais frequente", e o primeiro é o que o comprador
  // escolheu primeiro.
  const categoriaRef = cart.find((l) => l.categorySlug)?.categorySlug || null;
  const idsNoCarrinho = cart.map((l) => l.id);
  const totalItens = cart.reduce((n, l) => n + l.quantity, 0);

  return (
    <Section tone="light">
      <SectionTitle title="Carrinho" align="start" />

      <div className={styles.layout}>
        <div className={styles.lines}>
          <p className={styles.contagem}>
            {totalItens} {totalItens === 1 ? "item" : "itens"} no carrinho
          </p>

          {cart.map((line) => (
            <Linha
              key={line.id}
              line={line}
              setQuantity={setQuantity}
              removeFromCart={removeFromCart}
              saveForLater={saveForLater}
            />
          ))}

          {cart.length > 1 ? (
            <button type="button" className={styles.clear} onClick={clearCart}>
              Esvaziar carrinho
            </button>
          ) : null}

          {saved.length ? (
            <section className={styles.salvos}>
              <h2 className={styles.salvosTitulo}>
                Salvos para depois ({saved.length})
              </h2>

              {saved.map((line) => (
                <article key={line.id} className={`${styles.line} ${styles.lineSalva}`}>
                  <Link href={`/produto/${line.slug}`} className={styles.media}>
                    {line.image ? (
                      <Image
                        src={line.image}
                        alt={line.name}
                        width={110}
                        height={110}
                        className={styles.image}
                      />
                    ) : null}
                  </Link>

                  <div className={styles.body}>
                    <h3 className={styles.name}>
                      <Link href={`/produto/${line.slug}`}>{line.name}</Link>
                    </h3>
                    {line.sku ? <p className={styles.codigo}>Código: {line.sku}</p> : null}
                    {!line.underConsultation ? (
                      <p className={styles.unit}>{formatPrice(line.price)} / {line.unit || "un."}</p>
                    ) : null}
                  </div>

                  <div className={styles.controls}>
                    <button
                      type="button"
                      className={styles.linkAcao}
                      onClick={() => moveToCart(line.id)}
                    >
                      Mover para o carrinho
                    </button>
                    <button
                      type="button"
                      className={styles.linkAcao}
                      onClick={() => removeSaved(line.id)}
                    >
                      Excluir
                    </button>
                  </div>
                </article>
              ))}
            </section>
          ) : null}
        </div>

        <aside className={styles.summary}>
          <h2 className={styles.summaryTitle}>Resumo do pedido</h2>

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

          <div className={styles.summaryActions}>
            {/* Sem itens ATIVOS (só salvos para depois) não há o que finalizar.
                O botão não fica desativado: ele sai, e no lugar entra a frase
                que diz o que falta. Um `<a>` desativado continua clicável e
                levaria o comprador a um checkout vazio. */}
            {cart.length ? (
              <Button href="/checkout" variant="dark">
                Finalizar compra
              </Button>
            ) : (
              <p className={styles.semItens}>
                Mova um item salvo para o carrinho para finalizar a compra.
              </p>
            )}
            <Button href="/shop" variant="outline" size="sm">
              Continuar comprando
            </Button>
          </div>

          {/* Cartões informativos do resumo: o descritivo pede estes dois, e
              nesta ordem. Ficam DEPOIS do CTA porque respondem à dúvida de
              quem já está com o dedo no botão. */}
          <div className={styles.cartaoInfo}>
            <span className={styles.cartaoIcone} aria-hidden="true">
              <Icon name="shield" size={15} />
            </span>
            <div>
              <strong>Compra segura</strong>
              <p>
                O pedido é registrado e acompanhado pela equipe da RED até a conclusão.
              </p>
            </div>
          </div>

          <div className={styles.cartaoInfo}>
            <span className={styles.cartaoIcone} aria-hidden="true">
              <Icon name="truck" size={15} />
            </span>
            <div>
              <strong>Retirada e transporte</strong>
              <p>
                Custos e responsabilidades de retirada, carregamento e transporte são
                confirmados antes da conclusão da compra.
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* O respiro grande daqui para baixo é pedido no documento. */}
      <Sugestoes categorySlug={categoriaRef} excluir={idsNoCarrinho} />

      <FaixaBeneficios className={styles.beneficios} />
    </Section>
  );
}

/**
 * Linha do carrinho.
 *
 * Separada porque é um cartão com oito informações e dois controles, e inline
 * empurrava o resto da tela para fora do campo de visão de quem lê o ficheiro.
 */
function Linha({ line, setQuantity, removeFromCart, saveForLater }) {
  const minima = Math.max(1, Number(line.minOrderQuantity || 1));
  const saldo = Number.isFinite(Number(line.stock)) && Number(line.stock) > 0
    ? Number(line.stock)
    : null;

  return (
    <article className={styles.line}>
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
        {line.category ? <p className={styles.categoria}>{line.category}</p> : null}

        <h3 className={styles.name}>
          <Link href={`/produto/${line.slug}`}>{line.name}</Link>
        </h3>

        {line.sku ? <p className={styles.codigo}>Código: {line.sku}</p> : null}

        <ul className={styles.metaLinha}>
          {line.condition ? <li>{line.condition}</li> : null}
          {line.location ? <li>Retirada em {line.location}</li> : null}
          <li className={line.inStock === false ? styles.semEstoque : styles.comEstoque}>
            {line.inStock === false
              ? "Indisponível"
              : saldo
                ? `${saldo} ${line.unit || "unidade"}${saldo > 1 ? "s" : ""} em estoque`
                : "Em estoque"}
          </li>
        </ul>

        {line.underConsultation ? (
          <p className={styles.sobConsulta}>
            Negociado sob consulta. Remova daqui e use{" "}
            <Link href={`/produto/${line.slug}`}>Faça sua consulta</Link> na página do ativo.
          </p>
        ) : null}

        <div className={styles.acoesLinha}>
          <button
            type="button"
            className={styles.linkAcao}
            onClick={() => saveForLater(line.id)}
          >
            Salvar para depois
          </button>
          <button
            type="button"
            className={styles.linkAcao}
            onClick={() => removeFromCart(line.id)}
          >
            Excluir
          </button>
        </div>
      </div>

      <div className={styles.controls}>
        {line.underConsultation ? null : (
          <>
            <p className={styles.lineTotal}>{formatPrice(line.price * line.quantity)}</p>
            <p className={styles.unit}>
              {formatPrice(line.price)} / {line.unit || "un."}
            </p>
          </>
        )}

        <QuantidadeSeletor
          valor={line.quantity}
          minimo={minima}
          maximo={saldo}
          aoMudar={(q) => setQuantity(line.id, q)}
          rotulo={`Quantidade de ${line.name}`}
          styles={styles}
        />

        {minima > 1 ? <p className={styles.minima}>Mínimo: {minima}</p> : null}
      </div>
    </article>
  );
}
