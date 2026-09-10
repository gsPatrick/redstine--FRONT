"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/panel/molecules/PageHeader/PageHeader";
import PanelCard from "@/components/panel/molecules/PanelCard/PanelCard";
import PanelField from "@/components/panel/molecules/PanelField/PanelField";
import PanelButton from "@/components/panel/atoms/PanelButton/PanelButton";
import PanelIcon from "@/components/panel/atoms/PanelIcon/PanelIcon";
import EstadoDaTela from "@/components/panel/molecules/EstadoDaTela/EstadoDaTela";
import { useRecurso, useLista, criarAtivo, anexarFotosAoAtivo } from "@/lib/painel/api-cliente";
import {
  CONDICOES,
  MODELOS_COMERCIAIS,
  MODALIDADES,
  FORMAS_DE_VENDA,
  DISPONIBILIDADE,
  CAMPOS_TECNICOS,
} from "@/lib/painel/ativos";
import styles from "./novo.module.css";

const MAX_MB = 8;
const TIPOS = ["image/jpeg", "image/png", "image/webp", "image/avif"];

/**
 * Comercial — Novo ativo.
 *
 * Cadastro direto pela gestao, sem passar por envio nem curadoria: e o caminho
 * de quem ja tem o ativo na mao e a informacao conferida — a propria RED
 * cadastrando o acervo, ou o operador lancando o que chegou por fora do site.
 *
 * Nasce em RASCUNHO, sempre. Publicar e um passo separado, na tela do ativo,
 * porque a regra da RED e que nada chega ao catalogo sem decisao explicita —
 * e um formulario longo e exatamente onde um clique distraido publicaria coisa
 * pela metade.
 */
export default function NovoAtivoPage() {
  const router = useRouter();
  const { dados: categorias, carregando, erro, recarregar } = useRecurso("/catalog/categories");
  // Só admin tem ADMIN_READ; um curador recebe 403 aqui. Nesse caso o campo de
  // fornecedor simplesmente não aparece, em vez de mostrar um erro que não é
  // dele resolver.
  // `useLista` e nao `useRecurso`: /users e paginado e devolve { data, meta },
  // entao o recurso cru nao e o array que o select precisa.
  const { linhas: fornecedores, erro: erroFornecedores } = useLista(
    "/users?role=fornecedor&perPage=100"
  );

  const [categoria, setCategoria] = useState("");
  const [fotos, setFotos] = useState([]);
  const [gravando, setGravando] = useState(false);
  const [falha, setFalha] = useState(null);

  const subs = (categorias || []).find((c) => c.id === categoria)?.subcategorias || [];

  const adicionarFotos = (lista) => {
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

    setFalha(recusados.length ? recusados.join(". ") : null);
    setFotos((atuais) => [
      ...atuais,
      ...aceites.map((file) => ({ file, previa: URL.createObjectURL(file) })),
    ]);
  };

  const criar = async (e) => {
    e.preventDefault();
    setFalha(null);
    setGravando(true);

    const f = new FormData(e.currentTarget);
    const texto = (k) => f.get(k)?.toString().trim() || undefined;
    const numero = (k) => (f.get(k) !== "" && f.get(k) != null ? Number(f.get(k)) : undefined);

    const attributes = {};
    for (const c of CAMPOS_TECNICOS) {
      const v = texto(`tec_${c.chave}`);
      if (v) attributes[c.chave] = v;
    }

    try {
      const ativo = await criarAtivo({
        name: texto("name"),
        sku: texto("sku"),
        shortDescription: texto("shortDescription"),
        description: texto("description"),
        categoryId: texto("categoryId"),
        subcategoryId: texto("subcategoryId"),
        supplierId: texto("supplierId"),
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
        ...(Object.keys(attributes).length ? { attributes } : {}),
      });

      // As fotos vão depois: elas precisam do id do ativo, que só existe agora.
      // Se o upload falhar, o ativo já está criado — melhor do que perder o
      // formulário inteiro por causa de uma imagem.
      if (fotos.length) {
        try {
          await anexarFotosAoAtivo(ativo.id, fotos.map((x) => x.file));
        } catch (eFoto) {
          router.push(`/gestao/comercial/ativos/${ativo.id}?fotos=falhou`);
          return;
        }
      }

      router.push(`/gestao/comercial/ativos/${ativo.id}`);
    } catch (e2) {
      setFalha(e2.details?.[0]?.motivo || e2.message);
      setGravando(false);
    }
  };

  return (
    <>
      <PageHeader
        titulo="Novo ativo"
        descricao="Cadastro direto no catálogo, sem passar por envio."
        trilha={[
          { label: "Comercial" },
          { label: "Ativos", href: "/gestao/comercial/ativos" },
          { label: "Novo ativo" },
        ]}
      />

      <EstadoDaTela
        carregando={carregando}
        erro={erro}
        onTentarNovamente={recarregar}
        esqueleto="bloco"
        altura={360}
      >
        <form className={styles.form} onSubmit={criar}>
          <p className={styles.aviso}>
            <PanelIcon name="alert" size={15} />
            <span>
              O ativo é criado em <strong>rascunho</strong>. Ele só aparece no catálogo depois de
              publicado, na própria tela do ativo — assim nada vai ao ar por um clique distraído.
            </span>
          </p>

          {falha && (
            <p className={styles.erro}>
              <PanelIcon name="alert" size={15} />
              {falha}
            </p>
          )}

          <PanelCard titulo="Identificação" descricao="Nome e categoria são obrigatórios.">
            <div className={styles.grid}>
              <PanelField
                label="Nome do ativo"
                name="name"
                placeholder="Ex.: Luminária Linear LED Lumicenter 2,22m 50W"
                required
                minLength={3}
                className={styles.largo}
              />
              <PanelField
                label="Código (SKU)"
                name="sku"
                dica="Deixe vazio para a RED gerar."
              />
              <PanelField label="Localização" name="location" placeholder="Cidade — UF" />
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
              />
              <PanelField
                label="Subcategoria"
                name="subcategoryId"
                as="select"
                key={`sub-${categoria}`}
                opcoes={[
                  { valor: "", label: subs.length ? "Nenhuma" : "Escolha a categoria antes" },
                  ...subs.map((s) => ({ valor: s.id, label: s.name })),
                ]}
              />
              {!erroFornecedores && (
                <PanelField
                  label="Fornecedor"
                  name="supplierId"
                  as="select"
                  className={styles.largo}
                  opcoes={[
                    { valor: "", label: "Nenhum — ativo da própria RED" },
                    ...(fornecedores || []).map((u) => ({
                      valor: u.id,
                      label: `${u.empresa || u.nome || "Sem nome"} · ${u.email}`,
                    })),
                  ]}
                  dica="Define de quem é o repasse quando o ativo for vendido."
                />
              )}
              <PanelField
                label="Descrição curta"
                name="shortDescription"
                as="textarea"
                rows={2}
                className={styles.largo}
                dica="É o texto que aparece no card do catálogo."
              />
              <PanelField
                label="Descrição completa"
                name="description"
                as="textarea"
                rows={5}
                className={styles.largo}
              />
            </div>
          </PanelCard>

          <PanelCard titulo="Fotos">
            {fotos.length > 0 && (
              <ul className={styles.galeria}>
                {fotos.map((f, i) => (
                  <li key={f.previa}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={f.previa} alt={f.file.name} />
                    {i === 0 && <span className={styles.capa}>Capa</span>}
                    <button
                      type="button"
                      onClick={() => {
                        URL.revokeObjectURL(f.previa);
                        setFotos((a) => a.filter((_, j) => j !== i));
                      }}
                      aria-label={`Remover ${f.file.name}`}
                    >
                      <PanelIcon name="close" size={12} />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <label
              className={styles.solta}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                adicionarFotos(e.dataTransfer.files);
              }}
            >
              <input
                type="file"
                accept={TIPOS.join(",")}
                multiple
                className={styles.inputArquivo}
                onChange={(e) => {
                  adicionarFotos(e.target.files);
                  e.target.value = "";
                }}
              />
              <PanelIcon name="image" size={20} />
              <strong>Arraste fotos ou clique para selecionar</strong>
              <span>A primeira é a capa no catálogo. JPG, PNG ou WEBP até {MAX_MB} MB.</span>
            </label>
          </PanelCard>

          <PanelCard titulo="Condição e características">
            <div className={styles.grid}>
              <PanelField
                label="Condição"
                name="condition"
                as="select"
                opcoes={[
                  { valor: "", label: "Não informada" },
                  ...CONDICOES.map((c) => ({ valor: c.valor, label: c.label })),
                ]}
              />
              <PanelField label="Marca" name="brand" />
              <PanelField label="Material" name="material" />
              <PanelField label="Cor" name="color" />
              <PanelField label="Tamanho" name="size" />
            </div>

            <details className={styles.tecnicos}>
              <summary>Ficha técnica</summary>
              <div className={styles.grid}>
                {CAMPOS_TECNICOS.map((c) => (
                  <PanelField key={c.chave} label={c.label} name={`tec_${c.chave}`} />
                ))}
              </div>
            </details>
          </PanelCard>

          <PanelCard titulo="Comercial">
            <div className={styles.grid}>
              <PanelField label="Preço (R$)" name="price" type="number" step="0.01" min="0" />
              <PanelField
                label="Preço de mercado (R$)"
                name="marketPrice"
                type="number"
                step="0.01"
                min="0"
                dica="Referência de quanto custaria novo."
              />
              <PanelField label="Quantidade" name="quantity" type="number" min="0" />
              <PanelField label="Unidade" name="unit" placeholder="unidade, m², caixa…" />
              <PanelField
                label="Modelo comercial"
                name="commercialModel"
                as="select"
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
                opcoes={[
                  { valor: "", label: "Não definida" },
                  ...FORMAS_DE_VENDA.map((m) => ({ valor: m.valor, label: m.label })),
                ]}
              />
              <PanelField
                label="Disponibilidade"
                name="availability"
                as="select"
                opcoes={[
                  { valor: "", label: "Não definida" },
                  ...DISPONIBILIDADE.map((m) => ({ valor: m.valor, label: m.label })),
                ]}
              />
            </div>
          </PanelCard>

          <div className={styles.rodape}>
            <PanelButton href="/gestao/comercial/ativos" variant="ghost">
              Cancelar
            </PanelButton>
            <PanelButton type="submit" size="lg" disabled={gravando}>
              {gravando ? "Criando…" : "Criar ativo"}
            </PanelButton>
          </div>
        </form>
      </EstadoDaTela>
    </>
  );
}
