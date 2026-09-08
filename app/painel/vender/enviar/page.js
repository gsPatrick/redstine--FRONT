"use client";

import { useState } from "react";
import PageHeader from "@/components/panel/molecules/PageHeader/PageHeader";
import PanelCard from "@/components/panel/molecules/PanelCard/PanelCard";
import PanelField from "@/components/panel/molecules/PanelField/PanelField";
import PanelButton from "@/components/panel/atoms/PanelButton/PanelButton";
import PanelIcon from "@/components/panel/atoms/PanelIcon/PanelIcon";
import EstadoDaTela from "@/components/panel/molecules/EstadoDaTela/EstadoDaTela";
import { useRecurso, enviarAtivo } from "@/lib/painel/api-cliente";
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
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);

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
            await enviarAtivo({
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

        <PanelCard titulo="Fotos do ativo" descricao="Fotos reais aceleram a avaliação. Até 8 imagens.">
          <label className={styles.upload}>
            <input type="file" accept="image/*" multiple className={styles.inputArquivo} />
            <PanelIcon name="image" size={22} />
            <strong>Arraste as fotos ou clique para selecionar</strong>
            <span>JPG, PNG ou WEBP até 8 MB cada</span>
          </label>
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
            {enviando ? "Enviando…" : "Enviar para avaliação"}
          </PanelButton>
        </div>
      </form>
    </>
  );
}
