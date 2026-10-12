"use client";

import { useState } from "react";
import Icon from "@/components/atoms/Icon/Icon";
import AddToCart from "@/components/molecules/AddToCart/AddToCart";
import WishButton from "@/components/molecules/WishButton/WishButton";
import ShareButton from "@/components/molecules/ShareButton/ShareButton";
import VisualizacoesDoAtivo from "@/components/molecules/ProductCard/VisualizacoesDoAtivo";
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
 *  - Compra direta: adiciona ao carrinho e vai ao checkout.
 *  - Sob consulta: não entra no carrinho. O preço depende de quantidade,
 *    retirada e estado do lote, e é fechado numa cotação. Antes isto não era
 *    respeitado: o ativo sob consulta ia ao carrinho e "Sob consulta" aparecia
 *    como forma de pagamento, o que confundia modalidade de compra com meio de
 *    pagamento.
 *
 * O descritivo novo separa duas faixas, e a separação é o ponto:
 *
 *  1. AÇÕES PRINCIPAIS — o CTA da modalidade e, ao lado, o WhatsApp verde. O
 *     verde fica porque é o canal por onde a RED negocia, e não é concorrente
 *     do CTA: é o caminho de quem tem dúvida antes de decidir.
 *  2. AÇÕES SECUNDÁRIAS — cartões SÓ DE ÍCONE: favoritar, compartilhar e a
 *     contagem de visualizações. Mesmo tamanho e mesma moldura nos três, porque
 *     é uma faixa só e três formas diferentes lê-se como três importâncias
 *     diferentes.
 */
export default function AcoesDoAtivo({ product, whatsapp }) {
  const [consultando, setConsultando] = useState(false);
  const sobConsulta = Boolean(product.underConsultation);

  return (
    <>
      <div className={styles.actions}>
        {sobConsulta ? (
          <div className={styles.consultaBloco}>
            <button
              type="button"
              className={styles.consultar}
              onClick={() => setConsultando((v) => !v)}
              aria-expanded={consultando}
            >
              {consultando ? "Fechar consulta" : "Faça sua consulta"}
            </button>
            {/* Linha de apoio do próprio CTA, como o descritivo pede: diz o que
                acontece depois do clique, em vez de deixar o comprador supor
                que está a comprar. */}
            <p className={styles.consultarApoio}>Tire suas dúvidas com nossa equipe</p>
          </div>
        ) : (
          <AddToCart product={product} withQuantity comIrParaCarrinho />
        )}

        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.whatsapp}
        >
          <Icon name="whatsapp" size={18} />
          {sobConsulta ? "Falar no WhatsApp" : "Comprar pelo WhatsApp"}
        </a>
      </div>

      {consultando && (
        <div className={styles.painelConsulta}>
          <ConsultaForm product={product} aoFechar={() => setConsultando(false)} />
        </div>
      )}

      <div className={styles.actionsSecundarias}>
        <div className={styles.cartaoAcao}>
          <WishButton product={product} size={17} />
        </div>

        <div className={styles.cartaoAcao}>
          <ShareButton
            apenasIcone
            titulo={product.name}
            texto={`Veja este ativo disponível na RED: ${product.name}`}
          />
        </div>

        {/* Ilha que registra a visita e mostra o total. Fica na faixa das ações
            secundárias porque é informação sobre o ativo, não ação do
            comprador — mas o descritivo pede os três no mesmo formato. */}
        <div className={`${styles.cartaoAcao} ${styles.cartaoViews}`}>
          <Icon name="eye" size={15} />
          <VisualizacoesDoAtivo assetId={product.id} views={product.views} compacto sempre />
        </div>
      </div>
    </>
  );
}
