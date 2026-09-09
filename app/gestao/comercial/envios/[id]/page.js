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
import { useRecurso, iniciarAvaliacaoDeEnvio, avaliarEnvio } from "@/lib/painel/api-cliente";
import { moeda, data as fmtData } from "@/lib/painel/formato";
import {
  ROTULO_ENVIO,
  STATUS_ENVIO,
  CONDICOES,
  MODELOS,
  MODALIDADES,
} from "@/lib/painel/envios";
import Galeria from "./Galeria";
import Editar from "./Editar";
import styles from "./envio.module.css";

/**
 * Comercial — Envio (detalhe e curadoria).
 *
 * A tela onde o envio deixa de ser um pedido e vira (ou nao) um ativo. As duas
 * decisoes vivem no mesmo lugar porque sao a mesma decisao vista dos dois
 * lados, e separa-las levaria a recusar num ecra sem ter visto o que se ve no
 * outro.
 *
 * Aprovar CRIA o ativo — em rascunho, nao publicado. A publicacao ainda depende
 * da aprovacao do proprio fornecedor sobre preco e modelo, e e por isso que o
 * aviso ao lado do botao diz exatamente isso: o curador precisa saber o que o
 * clique dele faz antes de clicar.
 */
export default function EnvioDetalhePage() {
  const { id } = useParams();
  const { dados: envio, carregando, erro, recarregar } = useRecurso(`/submissions/${id}`);
  const { dados: categorias } = useRecurso("/catalog/categories");

  const [decisao, setDecisao] = useState(null); // "aprovar" | "recusar"
  const [editando, setEditando] = useState(false);
  const [categoria, setCategoria] = useState("");
  const [gravando, setGravando] = useState(false);
  const [falha, setFalha] = useState(null);

  const subs = (categorias || []).find((c) => c.id === categoria)?.subcategorias || [];
  const decidido =
    envio?.status === STATUS_ENVIO.APROVADA || envio?.status === STATUS_ENVIO.RECUSADA;
  const ativoGerado = envio?.avaliacoes?.find((a) => a.assetId)?.assetId;

  const iniciar = async () => {
    setFalha(null);
    setGravando(true);
    try {
      await iniciarAvaliacaoDeEnvio(id);
      recarregar();
    } catch (e) {
      setFalha(e.details?.[0]?.motivo || e.message);
    } finally {
      setGravando(false);
    }
  };

  const decidir = async (e) => {
    e.preventDefault();
    setFalha(null);
    setGravando(true);

    const f = new FormData(e.currentTarget);
    const aprovar = decisao === "aprovar";
    const texto = (k) => f.get(k)?.toString().trim() || undefined;
    const numero = (k) => (f.get(k) ? Number(f.get(k)) : undefined);

    try {
      await avaliarEnvio(id, {
        approved: aprovar,
        decisionReason: texto("decisionReason"),
        conditionNotes: texto("conditionNotes"),
        provenanceNotes: texto("provenanceNotes"),
        logisticsNotes: texto("logisticsNotes"),
        commercialNotes: texto("commercialNotes"),
        ...(aprovar
          ? {
              name: texto("name"),
              shortDescription: texto("shortDescription"),
              categoryId: texto("categoryId"),
              subcategoryId: texto("subcategoryId"),
              condition: texto("condition"),
              location: texto("location"),
              quantity: numero("quantity"),
              unit: texto("unit"),
              recommendedPrice: numero("recommendedPrice"),
              recommendedMarketPrice: numero("recommendedMarketPrice"),
              recommendedModel: texto("recommendedModel"),
              saleMode: texto("saleMode"),
            }
          : {}),
      });
      setDecisao(null);
      recarregar();
    } catch (e2) {
      setFalha(e2.details?.[0]?.motivo || e2.message);
    } finally {
      setGravando(false);
    }
  };

  return (
    <>
      <PageHeader
        titulo={envio?.reference || "Envio"}
        descricao={envio?.assetType || "Detalhe do envio."}
        trilha={[
          { label: "Comercial" },
          { label: "Envios", href: "/gestao/comercial/envios" },
          { label: envio?.reference || "Envio" },
        ]}
        acoes={envio ? <StatusPill status={ROTULO_ENVIO[envio.status] || envio.status} /> : null}
      />

      <EstadoDaTela
        carregando={carregando}
        erro={erro}
        onTentarNovamente={recarregar}
        esqueleto="bloco"
        altura={400}
      >
        {envio ? (
          <div className={styles.grade}>
            <div className={styles.coluna}>
              <PanelCard
                titulo="Fotos do ativo"
                descricao={
                  envio.photos?.length
                    ? "Clique para ampliar."
                    : "O fornecedor não anexou fotos."
                }
              >
                <Galeria fotos={envio.photos || []} legenda={envio.assetType} />
              </PanelCard>

              <PanelCard
                titulo="O que foi enviado"
                acao={
                  !editando ? (
                    <button
                      type="button"
                      className={styles.botaoEditar}
                      onClick={() => setEditando(true)}
                    >
                      <PanelIcon name="settings" size={13} />
                      Editar
                    </button>
                  ) : null
                }
              >
                {editando ? (
                  <Editar
                    envio={envio}
                    aoCancelar={() => setEditando(false)}
                    aoSalvar={() => {
                      setEditando(false);
                      recarregar();
                    }}
                  />
                ) : (
                <dl className={styles.dados}>
                  <Dado rotulo="Descrição" valor={envio.assetType || envio.description} largo />
                  <Dado rotulo="Quantidade aproximada" valor={envio.approximateQuantity} />
                  <Dado rotulo="Localização" valor={envio.city} />
                  {/* O envio guarda a chave crua (`sem_uso`); mostrar isso ao
                      utilizador expõe o vocabulário interno do banco. */}
                  <Dado
                    rotulo="Condição declarada"
                    valor={
                      CONDICOES.find((c) => c.valor === envio.attributes?.condicao)?.label ||
                      envio.attributes?.condicao
                    }
                  />
                  <Dado rotulo="Recebido em" valor={fmtData(envio.createdAt, { comHora: true })} />
                  <Dado
                    rotulo="Origem"
                    valor={
                      envio.attributes?.origem === "painel"
                        ? "Área do Cliente"
                        : "Formulário do site"
                    }
                  />
                  <Dado rotulo="Observações do fornecedor" valor={envio.notes} largo />
                </dl>
                )}
              </PanelCard>

              {envio.avaliacoes?.length > 0 && (
                <PanelCard titulo="Histórico de curadoria">
                  <ul className={styles.historico}>
                    {envio.avaliacoes.map((a) => (
                      <li key={a.id} className={styles.avaliacao}>
                        <div className={styles.avaliacaoTopo}>
                          <StatusPill
                            status={a.approved ? "Aprovado" : "Recusado"}
                            tone={a.approved ? "ok" : "danger"}
                            size="sm"
                          />
                          <span className={styles.quando}>{fmtData(a.decidedAt || a.createdAt, { comHora: true })}</span>
                        </div>

                        {a.decisionReason && <p className={styles.motivo}>{a.decisionReason}</p>}

                        <dl className={styles.notas}>
                          <Dado rotulo="Condição" valor={a.conditionNotes} />
                          <Dado rotulo="Procedência" valor={a.provenanceNotes} />
                          <Dado rotulo="Logística" valor={a.logisticsNotes} />
                          <Dado rotulo="Comercial" valor={a.commercialNotes} />
                          <Dado
                            rotulo="Preço recomendado"
                            valor={a.recommendedPrice ? moeda(Number(a.recommendedPrice)) : null}
                          />
                          <Dado
                            rotulo="Modelo"
                            valor={
                              MODELOS.find((m) => m.valor === a.recommendedModel)?.label ||
                              a.recommendedModel
                            }
                          />
                        </dl>

                        {a.assetId && (
                          <Link
                            href={`/gestao/comercial/ativos/${a.assetId}`}
                            className={styles.linkAtivo}
                            title="Abrir a gestão do ativo que este envio gerou"
                          >
                            <PanelIcon name="box" size={14} />
                            Gerir o ativo gerado
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </PanelCard>
              )}
            </div>

            <div className={styles.coluna}>
              <PanelCard titulo="Fornecedor">
                <dl className={styles.dados}>
                  <Dado rotulo="Nome" valor={envio.name} largo />
                  <Dado rotulo="Empresa" valor={envio.company} largo />
                  <Dado rotulo="E-mail" valor={envio.email} largo />
                  <Dado rotulo="Telefone" valor={envio.phone} largo />
                  <Dado
                    rotulo="Tem conta na plataforma"
                    valor={envio.supplierId ? "Sim" : "Não — enviou pelo site"}
                    largo
                  />
                </dl>
              </PanelCard>

              <PanelCard titulo="Curadoria">
                {falha && (
                  <p className={styles.erro}>
                    <PanelIcon name="alert" size={15} />
                    {falha}
                  </p>
                )}

                {decidido ? (
                  <>
                    <p className={styles.decidido}>
                      Este envio já foi{" "}
                      {envio.status === STATUS_ENVIO.APROVADA ? "aprovado" : "recusado"}. A decisão
                      fica registrada no histórico e não é refeita aqui.
                    </p>

                    {/* Aprovado, o trabalho continua NO ATIVO: preço, fotos e
                        publicação vivem lá. Sem este atalho o utilizador fica
                        num ecrã sem nada para fazer e sem saber para onde ir. */}
                    {ativoGerado && (
                      <PanelButton
                        href={`/gestao/comercial/ativos/${ativoGerado}`}
                        size="lg"
                        className={styles.irParaAtivo}
                      >
                        Gerir o ativo gerado
                      </PanelButton>
                    )}
                  </>
                ) : envio.status === STATUS_ENVIO.RECEBIDA ? (
                  <>
                    <p className={styles.aviso}>
                      Ninguém abriu este envio ainda. Iniciar a avaliação marca que ele está
                      com a curadoria, para dois curadores não trabalharem no mesmo envio.
                    </p>
                    <PanelButton onClick={iniciar} disabled={gravando} size="lg">
                      {gravando ? "Iniciando…" : "Iniciar avaliação"}
                    </PanelButton>
                  </>
                ) : !decisao ? (
                  <>
                    <p className={styles.aviso}>
                      Aprovar cria o ativo no catálogo <strong>em rascunho</strong>. A publicação
                      só acontece depois de o fornecedor aprovar preço e modelo.
                    </p>
                    <div className={styles.botoes}>
                      <PanelButton variant="success" size="lg" onClick={() => setDecisao("aprovar")}>
                        Aprovar
                      </PanelButton>
                      <PanelButton variant="ghost" size="lg" onClick={() => setDecisao("recusar")}>
                        Recusar
                      </PanelButton>
                    </div>
                  </>
                ) : (
                  <form className={styles.form} onSubmit={decidir}>
                    <div className={styles.cabecaForm}>
                      <strong>{decisao === "aprovar" ? "Aprovar envio" : "Recusar envio"}</strong>
                      <button
                        type="button"
                        className={styles.voltar}
                        onClick={() => {
                          setDecisao(null);
                          setFalha(null);
                        }}
                      >
                        Cancelar
                      </button>
                    </div>

                    {decisao === "aprovar" ? (
                      <>
                        <PanelField
                          label="Nome do ativo no catálogo"
                          name="name"
                          defaultValue={envio.assetType || ""}
                          required
                        />
                        <PanelField
                          label="Descrição curta"
                          name="shortDescription"
                          as="textarea"
                          rows={2}
                        />
                        <PanelField
                          label="Categoria"
                          name="categoryId"
                          as="select"
                          required
                          value={categoria}
                          onChange={(e) => setCategoria(e.target.value)}
                          opcoes={[
                            { valor: "", label: "Selecione…" },
                            ...(categorias || []).map((c) => ({ valor: c.id, label: c.name })),
                          ]}
                          dica="Obrigatória: é o que dá lugar ao ativo no catálogo."
                        />
                        {subs.length > 0 && (
                          <PanelField
                            label="Subcategoria"
                            name="subcategoryId"
                            as="select"
                            opcoes={[
                              { valor: "", label: "Selecione…" },
                              ...subs.map((s) => ({ valor: s.id, label: s.name })),
                            ]}
                          />
                        )}
                        <PanelField
                          label="Condição"
                          name="condition"
                          as="select"
                          opcoes={[
                            { valor: "", label: "Selecione…" },
                            ...CONDICOES.map((c) => ({ valor: c.valor, label: c.label })),
                          ]}
                        />
                        <div className={styles.par}>
                          <PanelField
                            label="Quantidade"
                            name="quantity"
                            type="number"
                            min="0"
                            defaultValue={envio.attributes?.quantidade ?? ""}
                          />
                          <PanelField
                            label="Unidade"
                            name="unit"
                            defaultValue={envio.attributes?.unidade || ""}
                          />
                        </div>
                        <PanelField
                          label="Localização"
                          name="location"
                          defaultValue={envio.city || ""}
                        />
                        <div className={styles.par}>
                          <PanelField
                            label="Preço recomendado (R$)"
                            name="recommendedPrice"
                            type="number"
                            step="0.01"
                            min="0"
                          />
                          <PanelField
                            label="Preço de mercado (R$)"
                            name="recommendedMarketPrice"
                            type="number"
                            step="0.01"
                            min="0"
                            dica="Referência de quanto custaria novo."
                          />
                        </div>
                        <PanelField
                          label="Modelo comercial"
                          name="recommendedModel"
                          as="select"
                          opcoes={[
                            { valor: "", label: "Selecione…" },
                            ...MODELOS.map((m) => ({ valor: m.valor, label: m.label })),
                          ]}
                        />
                        <PanelField
                          label="Modalidade de venda"
                          name="saleMode"
                          as="select"
                          opcoes={[
                            { valor: "", label: "Selecione…" },
                            ...MODALIDADES.map((m) => ({ valor: m.valor, label: m.label })),
                          ]}
                          dica="Sob consulta não gera pedido direto: gera cotação."
                        />
                      </>
                    ) : (
                      <PanelField
                        label="Motivo da recusa"
                        name="decisionReason"
                        as="textarea"
                        rows={4}
                        required
                        dica="Obrigatório. É o que o fornecedor recebe como resposta."
                      />
                    )}

                    <details className={styles.notasCuradoria}>
                      <summary>Notas de curadoria (opcional)</summary>
                      <PanelField label="Condição" name="conditionNotes" as="textarea" rows={2} />
                      <PanelField label="Procedência" name="provenanceNotes" as="textarea" rows={2} />
                      <PanelField label="Logística" name="logisticsNotes" as="textarea" rows={2} />
                      <PanelField label="Comercial" name="commercialNotes" as="textarea" rows={2} />
                    </details>

                    <PanelButton
                      type="submit"
                      size="lg"
                      variant={decisao === "aprovar" ? "success" : "solid"}
                      disabled={gravando}
                    >
                      {gravando
                        ? "Gravando…"
                        : decisao === "aprovar"
                          ? "Aprovar e criar ativo"
                          : "Confirmar recusa"}
                    </PanelButton>
                  </form>
                )}
              </PanelCard>
            </div>
          </div>
        ) : null}
      </EstadoDaTela>
    </>
  );
}

/** Linha de dado que some quando não há valor, em vez de mostrar "—" em série. */
function Dado({ rotulo, valor, largo = false }) {
  if (!valor) return null;
  return (
    <div className={largo ? styles.itemLargo : styles.item}>
      <dt>{rotulo}</dt>
      <dd>{valor}</dd>
    </div>
  );
}
