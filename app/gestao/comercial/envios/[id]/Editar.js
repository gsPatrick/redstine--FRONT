"use client";

import { useState } from "react";
import PanelField from "@/components/panel/molecules/PanelField/PanelField";
import PanelButton from "@/components/panel/atoms/PanelButton/PanelButton";
import PanelIcon from "@/components/panel/atoms/PanelIcon/PanelIcon";
import { atualizarEnvio, enviarFotosDoAtivo } from "@/lib/painel/api-cliente";
import { CONDICOES } from "@/lib/painel/envios";
import styles from "./envio.module.css";

const MAX_FOTOS = 20;
const MAX_MB = 8;
const TIPOS = ["image/jpeg", "image/png", "image/webp", "image/avif"];

/**
 * Correção dos dados do envio.
 *
 * O envio chega por formulário livre: nome abreviado, cidade sem UF,
 * quantidade escrita no campo errado, foto faltando. A curadoria arruma isso
 * ANTES de aprovar, porque é daqui que o ativo nasce — corrigir só depois
 * significaria arrumar duas vezes, no envio e no ativo.
 *
 * As fotos do envio são uma lista de endereços, não uma tabela: adicionar sobe
 * o ficheiro e acrescenta o endereço; remover tira da lista. O ficheiro em si
 * fica no disco, e é isso que se quer — a foto original do que o fornecedor
 * mandou é parte do registo.
 */
export default function Editar({ envio, aoSalvar, aoCancelar }) {
  const [fotos, setFotos] = useState(envio.photos || []);
  const [gravando, setGravando] = useState(false);
  const [subindo, setSubindo] = useState(false);
  const [erro, setErro] = useState(null);

  const adicionar = async (lista) => {
    const escolhidos = Array.from(lista || []);
    if (!escolhidos.length) return;

    const recusados = [];
    const aceites = escolhidos.filter((f) => {
      if (!TIPOS.includes(f.type)) {
        recusados.push(`${f.name}: formato não aceito`);
        return false;
      }
      if (f.size > MAX_MB * 1024 * 1024) {
        recusados.push(`${f.name}: acima de ${MAX_MB} MB`);
        return false;
      }
      return true;
    });

    setErro(recusados.length ? recusados.join(". ") : null);
    if (!aceites.length) return;

    setSubindo(true);
    try {
      const guardadas = await enviarFotosDoAtivo(aceites.slice(0, MAX_FOTOS - fotos.length));
      setFotos((f) => [...f, ...guardadas.map((g) => g.url)]);
    } catch (e) {
      setErro(e.details?.[0]?.motivo || e.message);
    } finally {
      setSubindo(false);
    }
  };

  const salvar = async (e) => {
    e.preventDefault();
    setErro(null);
    setGravando(true);

    const f = new FormData(e.currentTarget);
    const texto = (k) => f.get(k)?.toString().trim() || null;

    try {
      await atualizarEnvio(envio.id, {
        assetType: texto("assetType"),
        description: texto("description") || texto("assetType") || envio.description,
        approximateQuantity: texto("approximateQuantity"),
        city: texto("city"),
        notes: texto("notes"),
        name: texto("name") || undefined,
        company: texto("company"),
        email: texto("email") || undefined,
        phone: texto("phone") || undefined,
        photos: fotos,
        attributes: {
          condicao: texto("condicao"),
          quantidade: f.get("quantidade") ? Number(f.get("quantidade")) : null,
          unidade: texto("unidade"),
          local: texto("city"),
        },
      });
      aoSalvar();
    } catch (e2) {
      setErro(e2.details?.[0]?.motivo || e2.message);
    } finally {
      setGravando(false);
    }
  };

  return (
    <form className={styles.formEdicao} onSubmit={salvar}>
      {erro && (
        <p className={styles.erro}>
          <PanelIcon name="alert" size={15} />
          {erro}
        </p>
      )}

      <div className={styles.gradeCampos}>
        <PanelField
          label="Descrição do ativo"
          name="assetType"
          defaultValue={envio.assetType || envio.description || ""}
          required
          className={styles.campoLargo}
        />
        <PanelField
          label="Quantidade"
          name="quantidade"
          type="number"
          min="0"
          defaultValue={envio.attributes?.quantidade ?? ""}
        />
        <PanelField
          label="Unidade"
          name="unidade"
          defaultValue={envio.attributes?.unidade || ""}
        />
        <PanelField
          label="Quantidade aproximada (texto livre)"
          name="approximateQuantity"
          defaultValue={envio.approximateQuantity || ""}
          dica="Como o fornecedor descreveu. Ex.: “cerca de 50 peças”."
        />
        <PanelField
          label="Localização"
          name="city"
          defaultValue={envio.city || ""}
          dica="Cidade e UF."
        />
        <PanelField
          label="Condição declarada"
          name="condicao"
          as="select"
          defaultValue={envio.attributes?.condicao || ""}
          opcoes={[
            { valor: "", label: "Não informada" },
            ...CONDICOES.map((c) => ({ valor: c.valor, label: c.label })),
          ]}
        />
        <PanelField
          label="Observações"
          name="notes"
          as="textarea"
          rows={3}
          defaultValue={envio.notes || ""}
          className={styles.campoLargo}
        />
      </div>

      <fieldset className={styles.bloco}>
        <legend>Contato do fornecedor</legend>
        <div className={styles.gradeCampos}>
          <PanelField label="Nome" name="name" defaultValue={envio.name || ""} />
          <PanelField label="Empresa" name="company" defaultValue={envio.company || ""} />
          <PanelField label="E-mail" name="email" type="email" defaultValue={envio.email || ""} />
          <PanelField label="Telefone" name="phone" defaultValue={envio.phone || ""} />
        </div>
      </fieldset>

      <fieldset className={styles.bloco}>
        <legend>Fotos</legend>

        {fotos.length > 0 && (
          <ul className={styles.galeriaEdicao}>
            {fotos.map((src, i) => (
              <li key={src}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`Foto ${i + 1}`} loading="lazy" />
                <button
                  type="button"
                  onClick={() => setFotos((f) => f.filter((_, j) => j !== i))}
                  aria-label={`Remover foto ${i + 1}`}
                  title="Remover"
                >
                  <PanelIcon name="close" size={12} />
                </button>
              </li>
            ))}
          </ul>
        )}

        {fotos.length < MAX_FOTOS && (
          <label
            className={styles.soltaEdicao}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              adicionar(e.dataTransfer.files);
            }}
          >
            <input
              type="file"
              accept={TIPOS.join(",")}
              multiple
              className={styles.inputArquivo}
              disabled={subindo}
              onChange={(e) => {
                adicionar(e.target.files);
                e.target.value = "";
              }}
            />
            <PanelIcon name="image" size={18} />
            <strong>{subindo ? "Enviando…" : "Adicionar fotos"}</strong>
          </label>
        )}
      </fieldset>

      <div className={styles.rodapeEdicao}>
        <PanelButton type="button" variant="ghost" onClick={aoCancelar} disabled={gravando}>
          Cancelar
        </PanelButton>
        <PanelButton type="submit" disabled={gravando || subindo}>
          {gravando ? "Salvando…" : "Salvar alterações"}
        </PanelButton>
      </div>
    </form>
  );
}
