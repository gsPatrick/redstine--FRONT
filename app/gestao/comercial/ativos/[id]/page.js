"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import PageHeader from "@/components/panel/molecules/PageHeader/PageHeader";
import PanelCard from "@/components/panel/molecules/PanelCard/PanelCard";
import PanelField from "@/components/panel/molecules/PanelField/PanelField";
import PanelButton from "@/components/panel/atoms/PanelButton/PanelButton";
import PanelIcon from "@/components/panel/atoms/PanelIcon/PanelIcon";
import StatusPill from "@/components/panel/atoms/StatusPill/StatusPill";
import EstadoDaTela from "@/components/panel/molecules/EstadoDaTela/EstadoDaTela";
import {
  useRecurso,
  atualizarAtivo,
  mudarStatusDoAtivo,
} from "@/lib/painel/api-cliente";
import { moeda, data as fmtData } from "@/lib/painel/formato";
import {
  ROTULO_STATUS_ATIVO,
  TRANSICOES_ATIVO,
  ACAO_DA_TRANSICAO,
  CONDICOES,
  MODELOS_COMERCIAIS,
  MODALIDADES,
  FORMAS_DE_VENDA,
  DISPONIBILIDADE,
  CAMPOS_TECNICOS,
} from "@/lib/painel/ativos";
import Fotos from "./Fotos";
import styles from "./ativo.module.css";

/**
 * Comercial — Ativo (gestão completa).
 *
 * Tudo o que se faz com um ativo depois de ele existir: corrigir dados, trocar
 * fotos, ajustar preço e modelo comercial, e mover o ciclo de vida.
 *
 * As mudanças de status são botões nomeados pela AÇÃO ("Publicar no catálogo"),
 * não pelo estado de destino, e só aparecem as que a API aceita a partir do
 * estado atual. Uma caixa com os sete status deixaria o utilizador escolher um
 * salto que o servidor recusa, e o erro só apareceria depois do clique.
 */
export default function AtivoGestaoPage() {
  const { id } = useParams();
  const { dados: ativo, carregando, erro, recarregar } = useRecurso(`/assets/admin/${id}`);
  const { dados: categorias } = useRecurso("/catalog/categories");

  const [categoria, setCategoria] = useState(null);
  const [gravando, setGravando] = useState(false);
  const [falha, setFalha] = useState(null);
  const [salvo, setSalvo] = useState(false);

  // `categoria` só substitui a do ativo depois de o utilizador mexer no campo;
  // antes disso a lista de subcategorias tem de seguir o que está gravado.
  const categoriaAtual = categoria ?? ativo?.categoryId ?? "";
  const subs = (categorias || []).find((c) => c.id === categoriaAtual)?.subcategorias || [];

  const transicoes = TRANSICOES_ATIVO[ativo?.status] || [];

  const salvar = async (e) => {
    e.preventDefault();
    setFalha(null);
    setSalvo(false);
    setGravando(true);

    const f = new FormData(e.currentTarget);
    const texto = (k) => {
      const v = f.get(k)?.toString().trim();
      return v || undefined;
    };
    const numero = (k) => (f.get(k) !== "" && f.get(k) != null ? Number(f.get(k)) : undefined);

    const attributes = { ...(ativo.attributes || {}) };
    for (const c of CAMPOS_TECNICOS) {
      const v = texto(`tec_${c.chave}`);
      if (v) attributes[c.chave] = v;
      else delete attributes[c.chave];
    }

    try {
      await atualizarAtivo(id, {
        name: texto("name"),
        shortDescription: texto("shortDescription"),
        description: texto("description"),
        sku: texto("sku"),
        categoryId: texto("categoryId"),
        subcategoryId: texto("subcategoryId"),
        condition: texto("condition"),
        location: texto("location"),
        brand: texto("brand"),
        material: texto("material"),
        color: texto("color"),
        size: texto("size"),
        quantity: numero("quantity"),
        unit: texto("unit"),
        price: numero("price"),
        marketPrice: numero("marketPrice"),
        saleMode: texto("saleMode"),
        saleFormat: texto("saleFormat"),
        availability: texto("availability"),
        commercialModel: texto("commercialModel"),
        featured: f.get("featured") === "on",
        attributes,
      });
      setSalvo(true);
      recarregar();
    } catch (e2) {
      setFalha(e2.details?.[0]?.motivo || e2.message);
    } finally {
      setGravando(false);
    }
  };

  const moverStatus = async (destino) => {
    const acao = ACAO_DA_TRANSICAO[destino];

    // Inativar não tem volta: a API não define nenhuma transição a partir de
    // `inativo`. Dizer isso antes vale mais do que um "tem certeza?" genérico.
    if (destino === "inativo") {
      const segue = window.confirm(
        "Inativar tira o ativo do catálogo e é definitivo: não há caminho de volta a partir de Inativo. Continuar?"
      );
      if (!segue) return;
    }

    let motivo;
    if (destino === "inativo") {
      motivo = window.prompt("Motivo (fica no histórico):") || undefined;
    }

    setFalha(null);
    setGravando(true);
    try {
      await mudarStatusDoAtivo(id, destino, motivo);
      recarregar();
    } catch (e) {
      setFalha(e.details?.[0]?.motivo || e.message);
    } finally {
      setGravando(false);
    }
  };

  return (
    <>
      <PageHeader
        titulo={ativo?.name || "Ativo"}
        descricao={ativo ? `${ativo.sku || "sem código"} · ${ativo.categoria?.name || ""}` : "Gestão do ativo."}
        trilha={[
          { label: "Comercial" },
          { label: "Ativos", href: "/gestao/comercial/ativos" },
          { label: ativo?.name || "Ativo" },
        ]}
        acoes={
          ativo ? (
            <div className={styles.acoesTopo}>
              <StatusPill status={ROTULO_STATUS_ATIVO[ativo.status] || ativo.status} />
              {ativo.status === "publicado" && ativo.slug && (
                <Link
                  href={`/produto/${ativo.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.verNoSite}
                >
                  <PanelIcon name="eye" size={14} />
                  Ver no site
                </Link>
              )}
            </div>
          ) : null
        }
      />

      <EstadoDaTela
        carregando={carregando}
        erro={erro}
        onTentarNovamente={recarregar}
        esqueleto="bloco"
        altura={400}
      >
        {ativo ? (
          <>
            {falha && (
              <p className={styles.erro}>
                <PanelIcon name="alert" size={15} />
                {falha}
              </p>
            )}

            <div className={styles.grade}>
              <div className={styles.coluna}>
                <PanelCard
                  titulo="Fotos"
                  descricao="A primeira imagem é a capa no catálogo."
                >
                  <Fotos
                    ativoId={id}
                    imagens={ativo.imagens || []}
                    aoMudar={async () => recarregar()}
                  />
                </PanelCard>

                <form className={styles.form} onSubmit={salvar}>
                  <PanelCard titulo="Identificação">
                    <div className={styles.grid}>
                      <PanelField
                        label="Nome do ativo"
                        name="name"
                        defaultValue={ativo.name || ""}
                        required
                        className={styles.largo}
                      />
                      <PanelField label="Código (SKU)" name="sku" defaultValue={ativo.sku || ""} />
                      <PanelField
                        label="Localização"
                        name="location"
                        defaultValue={ativo.location || ""}
                      />
                      <PanelField
                        label="Categoria"
                        name="categoryId"
                        as="select"
                        required
                        value={categoriaAtual}
                        onChange={(e) => setCategoria(e.target.value)}
                        opcoes={[
                          { valor: "", label: "Selecione…" },
                          ...(categorias || []).map((c) => ({ valor: c.id, label: c.name })),
                        ]}
                      />
                      <PanelField
                        label="Subcategoria"
                        name="subcategoryId"
                        as="select"
                        // `key` força o select a reassumir o defaultValue quando a
                        // categoria muda; sem isso ficava a subcategoria antiga,
                        // que já não pertence à categoria escolhida.
                        key={`sub-${categoriaAtual}`}
                        defaultValue={
                          subs.some((s) => s.id === ativo.subcategoryId) ? ativo.subcategoryId : ""
                        }
                        opcoes={[
                          { valor: "", label: "Nenhuma" },
                          ...subs.map((s) => ({ valor: s.id, label: s.name })),
                        ]}
                      />
                      <PanelField
                        label="Descrição curta"
                        name="shortDescription"
                        as="textarea"
                        rows={2}
                        defaultValue={ativo.shortDescription || ""}
                        className={styles.largo}
                        dica="É o texto que aparece no card do catálogo."
                      />
                      <PanelField
                        label="Descrição completa"
                        name="description"
                        as="textarea"
                        rows={5}
                        defaultValue={ativo.description || ""}
                        className={styles.largo}
                      />
                    </div>
                  </PanelCard>

                  <PanelCard titulo="Condição e características">
                    <div className={styles.grid}>
                      <PanelField
                        label="Condição"
                        name="condition"
                        as="select"
                        defaultValue={ativo.condition || ""}
                        opcoes={[
                          { valor: "", label: "Não informada" },
                          ...CONDICOES.map((c) => ({ valor: c.valor, label: c.label })),
                        ]}
                      />
                      <PanelField label="Marca" name="brand" defaultValue={ativo.brand || ""} />
                      <PanelField label="Material" name="material" defaultValue={ativo.material || ""} />
                      <PanelField label="Cor" name="color" defaultValue={ativo.color || ""} />
                      <PanelField label="Tamanho" name="size" defaultValue={ativo.size || ""} />
                    </div>

                    <details className={styles.tecnicos}>
                      <summary>Ficha técnica</summary>
                      <div className={styles.grid}>
                        {CAMPOS_TECNICOS.map((c) => (
                          <PanelField
                            key={c.chave}
                            label={c.label}
                            name={`tec_${c.chave}`}
                            defaultValue={ativo.attributes?.[c.chave] || ""}
                          />
                        ))}
                      </div>
                    </details>
                  </PanelCard>

                  <PanelCard
                    titulo="Comercial"
                    descricao="Preço, modelo e como o ativo é vendido."
                  >
                    <div className={styles.grid}>
                      <PanelField
                        label="Preço (R$)"
                        name="price"
                        type="number"
                        step="0.01"
                        min="0"
                        defaultValue={ativo.price ?? ""}
                      />
                      <PanelField
                        label="Preço de mercado (R$)"
                        name="marketPrice"
                        type="number"
                        step="0.01"
                        min="0"
                        defaultValue={ativo.marketPrice ?? ""}
                        dica="Referência de quanto custaria novo."
                      />
                      <PanelField
                        label="Quantidade disponível"
                        name="quantity"
                        type="number"
                        min="0"
                        defaultValue={ativo.quantity ?? ""}
                      />
                      <PanelField label="Unidade" name="unit" defaultValue={ativo.unit || ""} />
                      <PanelField
                        label="Modelo comercial"
                        name="commercialModel"
                        as="select"
                        defaultValue={ativo.commercialModel || ""}
                        opcoes={[
                          { valor: "", label: "Não definido" },
                          ...MODELOS_COMERCIAIS.map((m) => ({ valor: m.valor, label: m.label })),
                        ]}
                        dica="Define a divisão do resultado da venda."
                      />
                      <PanelField
                        label="Modalidade"
                        name="saleMode"
                        as="select"
                        defaultValue={ativo.saleMode || ""}
                        opcoes={[
                          { valor: "", label: "Não definida" },
                          ...MODALIDADES.map((m) => ({ valor: m.valor, label: m.label })),
                        ]}
                        dica="Sob consulta não gera pedido direto: gera cotação."
                      />
                      <PanelField
                        label="Forma de venda"
                        name="saleFormat"
                        as="select"
                        defaultValue={ativo.saleFormat || ""}
                        opcoes={[
                          { valor: "", label: "Não definida" },
                          ...FORMAS_DE_VENDA.map((m) => ({ valor: m.valor, label: m.label })),
                        ]}
                      />
                      <PanelField
                        label="Disponibilidade"
                        name="availability"
                        as="select"
                        defaultValue={ativo.availability || ""}
                        opcoes={[
                          { valor: "", label: "Não definida" },
                          ...DISPONIBILIDADE.map((m) => ({ valor: m.valor, label: m.label })),
                        ]}
                        dica="Independente do status: um publicado pode estar reservado."
                      />
                    </div>

                    <label className={styles.destaque}>
                      <input type="checkbox" name="featured" defaultChecked={ativo.featured} />
                      <span>
                        <strong>Ativo em destaque</strong>
                        <em>Aparece no carrossel da página inicial.</em>
                      </span>
                    </label>
                  </PanelCard>

                  <div className={styles.rodape}>
                    {salvo && (
                      <span className={styles.salvo}>
                        <PanelIcon name="checkCircle" size={15} />
                        Alterações salvas.
                      </span>
                    )}
                    <PanelButton type="submit" size="lg" disabled={gravando}>
                      {gravando ? "Salvando…" : "Salvar alterações"}
                    </PanelButton>
                  </div>
                </form>
              </div>

              <div className={styles.coluna}>
                <PanelCard titulo="Ciclo de vida">
                  <p className={styles.estadoAtual}>
                    Estado atual: <strong>{ROTULO_STATUS_ATIVO[ativo.status] || ativo.status}</strong>
                  </p>

                  {transicoes.length ? (
                    <div className={styles.transicoes}>
                      {transicoes.map((t) => {
                        const acao = ACAO_DA_TRANSICAO[t];
                        return (
                          <PanelButton
                            key={t}
                            variant={acao?.tom || "outline"}
                            disabled={gravando}
                            onClick={() => moverStatus(t)}
                          >
                            {acao?.label || ROTULO_STATUS_ATIVO[t]}
                          </PanelButton>
                        );
                      })}
                    </div>
                  ) : (
                    <p className={styles.semTransicao}>
                      Um ativo inativo não volta atrás. Para recolocá-lo no catálogo é preciso
                      cadastrá-lo de novo.
                    </p>
                  )}

                  {ativo.status === "aguardando_aprovacao" && (
                    <p className={styles.avisoCiclo}>
                      Este ativo está com o fornecedor. A publicação depende de ele aprovar preço
                      e modelo na Área do Cliente.
                    </p>
                  )}
                </PanelCard>

                <PanelCard titulo="Situação">
                  <dl className={styles.dados}>
                    <Dado rotulo="Preço" valor={ativo.price ? moeda(Number(ativo.price)) : null} />
                    <Dado
                      rotulo="Preço de mercado"
                      valor={ativo.marketPrice ? moeda(Number(ativo.marketPrice)) : null}
                    />
                    <Dado
                      rotulo="Desconto"
                      valor={ativo.discountPercent ? `${ativo.discountPercent}%` : null}
                    />
                    <Dado
                      rotulo="Quantidade"
                      valor={
                        ativo.quantity != null
                          ? `${ativo.quantity} de ${ativo.originalQuantity ?? ativo.quantity} ${ativo.unit || ""}`
                          : null
                      }
                    />
                    <Dado rotulo="Fotos" valor={String(ativo.imagens?.length ?? 0)} />
                    <Dado
                      rotulo="Aprovado pelo fornecedor"
                      valor={ativo.supplierApprovedAt ? fmtData(ativo.supplierApprovedAt) : "Ainda não"}
                    />
                    <Dado
                      rotulo="Publicado em"
                      valor={ativo.publishedAt ? fmtData(ativo.publishedAt) : null}
                    />
                    <Dado rotulo="Criado em" valor={fmtData(ativo.createdAt)} />
                    <Dado
                      rotulo="Última alteração"
                      valor={fmtData(ativo.updatedAt, { comHora: true })}
                    />
                  </dl>
                </PanelCard>
              </div>
            </div>
          </>
        ) : null}
      </EstadoDaTela>
    </>
  );
}

function Dado({ rotulo, valor }) {
  if (!valor) return null;
  return (
    <div className={styles.item}>
      <dt>{rotulo}</dt>
      <dd>{valor}</dd>
    </div>
  );
}
