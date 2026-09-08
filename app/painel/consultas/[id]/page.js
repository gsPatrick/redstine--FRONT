"use client";

import { useParams } from "next/navigation";
import PageHeader from "@/components/panel/molecules/PageHeader/PageHeader";
import PanelCard from "@/components/panel/molecules/PanelCard/PanelCard";
import PanelButton from "@/components/panel/atoms/PanelButton/PanelButton";
import StatusPill from "@/components/panel/atoms/StatusPill/StatusPill";
import PanelIcon from "@/components/panel/atoms/PanelIcon/PanelIcon";
import EstadoDaTela from "@/components/panel/molecules/EstadoDaTela/EstadoDaTela";
import { useRecurso } from "@/lib/painel/api-cliente";
import { moeda, quantidade, data as fmtData } from "@/lib/painel/formato";
import styles from "./detalhe.module.css";

/**
 * Detalhe da consulta.
 *
 * O CTA "Comprar" só aparece quando a RED já respondeu com condições E o ativo
 * segue publicado — quem decide isso é a API (`podeComprar`), não a tela.
 * Oferecer o botão antes levaria a uma compra sobre condições que ainda não
 * existem.
 */
export default function DetalheConsultaPage() {
  const { id } = useParams();
  const { dados: c, carregando, erro, recarregar } = useRecurso(`/me/consultations/${id}`);

  return (
    <>
      <PageHeader
        titulo={c?.produto || "Consulta"}
        trilha={[
          { label: "Comprar" },
          { label: "Minhas Consultas", href: "/painel/consultas" },
          { label: "Detalhe" },
        ]}
        acoes={
          <>
            <PanelButton href="/painel/consultas" variant="outline" icon="arrowLeft" size="sm">
              Voltar
            </PanelButton>
            {c?.podeComprar && (
              <PanelButton href={c.slug ? `/produto/${c.slug}` : "/shop"} size="sm">
                Comprar
              </PanelButton>
            )}
          </>
        }
      />

      <EstadoDaTela carregando={carregando} erro={erro} onTentarNovamente={recarregar} altura={320}>
        {c && (
          <div className={styles.grade}>
            <div className={styles.coluna}>
              <PanelCard titulo="Sua mensagem">
                <p className={styles.mensagem}>{c.mensagem || "—"}</p>
                <span className={styles.assinatura}>
                  Enviada em {fmtData(c.data, { comHora: true })}
                </span>
              </PanelCard>

              <PanelCard titulo="Resposta da RED">
                {c.resposta ? (
                  <>
                    <p className={styles.mensagem}>{c.resposta}</p>
                    {c.precoCotado != null && (
                      <p className={styles.cotado}>
                        <PanelIcon name="tag" size={14} />
                        Condição informada: <strong>{moeda(c.precoCotado)}</strong>
                      </p>
                    )}
                    <span className={styles.assinatura}>
                      Respondida em {fmtData(c.respondidaEm || c.atualizacao, { comHora: true })}
                    </span>
                  </>
                ) : (
                  <p className={styles.aguardando}>
                    O comercial da RED ainda está avaliando esta consulta. Você recebe um aviso aqui
                    e por e-mail assim que houver resposta.
                  </p>
                )}
              </PanelCard>
            </div>

            <PanelCard titulo="Consulta" className={styles.lado}>
              <div className={styles.foto}>
                {c.imagem ? <img src={c.imagem} alt={c.produto} /> : <PanelIcon name="image" size={24} />}
              </div>
              <dl className={styles.linhas}>
                <div>
                  <dt>Produto</dt>
                  <dd>{c.produto}</dd>
                </div>
                <div>
                  <dt>Quantidade consultada</dt>
                  <dd>{quantidade(c.quantidade)}</dd>
                </div>
                <div>
                  <dt>Data</dt>
                  <dd>{fmtData(c.data)}</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>
                    <StatusPill status={c.status} />
                  </dd>
                </div>
                <div>
                  <dt>Última atualização</dt>
                  <dd>{fmtData(c.atualizacao, { comHora: true })}</dd>
                </div>
              </dl>
            </PanelCard>
          </div>
        )}
      </EstadoDaTela>
    </>
  );
}
