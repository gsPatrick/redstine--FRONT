"use client";

import { useState } from "react";
import PanelButton from "@/components/panel/atoms/PanelButton/PanelButton";
import PanelIcon from "@/components/panel/atoms/PanelIcon/PanelIcon";
import StatusPill from "@/components/panel/atoms/StatusPill/StatusPill";
import EstadoDaTela from "@/components/panel/molecules/EstadoDaTela/EstadoDaTela";
import Timeline from "@/components/panel/molecules/Timeline/Timeline";
import { useRecurso } from "@/lib/painel/api-cliente";
import { moeda, numero, percentual, data as fmtData } from "@/lib/painel/formato";
import AprovarPreco from "./AprovarPreco";
import styles from "./ativos.module.css";

/**
 * Detalhe do ativo na visão do fornecedor (revisão do cliente, item 9).
 *
 * "Falta uma coluna com a opção de ver mais detalhes sobre o ativo dele e
 *  dentro desses detalhes um botão para eu conseguir aprovar."
 *
 * Lê `GET /me/my-assets/:id` em vez de reaproveitar a linha da tabela. A linha
 * não tem descrição, não tem todas as fotos e não tem histórico — e carregar
 * isso para as 100 linhas da listagem seria pagar por um detalhe que quase
 * nunca é aberto.
 *
 * A aprovação vive DENTRO do detalhe, e é a API que diz se o botão aparece
 * (`podeAprovar`). Decidir aqui por comparação de status levaria a oferecer o
 * botão num ativo já publicado, e a recusa só chegaria depois do clique.
 */
export default function DetalheAtivo({ id, aoAprovar }) {
  const { dados: a, carregando, erro, recarregar } = useRecurso(`/me/my-assets/${id}`);
  const [aprovando, setAprovando] = useState(false);

  if (carregando || erro || !a) {
    return (
      <EstadoDaTela
        carregando={carregando}
        erro={erro}
        onTentarNovamente={recarregar}
        esqueleto="bloco"
        altura={320}
      >
        <span />
      </EstadoDaTela>
    );
  }

  if (aprovando) {
    return (
      <AprovarPreco
        ativo={a}
        aoCancelar={() => setAprovando(false)}
        aoAprovar={() => {
          setAprovando(false);
          recarregar();
          aoAprovar?.();
        }}
      />
    );
  }

  return (
    <div className={styles.detalhe}>
      <div className={styles.detalheTopo}>
        <div>
          <strong className={styles.detalheNome}>{a.nome}</strong>
          <span className={styles.detalheCodigo}>
            {a.codigo}
            {a.categoria ? ` · ${a.categoria}` : ""}
            {a.subcategoria ? ` · ${a.subcategoria}` : ""}
          </span>
        </div>
        <StatusPill status={a.status} />
      </div>

      {/*
        A aprovação em primeiro lugar, antes de qualquer ficha: quando o ativo
        está parado à espera dela, é a única coisa nesta tela que o fornecedor
        precisa de FAZER. Enterrada no fim, ele fechava o detalhe sem ver que a
        bola estava com ele — que é exactamente o que o item 9 pede para
        resolver.
      */}
      {a.podeAprovar && (
        <div className={styles.chamadaAprovar}>
          <div>
            <strong>Este ativo aguarda a sua aprovação.</strong>
            <p>
              A RED propôs {moeda(a.preco)} com {percentual(a.participacao)} para você. Sem a sua
              autorização o ativo não é publicado no catálogo.
            </p>
          </div>
          <PanelButton variant="success" onClick={() => setAprovando(true)}>
            Aprovar preço e modelo
          </PanelButton>
        </div>
      )}

      {a.fotos?.length ? (
        <div className={styles.galeria}>
          {a.fotos.map((f) => (
            <span key={f.id} className={styles.galeriaItem}>
              {/* Mesma convenção das outras telas do painel: o URL vem pronto
                  da API — relativo para o acervo importado, absoluto para o
                  que foi enviado pelo painel. `next/image` exigiria declarar
                  cada host e não acrescenta nada numa miniatura. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.url} alt={f.alt || ""} loading="lazy" />
            </span>
          ))}
        </div>
      ) : (
        <p className={styles.semFoto}>
          <PanelIcon name="image" size={15} />
          Sem fotos cadastradas neste ativo.
        </p>
      )}

      <Bloco titulo="Condições comerciais">
        <Dado rotulo="Preço RED" valor={moeda(a.preco)} destaque />
        <Dado rotulo="Preço de mercado" valor={a.precoMercado ? moeda(a.precoMercado) : null} />
        <Dado rotulo="Desconto" valor={a.desconto != null ? percentual(a.desconto) : null} />
        <Dado rotulo="Modelo comercial" valor={a.modelo} />
        <Dado rotulo="Sua participação" valor={percentual(a.participacao)} />
        <Dado rotulo="Receita potencial" valor={moeda(a.receitaPotencial)} destaque />
      </Bloco>

      <Bloco titulo="Estoque e resultado">
        <Dado rotulo="Quantidade original" valor={`${numero(a.quantidadeOriginal)} ${a.unidade || ""}`} />
        <Dado rotulo="Disponível" valor={`${numero(a.quantidadeDisponivel)} ${a.unidade || ""}`} />
        <Dado rotulo="Vendido" valor={`${numero(a.quantidadeVendida)} ${a.unidade || ""}`} />
        <Dado rotulo="Vendas deste ativo" valor={numero(a.vendasDoAtivo)} />
        {/*
          Realizado e recebido são números diferentes de propósito: o valor da
          venda passa a ser devido só depois da conclusão integral da operação.
          Mostrar um só faria o fornecedor cobrar o que ainda não venceu.
        */}
        <Dado rotulo="Sua receita realizada" valor={moeda(a.receitaRealizada)} />
        <Dado rotulo="Já recebido" valor={moeda(a.receitaRecebida)} />
      </Bloco>

      <Bloco titulo="O ativo">
        <Dado rotulo="Localização" valor={a.local} />
        <Dado rotulo="Condição" valor={a.condicao} />
        <Dado rotulo="Forma de venda" valor={a.formaVenda} />
        <Dado rotulo="Disponibilidade" valor={a.disponibilidade} />
        <Dado rotulo="Marca" valor={a.marca} />
        <Dado rotulo="Material" valor={a.material} />
        <Dado rotulo="Cor" valor={a.cor} />
        <Dado rotulo="Tamanho" valor={a.tamanho} />
        {(a.ficha || []).map((f) => (
          <Dado key={f.campo} rotulo={f.campo} valor={f.valor} />
        ))}
        <Dado rotulo="Visualizações no site" valor={numero(a.visualizacoes)} />
      </Bloco>

      {a.resumo || a.descricao ? (
        <div className={styles.descricao}>
          <strong className={styles.tituloBloco}>Descrição publicada</strong>
          {a.resumo && <p>{a.resumo}</p>}
          {a.descricao && <p>{a.descricao}</p>}
        </div>
      ) : null}

      <div className={styles.historico}>
        <strong className={styles.tituloBloco}>Histórico</strong>
        <Timeline eventos={a.historico || []} />
      </div>

      <div className={styles.acoesDetalhe}>
        {a.linkPublico ? (
          <PanelButton
            href={a.linkPublico}
            target="_blank"
            rel="noopener noreferrer"
            variant="outline"
            icon="eye"
          >
            Ver no site
          </PanelButton>
        ) : (
          <span className={styles.notaSemLink}>
            Este ativo ainda não tem página pública — ela existe a partir da publicação.
          </span>
        )}
        <span className={styles.atualizado}>
          Atualizado em {fmtData(a.atualizadoEm, { comHora: true })}
        </span>
      </div>
    </div>
  );
}

function Bloco({ titulo, children }) {
  return (
    <section className={styles.blocoDetalhe}>
      <strong className={styles.tituloBloco}>{titulo}</strong>
      <dl className={styles.gradeDados}>{children}</dl>
    </section>
  );
}

/** Campo vazio não vira linha "—": a ficha não lista o que não foi preenchido. */
function Dado({ rotulo, valor, destaque = false }) {
  if (valor === null || valor === undefined || String(valor).trim() === "") return null;
  return (
    <div>
      <dt>{rotulo}</dt>
      <dd className={destaque ? styles.destaque : undefined}>{valor}</dd>
    </div>
  );
}
