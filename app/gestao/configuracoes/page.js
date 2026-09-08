"use client";

import PageHeader from "@/components/panel/molecules/PageHeader/PageHeader";
import PanelCard from "@/components/panel/molecules/PanelCard/PanelCard";
import PanelField from "@/components/panel/molecules/PanelField/PanelField";
import PanelButton from "@/components/panel/atoms/PanelButton/PanelButton";
import PanelIcon from "@/components/panel/atoms/PanelIcon/PanelIcon";
import EstadoDaTela from "@/components/panel/molecules/EstadoDaTela/EstadoDaTela";
import { useRecurso, salvarConfiguracoes } from "@/lib/painel/api-cliente";
import { useState } from "react";
import styles from "./configuracoes.module.css";

/**
 * Configuracoes da plataforma.
 *
 * Os percentuais padrao ficam aqui, mas com um aviso explicito: alterar o
 * padrao NAO recalcula venda ja realizada. O percentual e copiado para o ativo
 * e congelado na venda — mudar a tabela hoje muda o proximo ativo, nao o
 * historico. E a secao 8 do documento, e e o erro mais caro de se cometer.
 */
export default function ConfiguracoesPage() {
  const { dados, carregando, erro, recarregar } = useRecurso("/management/settings");
  const [estado, setEstado] = useState({ enviando: false, erro: null, ok: false });

  // A API devolve lista; a tela precisa de mapa por chave.
  const v = Object.fromEntries((dados || []).map((c) => [c.key, c.value]));

  async function salvar(e) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    setEstado({ enviando: true, erro: null, ok: false });
    try {
      await salvarConfiguracoes({
        "split.estoque.fornecedor": Number(d.get("estoque")),
        "split.catalogo.fornecedor": Number(d.get("catalogo")),
        "repasse.prazoHoras": Number(d.get("prazoRepasse")),
        "repasse.alertaHoras": Number(d.get("alertaRepasse")),
        "notificacoes.canal": d.get("canal"),
        "notificacoes.remetente": d.get("remetente"),
      });
      await recarregar();
      setEstado({ enviando: false, erro: null, ok: true });
      setTimeout(() => setEstado((s) => ({ ...s, ok: false })), 4000);
    } catch (e2) {
      setEstado({ enviando: false, erro: e2.details?.[0]?.motivo || e2.message, ok: false });
    }
  }

  return (
    <>
      <PageHeader
        titulo="Configurações"
        descricao="Parâmetros comerciais e operacionais da plataforma."
        trilha={[{ label: "Configurações" }]}
      />

      <EstadoDaTela carregando={carregando} erro={erro} onTentarNovamente={recarregar} altura={400}>
      {dados && (
      <form className={styles.form} onSubmit={salvar}>
        {estado.erro && (
          <p className={styles.avisoErro}>
            <PanelIcon name="alert" size={15} />
            {estado.erro}
          </p>
        )}
        {estado.ok && (
          <p className={styles.avisoOk}>
            <PanelIcon name="checkCircle" size={15} />
            Configurações salvas. Vendas já realizadas não foram alteradas.
          </p>
        )}
        <PanelCard
          titulo="Percentuais padrão por modelo comercial"
          descricao="Aplicados a novos ativos. Cada ativo pode ter percentual próprio, aprovado caso a caso."
        >
          <div className={styles.grade}>
            <PanelField
              label="RED Estoque — fornecedor (%)"
              name="estoque"
              type="number"
              min="0"
              max="100"
              defaultValue={v["split.estoque.fornecedor"]}
              dica="A RED assume guarda física, exposição e comercialização."
            />
            <PanelField
              label="RED Catálogo — fornecedor (%)"
              name="catalogo"
              type="number"
              min="0"
              max="100"
              defaultValue={v["split.catalogo.fornecedor"]}
              dica="O fornecedor mantém a guarda; a RED conduz a comercialização."
            />
          </div>

          <p className={styles.avisoForte}>
            Alterar estes valores afeta apenas ativos futuros. Vendas já realizadas guardam o
            percentual aplicado no momento da transação e não são recalculadas.
          </p>
        </PanelCard>

        <PanelCard titulo="Prazos operacionais">
          <div className={styles.grade}>
            <PanelField
              label="Prazo de repasse (horas)"
              name="prazoRepasse"
              type="number"
              defaultValue={v["repasse.prazoHoras"]}
              dica="Contado a partir do registro de conclusão integral da operação."
            />
            <PanelField
              label="Alerta de repasse vencendo (horas)"
              name="alertaRepasse"
              type="number"
              defaultValue={v["repasse.alertaHoras"]}
              dica="Quando o painel passa a destacar o repasse como urgente."
            />
          </div>
        </PanelCard>

        <PanelCard titulo="Notificações">
          <div className={styles.grade}>
            <PanelField
              label="Canal de notificação"
              name="canal"
              as="select"
              defaultValue={v["notificacoes.canal"]}
              opcoes={[
                { valor: "painel-email", label: "Painel + e-mail" },
                { valor: "painel", label: "Somente painel" },
              ]}
              dica="Push e SMS não fazem parte da V1."
            />
            <PanelField
              label="E-mail remetente"
              name="remetente"
              type="email"
              defaultValue={v["notificacoes.remetente"] || ""}
            />
          </div>
        </PanelCard>

        <div className={styles.acao}>
          <PanelButton type="submit" variant="success" disabled={estado.enviando}>
            {estado.enviando ? "Salvando…" : "Salvar configurações"}
          </PanelButton>
        </div>
      </form>
      )}
      </EstadoDaTela>
    </>
  );
}
