"use client";

import { useState } from "react";
import PanelField from "@/components/panel/molecules/PanelField/PanelField";
import PanelButton from "@/components/panel/atoms/PanelButton/PanelButton";
import PanelIcon from "@/components/panel/atoms/PanelIcon/PanelIcon";
import StatusPill from "@/components/panel/atoms/StatusPill/StatusPill";
import EstadoDaTela from "@/components/panel/molecules/EstadoDaTela/EstadoDaTela";
import {
  useRecurso,
  useLista,
  responderConsulta,
  atribuirConsulta,
  mudarStatusDaConsulta,
} from "@/lib/painel/api-cliente";
import { moeda, data as fmtData } from "@/lib/painel/formato";
import styles from "./consultas.module.css";

const ROTULO_STATUS = {
  nova: "Nova",
  em_atendimento: "Em atendimento",
  respondida: "Respondida",
  encerrada: "Encerrada",
};

/**
 * Atendimento de uma consulta.
 *
 * "Consultar Condições" é uma modalidade da plataforma, não um formulário de
 * contato: a consulta tem dono, resposta com preço e um encerramento. As três
 * coisas vivem aqui porque são um só atendimento — separá-las faria responder
 * sem ver o que o comprador escreveu.
 *
 * O preço respondido é o que o comprador vê para decidir. Por isso a resposta
 * não é só texto livre: tem campo de valor, e é ele que fecha a negociação.
 */
export default function Atendimento({ id, aoMudar }) {
  const { dados: consulta, carregando, erro, recarregar } = useRecurso(`/quotes/${id}`);
  // Só quem tem acesso à gestão pode ser responsável por um atendimento.
  const { linhas: equipe } = useLista("/users?perPage=100");

  const [gravando, setGravando] = useState(false);
  const [falha, setFalha] = useState(null);

  const atualizar = () => {
    recarregar();
    aoMudar?.();
  };

  const proteger = async (fn) => {
    setFalha(null);
    setGravando(true);
    try {
      await fn();
      atualizar();
    } catch (e) {
      setFalha(e.details?.[0]?.motivo || e.message);
    } finally {
      setGravando(false);
    }
  };

  const responder = (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const preco = f.get("quotedPrice");
    proteger(() =>
      responderConsulta(id, {
        quotedPrice: preco !== "" && preco != null ? Number(preco) : undefined,
        responseNotes: f.get("responseNotes")?.toString().trim() || undefined,
      })
    );
  };

  const encerrada = consulta?.status === "encerrada";

  return (
    <EstadoDaTela
      carregando={carregando}
      erro={erro}
      onTentarNovamente={recarregar}
      esqueleto="bloco"
      altura={320}
    >
      {consulta ? (
        <div className={styles.atendimento}>
          {falha && (
            <p className={styles.erroForm}>
              <PanelIcon name="alert" size={15} />
              {falha}
            </p>
          )}

          <div className={styles.topoAtendimento}>
            <span className={styles.ref}>{consulta.reference}</span>
            <StatusPill status={ROTULO_STATUS[consulta.status] || consulta.status} />
          </div>

          <dl className={styles.dadosConsulta}>
            <Dado rotulo="Ativo" valor={consulta.ativo?.name} largo />
            <Dado rotulo="Quantidade" valor={consulta.quantity} />
            <Dado rotulo="Recebida em" valor={fmtData(consulta.createdAt, { comHora: true })} />
            <Dado rotulo="Comprador" valor={consulta.buyerName} />
            <Dado rotulo="Empresa" valor={consulta.company} />
            <Dado rotulo="E-mail" valor={consulta.buyerEmail} />
            <Dado rotulo="Telefone" valor={consulta.buyerPhone} />
            <Dado rotulo="Mensagem" valor={consulta.message} largo />
          </dl>

          <div className={styles.blocoAtendimento}>
            <PanelField
              label="Responsável pelo atendimento"
              name="assignedTo"
              as="select"
              value={consulta.assignedTo || ""}
              disabled={gravando || encerrada}
              onChange={(e) =>
                e.target.value && proteger(() => atribuirConsulta(id, e.target.value))
              }
              opcoes={[
                { valor: "", label: "Sem responsável" },
                ...(equipe || [])
                  .filter((u) => u.acessaPainelDeGestao)
                  .map((u) => ({ valor: u.id, label: `${u.nome || u.email}` })),
              ]}
              dica="A consulta passa a Em atendimento assim que ganha dono."
            />
          </div>

          {consulta.respondedAt && (
            <div className={styles.respostaDada}>
              <strong>Resposta enviada em {fmtData(consulta.respondedAt, { comHora: true })}</strong>
              {consulta.quotedPrice != null && (
                <span className={styles.precoDado}>
                  Preço proposto: {moeda(Number(consulta.quotedPrice))}
                </span>
              )}
              {consulta.responseNotes && <p>{consulta.responseNotes}</p>}
            </div>
          )}

          {!encerrada && (
            <form className={styles.formResposta} onSubmit={responder}>
              <strong className={styles.tituloBloco}>
                {consulta.respondedAt ? "Enviar nova resposta" : "Responder"}
              </strong>
              <PanelField
                label="Preço proposto (R$)"
                name="quotedPrice"
                type="number"
                step="0.01"
                min="0"
                defaultValue={consulta.quotedPrice ?? ""}
                dica="É o valor que o comprador vê para decidir."
              />
              <PanelField
                label="Condições e observações"
                name="responseNotes"
                as="textarea"
                rows={4}
                defaultValue={consulta.responseNotes || ""}
                dica="Prazo de retirada, forma de pagamento, restrições."
              />
              <div className={styles.acoesAtendimento}>
                <PanelButton
                  type="button"
                  variant="ghost"
                  disabled={gravando}
                  onClick={() => {
                    if (!window.confirm("Encerrar esta consulta? Ela deixa de aceitar resposta.")) return;
                    proteger(() => mudarStatusDaConsulta(id, "encerrada"));
                  }}
                >
                  Encerrar
                </PanelButton>
                <PanelButton type="submit" disabled={gravando}>
                  {gravando ? "Enviando…" : "Enviar resposta"}
                </PanelButton>
              </div>
            </form>
          )}

          {encerrada && (
            <p className={styles.encerrada}>
              Consulta encerrada
              {consulta.closedAt ? ` em ${fmtData(consulta.closedAt, { comHora: true })}` : ""}.
            </p>
          )}
        </div>
      ) : null}
    </EstadoDaTela>
  );
}

function Dado({ rotulo, valor, largo = false }) {
  if (valor === null || valor === undefined || valor === "") return null;
  return (
    <div className={largo ? styles.itemLargo : styles.item}>
      <dt>{rotulo}</dt>
      <dd>{valor}</dd>
    </div>
  );
}
