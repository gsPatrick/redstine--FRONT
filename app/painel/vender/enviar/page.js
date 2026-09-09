"use client";

import { useEffect, useRef, useState } from "react";
import PageHeader from "@/components/panel/molecules/PageHeader/PageHeader";
import PanelCard from "@/components/panel/molecules/PanelCard/PanelCard";
import PanelField from "@/components/panel/molecules/PanelField/PanelField";
import PanelButton from "@/components/panel/atoms/PanelButton/PanelButton";
import PanelIcon from "@/components/panel/atoms/PanelIcon/PanelIcon";
import EstadoDaTela from "@/components/panel/molecules/EstadoDaTela/EstadoDaTela";
import { useRecurso, enviarAtivo, enviarFotosDoAtivo } from "@/lib/painel/api-cliente";
import styles from "./enviar.module.css";

/** Os cinco valores oficiais de condição, iguais aos do filtro do catálogo. */
const CONDICOES = [
  { valor: "", label: "Selecione…" },
  { valor: "sem_uso", label: "Sem uso" },
  { valor: "seminovo", label: "Seminovo" },
  { valor: "usado_bom", label: "Usado em bom estado" },
  { valor: "usado_sinais", label: "Usado com sinais de uso" },
  { valor: "necessita_reparo", label: "Necessita reparo" },
];

const MAX_FOTOS = 8;
const MAX_MB = 8;
const TIPOS = ["image/jpeg", "image/png", "image/webp", "image/avif"];

/**
 * Enviar Ativos.
 *
 * Entrada de ativos para AVALIACAO — nao publicacao. Nenhum ativo enviado aqui
 * chega ao catalogo sozinho: passa por curadoria, precificacao e aprovacao do
 * proprio fornecedor antes de ser publicado. O aviso no topo diz isso ao
 * utilizador antes de ele preencher, e nao depois.
 */
export default function EnviarAtivosPage() {
  const [categoria, setCategoria] = useState("");
  const [fotos, setFotos] = useState([]);
  const inputFotos = useRef(null);
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);

  // As pré-visualizações são object URLs: sem revogar, cada foto escolhida
  // deixa um blob preso na memória da aba até a página ser recarregada.
  useEffect(() => () => fotos.forEach((f) => URL.revokeObjectURL(f.previa)), [fotos]);

  const adicionarFotos = (lista) => {
    const escolhidos = Array.from(lista || []);
    if (!escolhidos.length) return;

    const recusados = [];
    const aceites = [];

    for (const file of escolhidos) {
      if (!TIPOS.includes(file.type)) {
        recusados.push(`${file.name}: formato não aceito`);
      } else if (file.size > MAX_MB * 1024 * 1024) {
        recusados.push(`${file.name}: acima de ${MAX_MB} MB`);
      } else {
        aceites.push(file);
      }
    }

    setFotos((atuais) => {
      const espaco = MAX_FOTOS - atuais.length;
      if (aceites.length > espaco) {
        recusados.push(`o limite é de ${MAX_FOTOS} fotos por envio`);
      }
      const novas = aceites.slice(0, Math.max(0, espaco)).map((file) => ({
        file,
        previa: URL.createObjectURL(file),
      }));
      return [...atuais, ...novas];
    });

    // Dizer o que ficou de fora é o ponto: antes o ficheiro simplesmente
    // sumia e o utilizador não tinha como saber por quê.
    setErro(recusados.length ? recusados.join(". ") : null);
  };

  const removerFoto = (i) =>
    setFotos((atuais) => {
      URL.revokeObjectURL(atuais[i].previa);
      return atuais.filter((_, j) => j !== i);
    });

  // Categorias e subcategorias vêm do catálogo real: uma lista fixa aqui
  // ficaria desatualizada no dia em que a RED criar uma subcategoria nova.
  const { dados: categorias, carregando } = useRecurso("/catalog/categories");
  const subs = (categorias || []).find((c) => c.id === categoria)?.subcategorias || [];

  if (enviado) {
    return (
      <>
        <PageHeader titulo="Enviar Ativos" trilha={[{ label: "Vender" }, { label: "Enviar Ativos" }]} />
        <PanelCard className={styles.sucesso}>
          <span className={styles.selo}>
            <PanelIcon name="checkCircle" size={26} />
          </span>
          <h2>Ativo enviado para avaliação.</h2>
          <p>
            A curadoria RED analisa procedência, condição, localização e potencial comercial. Você
            recebe um aviso aqui e por e-mail com o preço e o modelo recomendados — a publicação só
            acontece depois da sua aprovação.
          </p>
          <div className={styles.acoesSucesso}>
            <PanelButton href="/painel/vender/ativos" size="sm">
              Ver em Meus Ativos
            </PanelButton>
            <PanelButton variant="outline" size="sm" onClick={() => setEnviado(false)}>
              Enviar outro ativo
            </PanelButton>
          </div>
        </PanelCard>
      </>
    );
  }

  return (
    <>
      <PageHeader
        titulo="Enviar Ativos"
        descricao="Envie um ativo para avaliação da curadoria RED."
        trilha={[{ label: "Vender" }, { label: "Enviar Ativos" }]}
      />

      <div className={styles.aviso}>
        <PanelIcon name="alert" size={16} />
        <p>
          O envio não garante aceitação, publicação ou venda. Todo ativo passa por avaliação e
          aprovação RED antes de entrar no catálogo.
        </p>
      </div>

      <form
        className={styles.form}
        onSubmit={async (e) => {
          e.preventDefault();
          setErro(null);
          setEnviando(true);
          const d = new FormData(e.currentTarget);
          try {
            // As fotos sobem primeiro: o envio guarda apenas os URLs. Se o
            // upload falhar, nada é criado — melhor do que gravar um envio
            // sem as fotos que o fornecedor achou que tinha mandado.
            let urls;
            if (fotos.length) {
              const guardadas = await enviarFotosDoAtivo(fotos.map((f) => f.file));
              urls = guardadas.map((g) => g.url);
            }

            await enviarAtivo({
              fotos: urls,
              nome: d.get("nome"),
              categoryId: d.get("categoria") || undefined,
              subcategoryId: d.get("subcategoria") || undefined,
              quantidade: Number(d.get("quantidade")),
              unidade: d.get("unidade"),
              condicao: d.get("condicao") || undefined,
              local: d.get("local"),
              observacoes: d.get("observacoes") || undefined,
            });
            setEnviado(true);
          } catch (e2) {
            setErro(e2.details?.[0]?.motivo || e2.message);
            setEnviando(false);
          }
        }}
      >
        {erro && (
          <p className={styles.erro}>
            <PanelIcon name="alert" size={15} />
            {erro}
          </p>
        )}

        <PanelCard titulo="Sobre o ativo">
          <div className={styles.grade}>
            <PanelField
              label="Nome / descrição do ativo"
              name="nome"
              placeholder="Ex.: Lote de Tubos PVC Tigre 100mm"
              required
              className={styles.largo}
            />
            <PanelField
              label="Categoria"
              name="categoria"
              as="select"
              opcoes={[
                { valor: "", label: carregando ? "Carregando…" : "Selecione…" },
                ...(categorias || []).map((c) => ({ valor: c.id, label: c.name })),
              ]}
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              required
            />
            <PanelField
              label="Subcategoria"
              name="subcategoria"
              as="select"
              disabled={!subs.length}
              opcoes={[
                { valor: "", label: subs.length ? "Selecione…" : "Escolha a categoria primeiro" },
                ...subs.map((sc) => ({ valor: sc.id, label: sc.name })),
              ]}
            />
            <PanelField label="Quantidade" name="quantidade" type="number" min="1" placeholder="100" required />
            <PanelField
              label="Unidade"
              name="unidade"
              as="select"
              opcoes={[
                { valor: "unidade", label: "unidades" },
                { valor: "m2", label: "m²" },
                { valor: "m", label: "metros" },
                { valor: "lote", label: "lote" },
                { valor: "kg", label: "kg" },
              ]}
            />
            <PanelField label="Condição" name="condicao" as="select" opcoes={CONDICOES} required />
            <PanelField
              label="Localização do ativo"
              name="local"
              placeholder="Cidade — UF"
              required
            />
          </div>
        </PanelCard>

        <PanelCard
          titulo="Fotos do ativo"
          descricao={`Fotos reais aceleram a avaliação. Até ${MAX_FOTOS} imagens.`}
        >
          {fotos.length > 0 && (
            <ul className={styles.galeria}>
              {fotos.map((f, i) => (
                <li key={f.previa} className={styles.miniatura}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={f.previa} alt={f.file.name} />
                  <button
                    type="button"
                    className={styles.remover}
                    onClick={() => removerFoto(i)}
                    aria-label={`Remover ${f.file.name}`}
                    title="Remover"
                  >
                    <PanelIcon name="close" size={13} />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {fotos.length < MAX_FOTOS && (
            <label
              className={styles.upload}
              onDragOver={(ev) => ev.preventDefault()}
              onDrop={(ev) => {
                ev.preventDefault();
                adicionarFotos(ev.dataTransfer.files);
              }}
            >
              <input
                ref={inputFotos}
                type="file"
                accept={TIPOS.join(",")}
                multiple
                className={styles.inputArquivo}
                onChange={(ev) => {
                  adicionarFotos(ev.target.files);
                  // Sem limpar, escolher o mesmo ficheiro outra vez não
                  // dispara change e parece que o clique não fez nada.
                  ev.target.value = "";
                }}
              />
              <PanelIcon name="image" size={22} />
              <strong>Arraste as fotos ou clique para selecionar</strong>
              <span>
                JPG, PNG ou WEBP até {MAX_MB} MB cada
                {fotos.length ? ` · ${MAX_FOTOS - fotos.length} restantes` : ""}
              </span>
            </label>
          )}
        </PanelCard>

        <PanelCard titulo="Observações">
          <PanelField
            name="observacoes"
            as="textarea"
            placeholder="Contexto útil para a curadoria: origem, prazo para retirada, restrições de acesso, necessidade de desmontagem…"
            dica="Quanto mais claro o contexto logístico, mais rápida e precisa é a avaliação."
          />
        </PanelCard>

        <div className={styles.rodape}>
          <PanelButton type="submit" size="lg" variant="success" disabled={enviando}>
            {enviando ? (fotos.length ? "Enviando fotos…" : "Enviando…") : "Enviar para avaliação"}
          </PanelButton>
        </div>
      </form>
    </>
  );
}
