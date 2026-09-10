"use client";

import { useState } from "react";
import PageHeader from "@/components/panel/molecules/PageHeader/PageHeader";
import PanelCard from "@/components/panel/molecules/PanelCard/PanelCard";
import PanelButton from "@/components/panel/atoms/PanelButton/PanelButton";
import PanelField from "@/components/panel/molecules/PanelField/PanelField";
import PanelIcon from "@/components/panel/atoms/PanelIcon/PanelIcon";
import StatusPill from "@/components/panel/atoms/StatusPill/StatusPill";
import PanelModal from "@/components/panel/molecules/PanelModal/PanelModal";
import EstadoDaTela from "@/components/panel/molecules/EstadoDaTela/EstadoDaTela";
import {
  useRecurso,
  criarCategoria,
  atualizarCategoria,
  criarSubcategoria,
  atualizarSubcategoria,
} from "@/lib/painel/api-cliente";
import styles from "./categorias.module.css";

/**
 * Configurações — Categorias.
 *
 * As categorias existiam apenas no seed: não havia como criar uma nova sem
 * mexer no banco, e cadastrar um ativo exige escolher categoria. Bastava a RED
 * abrir uma linha de produto nova para o sistema travar.
 *
 * Não há remoção, e é de propósito: uma categoria com ativos não pode
 * desaparecer, senão o ativo fica órfão. Desativar tira do catálogo e preserva
 * o histórico — que é o que se quer quando uma linha é descontinuada.
 */
export default function CategoriasPage() {
  const { dados: categorias, carregando, erro, recarregar } = useRecurso("/catalog/categories");
  const [editando, setEditando] = useState(null); // {tipo, item, categoriaId}

  const fechar = () => setEditando(null);
  const gravou = () => {
    fechar();
    recarregar();
  };

  return (
    <>
      <PageHeader
        titulo="Categorias"
        descricao="A estrutura do catálogo: categorias e suas subcategorias."
        trilha={[{ label: "Configurações" }, { label: "Categorias" }]}
        acoes={
          <PanelButton
            icon="plus"
            size="sm"
            onClick={() => setEditando({ tipo: "categoria", item: null })}
          >
            Nova categoria
          </PanelButton>
        }
      />

      <EstadoDaTela
        carregando={carregando}
        erro={erro}
        onTentarNovamente={recarregar}
        esqueleto="cards"
        quantidade={3}
      >
        <div className={styles.lista}>
          {(categorias || []).map((c) => (
            <PanelCard key={c.id} className={styles.categoria}>
              <div className={styles.cabecaCategoria}>
                <div className={styles.tituloCategoria}>
                  <strong>{c.name}</strong>
                  <span className={styles.slug}>/{c.slug}</span>
                  {c.active === false && <StatusPill status="Inativa" tone="neutral" size="sm" />}
                </div>

                <div className={styles.acoesCategoria}>
                  <button
                    type="button"
                    className={styles.botaoLeve}
                    onClick={() => setEditando({ tipo: "categoria", item: c })}
                  >
                    <PanelIcon name="settings" size={13} />
                    Editar
                  </button>
                  <button
                    type="button"
                    className={styles.botaoLeve}
                    onClick={() => setEditando({ tipo: "subcategoria", item: null, categoriaId: c.id })}
                  >
                    <PanelIcon name="plus" size={13} />
                    Subcategoria
                  </button>
                </div>
              </div>

              {c.description && <p className={styles.descricao}>{c.description}</p>}

              {c.subcategorias?.length ? (
                <ul className={styles.subs}>
                  {c.subcategorias.map((s) => (
                    <li key={s.id}>
                      <span>
                        {s.name}
                        {s.active === false && <em> · inativa</em>}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setEditando({ tipo: "subcategoria", item: s, categoriaId: c.id })
                        }
                        aria-label={`Editar ${s.name}`}
                        title="Editar"
                      >
                        <PanelIcon name="settings" size={12} />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.semSub}>Nenhuma subcategoria.</p>
              )}
            </PanelCard>
          ))}
        </div>
      </EstadoDaTela>

      <PanelModal
        aberto={Boolean(editando)}
        aoFechar={fechar}
        titulo={
          editando?.tipo === "categoria"
            ? editando?.item
              ? `Editar ${editando.item.name}`
              : "Nova categoria"
            : editando?.item
              ? `Editar ${editando.item.name}`
              : "Nova subcategoria"
        }
        descricao="O slug entra no endereço da página e é gerado a partir do nome se ficar vazio."
        largura={520}
      >
        {editando && (
          <Formulario
            key={`${editando.tipo}-${editando.item?.id || "novo"}`}
            {...editando}
            aoCancelar={fechar}
            aoGravar={gravou}
          />
        )}
      </PanelModal>
    </>
  );
}

function Formulario({ tipo, item, categoriaId, aoCancelar, aoGravar }) {
  const [gravando, setGravando] = useState(false);
  const [erro, setErro] = useState(null);
  const editando = Boolean(item);

  const gravar = async (e) => {
    e.preventDefault();
    setErro(null);
    setGravando(true);

    const f = new FormData(e.currentTarget);
    const texto = (k) => f.get(k)?.toString().trim() || undefined;
    const dados = {
      name: texto("name"),
      slug: texto("slug"),
      position: f.get("position") ? Number(f.get("position")) : undefined,
      active: f.get("active") === "on",
      ...(tipo === "categoria" ? { description: texto("description") } : { categoryId: categoriaId }),
    };

    try {
      if (tipo === "categoria") {
        if (editando) await atualizarCategoria(item.id, dados);
        else await criarCategoria(dados);
      } else if (editando) await atualizarSubcategoria(item.id, dados);
      else await criarSubcategoria(dados);
      aoGravar();
    } catch (e2) {
      setErro(e2.details?.[0]?.motivo || e2.message);
    } finally {
      setGravando(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={gravar}>
      {erro && (
        <p className={styles.erro}>
          <PanelIcon name="alert" size={15} />
          {erro}
        </p>
      )}

      <PanelField label="Nome" name="name" defaultValue={item?.name || ""} required minLength={2} />
      <PanelField
        label="Slug"
        name="slug"
        defaultValue={item?.slug || ""}
        dica="Deixe vazio para gerar a partir do nome."
      />
      {tipo === "categoria" && (
        <PanelField
          label="Descrição"
          name="description"
          as="textarea"
          rows={3}
          defaultValue={item?.description || ""}
        />
      )}
      <PanelField
        label="Posição"
        name="position"
        type="number"
        min="0"
        defaultValue={item?.position ?? ""}
        dica="Define a ordem no menu e nos filtros."
      />

      <label className={styles.ativa}>
        <input type="checkbox" name="active" defaultChecked={item ? item.active !== false : true} />
        <span>
          <strong>Ativa</strong>
          <em>Inativa some do catálogo, mas os ativos já cadastrados permanecem.</em>
        </span>
      </label>

      <div className={styles.rodape}>
        <PanelButton type="button" variant="ghost" onClick={aoCancelar} disabled={gravando}>
          Cancelar
        </PanelButton>
        <PanelButton type="submit" disabled={gravando}>
          {gravando ? "Salvando…" : editando ? "Salvar alterações" : "Criar"}
        </PanelButton>
      </div>
    </form>
  );
}
