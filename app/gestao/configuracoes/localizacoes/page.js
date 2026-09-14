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
import { useRecurso, criarLocalizacao, atualizarLocalizacao } from "@/lib/painel/api-cliente";
import styles from "./localizacoes.module.css";

/**
 * Configurações — Localizações.
 *
 * A localização do ativo é LISTA FECHADA (decisão do cliente, 12/09: "vamos
 * manter a lista fechada e inicialmente teremos apenas duas opções"). Antes
 * era um campo de texto, e o resultado estava na base: "Rio de Janeiro/RJ" e
 * "Rio de Janeiro — RJ" a designarem o mesmo lugar, e o indicador de
 * Localizações do painel Operação bloqueado por causa disso.
 *
 * Esta tela é a resposta à pergunta que a lista fechada levanta: quem adiciona
 * a terceira cidade? A RED, aqui — não um programador, com migração e deploy.
 *
 * Não há remoção, pelo mesmo motivo das categorias: uma localização com ativos
 * não pode desaparecer, senão o ativo fica a apontar para o nada. Desativar
 * tira do formulário e do filtro e preserva o histórico.
 */
export default function LocalizacoesPage() {
  const { dados, carregando, erro, recarregar } = useRecurso(
    "/locations?incluirInativas=true"
  );
  const [editando, setEditando] = useState(null); // null | {item}

  const fechar = () => setEditando(null);
  const gravou = () => {
    fechar();
    recarregar();
  };

  return (
    <>
      <PageHeader
        titulo="Localizações"
        descricao="A lista fechada de onde um ativo pode estar."
        trilha={[{ label: "Configurações" }, { label: "Localizações" }]}
        acoes={
          <PanelButton icon="plus" size="sm" onClick={() => setEditando({ item: null })}>
            Nova localização
          </PanelButton>
        }
      />

      <EstadoDaTela
        carregando={carregando}
        erro={erro}
        onTentarNovamente={recarregar}
        esqueleto="cards"
        quantidade={2}
      >
        <PanelCard
          titulo="Onde a RED opera"
          descricao="O cadastro de ativo só oferece o que estiver aqui, e o filtro do catálogo também."
        >
          <p className={styles.nota}>
            O rótulo é a forma como a localização aparece no site, no filtro e nas
            exportações. Renomear reescreve o rótulo em todos os ativos daquela
            localização — não ficam dois textos para o mesmo lugar.
          </p>

          <div className={styles.lista}>
            {(dados || []).map((l) => (
              <div key={l.id} className={styles.linha}>
                <div className={styles.identidade}>
                  <strong>{l.name}</strong>
                  <span className={styles.slug}>/{l.slug}</span>
                  {l.active === false && (
                    <StatusPill status="Inativa" tone="neutral" size="sm" />
                  )}
                </div>
                <button
                  type="button"
                  className={styles.botaoLeve}
                  onClick={() => setEditando({ item: l })}
                >
                  <PanelIcon name="settings" size={13} />
                  Editar
                </button>
              </div>
            ))}
          </div>
        </PanelCard>
      </EstadoDaTela>

      <PanelModal
        aberto={Boolean(editando)}
        aoFechar={fechar}
        titulo={editando?.item ? `Editar ${editando.item.name}` : "Nova localização"}
        descricao="Cidade e UF montam o rótulo. O slug entra nos endereços e é gerado se ficar vazio."
        largura={520}
      >
        {editando && (
          <Formulario
            key={editando.item?.id || "nova"}
            item={editando.item}
            aoCancelar={fechar}
            aoGravar={gravou}
          />
        )}
      </PanelModal>
    </>
  );
}

function Formulario({ item, aoCancelar, aoGravar }) {
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
      city: texto("city"),
      uf: texto("uf"),
      // Rótulo vazio deixa a API montar "Cidade - UF", que é a forma canónica.
      // É de propósito que o campo seja opcional: quanto menos texto livre
      // houver aqui, menos formas de escrever o mesmo lugar.
      name: texto("name"),
      slug: texto("slug"),
      position: f.get("position") ? Number(f.get("position")) : undefined,
      active: f.get("active") === "on",
    };

    try {
      if (editando) await atualizarLocalizacao(item.id, dados);
      else await criarLocalizacao(dados);
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

      <div className={styles.grade}>
        <PanelField
          label="Cidade"
          name="city"
          defaultValue={item?.city || ""}
          required
          minLength={2}
        />
        <PanelField
          label="UF"
          name="uf"
          defaultValue={item?.uf || ""}
          required
          minLength={2}
          maxLength={2}
          placeholder="RJ"
        />
      </div>

      <PanelField
        label="Rótulo"
        name="name"
        defaultValue={item?.name || ""}
        placeholder="Cidade - UF"
        dica="Como aparece no site e no filtro. Vazio gera “Cidade - UF”."
      />
      <PanelField
        label="Slug"
        name="slug"
        defaultValue={item?.slug || ""}
        dica="Deixe vazio para gerar a partir do rótulo."
      />
      <PanelField
        label="Posição"
        name="position"
        type="number"
        min="0"
        defaultValue={item?.position ?? ""}
        dica="Define a ordem no formulário de cadastro e nos filtros."
      />

      <label className={styles.ativa}>
        <input
          type="checkbox"
          name="active"
          defaultChecked={item ? item.active !== false : true}
        />
        <span>
          <strong>Ativa</strong>
          <em>
            Inativa deixa de ser oferecida no cadastro e no filtro; os ativos já
            cadastrados nela permanecem como estão.
          </em>
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
