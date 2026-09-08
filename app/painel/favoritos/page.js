"use client";

import Link from "next/link";
import { useState } from "react";
import PageHeader from "@/components/panel/molecules/PageHeader/PageHeader";
import PanelButton from "@/components/panel/atoms/PanelButton/PanelButton";
import PanelIcon from "@/components/panel/atoms/PanelIcon/PanelIcon";
import EmptyState from "@/components/panel/molecules/EmptyState/EmptyState";
import EstadoDaTela from "@/components/panel/molecules/EstadoDaTela/EstadoDaTela";
import { useLista, alternarFavorito } from "@/lib/painel/api-cliente";
import { moeda } from "@/lib/painel/formato";
import styles from "./favoritos.module.css";

/**
 * Favoritos.
 *
 * O CTA muda com a modalidade do ativo: compra direta mostra "Comprar", ativo
 * sob consulta mostra "Consultar Condicoes". Oferecer "Comprar" num ativo que
 * exige consulta levaria o utilizador a um checkout sem preco fechado.
 */
export default function FavoritosPage() {
  const { linhas, carregando, erro, recarregar } = useLista("/wishlist");
  const [removidos, setRemovidos] = useState([]);

  const lista = linhas
    .filter((f) => !removidos.includes(f.assetId))
    .map((f) => ({
      id: f.assetId,
      nome: f.ativo?.name || "—",
      slug: f.ativo?.slug,
      imagem: f.ativo?.imagens?.[0]?.url || null,
      categoria: f.ativo?.categoria?.name || "—",
      local: f.ativo?.location || "—",
      preco: Number(f.ativo?.price || 0),
      // "Consultar Condições" é o CTA padrão quando o preço não está fechado.
      modalidade: f.ativo?.saleMode === "consulta" ? "consulta" : "compra",
      disponivel: f.ativo?.status === "publicado" && f.ativo?.availability !== "reservado",
    }));

  // Remove na tela antes de a API responder: o coração precisa reagir na hora,
  // e um favorito a menos não é dado crítico. Se falhar, a recarga devolve.
  async function remover(id) {
    setRemovidos((r) => [...r, id]);
    try {
      await alternarFavorito(id);
    } catch {
      setRemovidos((r) => r.filter((x) => x !== id));
    }
  }

  return (
    <>
      <PageHeader
        titulo="Favoritos"
        descricao={`${lista.length} ${lista.length === 1 ? "ativo salvo" : "ativos salvos"} para acompanhar.`}
        trilha={[{ label: "Comprar" }, { label: "Favoritos" }]}
      />

      <EstadoDaTela carregando={carregando} erro={erro} onTentarNovamente={recarregar} altura={280}>
      {lista.length ? (
        <>
          <div className={styles.grade}>
            {lista.map((f) => (
              <article key={f.id} className={styles.cartao}>
                <button
                  type="button"
                  className={styles.coracao}
                  onClick={() => remover(f.id)}
                  aria-label={`Remover ${f.nome} dos favoritos`}
                >
                  <PanelIcon name="heart" size={16} />
                </button>

                <div className={styles.foto}>
                  <img src={f.imagem} alt={f.nome} loading="lazy" />
                </div>

                <span className={styles.categoria}>{f.categoria}</span>
                <h2 className={styles.nome}>{f.nome}</h2>
                <span className={styles.local}>
                  <PanelIcon name="pin" size={13} />
                  {f.local}
                </span>

                <strong className={styles.preco}>{moeda(f.preco)}</strong>

                {!f.disponivel && <span className={styles.indisponivel}>Indisponível no momento</span>}

                <div className={styles.acoes}>
                  <PanelButton href={f.slug ? `/produto/${f.slug}` : "/shop"} variant="outline" size="sm" className={styles.acao}>
                    Ver produto
                  </PanelButton>
                  {f.disponivel && (
                    <PanelButton href={f.slug ? `/produto/${f.slug}` : "/shop"} size="sm" className={styles.acao}>
                      {f.modalidade === "consulta" ? "Consultar Condições" : "Comprar"}
                    </PanelButton>
                  )}
                </div>
              </article>
            ))}
          </div>

          <div className={styles.rodape}>
            <Link href="/shop">Ver todos os ativos disponíveis</Link>
          </div>
        </>
      ) : (
        <EmptyState
          icone="heart"
          titulo="Nenhum favorito por aqui."
          descricao="Salve ativos que te interessam para acompanhar preço e disponibilidade."
          acao={{ label: "Explorar Ativos", href: "/shop" }}
        />
      )}
      </EstadoDaTela>
    </>
  );
}
