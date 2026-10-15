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
/** Botão do WhatsApp — o mesmo nas duas modalidades, e por isso num lugar só. */
function Whats({ href }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={styles.whatsapp}>
      <Icon name="whatsapp" size={18} />
      {/* Rótulo do descritivo, igual nas duas modalidades. */}
      Compre pelo WhatsApp
    </a>
  );
}

export default function AcoesDoAtivo({ product, whatsapp }) {
  const [consultando, setConsultando] = useState(false);
  const sobConsulta = Boolean(product.underConsultation);

  return (
    <>
      {sobConsulta ? (
        <div className={styles.actions}>
          {/*
            O CTA de consulta é VAZADO, com o título e a linha de apoio DENTRO
            dele — é assim no protótipo, e a razão é de equilíbrio: ao lado do
            WhatsApp verde preenchido, um vermelho também preenchido daria dois
            botões a gritar o mesmo volume. O vazado sobre fundo rosa claro
            mantém o vermelho como cor da ação sem disputar com o verde.
          */}
          <button
            type="button"
            className={styles.consultar}
            onClick={() => setConsultando((v) => !v)}
            aria-expanded={consultando}
          >
            <Icon name="comment" size={17} className={styles.consultarIcone} />
            <span className={styles.consultarTexto}>
              <span className={styles.consultarTitulo}>
                {consultando ? "Fechar consulta" : "Faça sua consulta"}
              </span>
              <span className={styles.consultarApoio}>Tire suas dúvidas com nossa equipe</span>
            </span>
          </button>

          <Whats href={whatsapp} />
        </div>
      ) : (
        /* Compra direta: seletor, os dois CTAs lado a lado, e "Adicionar e ir
           ao carrinho" abaixo — a segunda intenção que o cliente pediu no item
           7, e que não compete com o par de cima. */
        <AddToCart product={product} withQuantity comIrParaCarrinho aoLado={<Whats href={whatsapp} />} />
      )}

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
            comprador — mas o descritivo pede os três no mesmo formato.

            O olho vem do próprio `ViewCount`: desenhar um `Icon name="eye"`
            aqui dava DOIS olhos lado a lado, porque o componente já traz o
            seu. */}
        <div className={`${styles.cartaoAcao} ${styles.cartaoViews}`}>
          <VisualizacoesDoAtivo assetId={product.id} views={product.views} compacto sempre />
        </div>
      </div>
    </>
  );
}
