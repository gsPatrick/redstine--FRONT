"use client";

import { useState } from "react";
import Button from "@/components/atoms/Button/Button";
import Icon from "@/components/atoms/Icon/Icon";
import AddToCart from "@/components/molecules/AddToCart/AddToCart";
import WishButton from "@/components/molecules/WishButton/WishButton";
import ShareButton from "@/components/molecules/ShareButton/ShareButton";
import ConsultaForm from "@/components/organisms/ConsultaForm/ConsultaForm";
import styles from "./ProductDetail.module.css";

/**
 * Ações do ativo.
 *
 * Extraído do `ProductDetail` porque abrir o painel de consulta exige estado, e
 * a página em si é componente de servidor — o ativo vem da API a cada
 * revalidação e não precisa virar JavaScript no navegador.
 *
 * Duas modalidades, dois caminhos que NÃO se misturam:
 *
 * - Compra direta: adiciona ao carrinho e vai ao checkout.
 * - Sob consulta: não entra no carrinho. O preço depende de quantidade,
 *   retirada e estado do lote, e é fechado numa cotação. Antes isto não era
 *   respeitado: o ativo sob consulta ia ao carrinho e "Sob consulta" aparecia
 *   como forma de pagamento, o que confundia modalidade de compra com meio de
 *   pagamento.
 *
 * A ordem dos botões segue o pedido do cliente: comprar e ver carrinho na
 * primeira linha, e na segunda o WhatsApp entre o coração e o compartilhar,
 * ambos no mesmo formato de ícone.
 */
export default function AcoesDoAtivo({ product, whatsapp }) {
  const [consultando, setConsultando] = useState(false);
  const sobConsulta = Boolean(product.underConsultation);

  return (
    <>
      <div className={styles.actions}>
        {sobConsulta ? (
          <button
            type="button"
            className={styles.consultar}
            onClick={() => setConsultando((v) => !v)}
            aria-expanded={consultando}
          >
            {consultando ? "Fechar consulta" : "Consultar Condições"}
          </button>
        ) : (
          <>
            <AddToCart product={product} withQuantity />
            <Button href="/cart" variant="outline" size="sm">
              Ver Carrinho
            </Button>
          </>
        )}
      </div>

      <div className={styles.actionsSecundarias}>
        <WishButton product={product} size={19} />

        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.whatsapp}
        >
          <Icon name="whatsapp" size={18} />
          {sobConsulta ? "Fale Pelo Whatsapp" : "Compre Pelo Whatsapp"}
        </a>

        <ShareButton
          apenasIcone
          titulo={product.name}
          texto={`Veja este ativo disponível na RED: ${product.name}`}
        />
      </div>

      {consultando && (
        <div className={styles.painelConsulta}>
          <ConsultaForm product={product} aoFechar={() => setConsultando(false)} />
        </div>
      )}
    </>
  );
}
