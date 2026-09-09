"use client";

import Link from "next/link";
import PageHeader from "@/components/panel/molecules/PageHeader/PageHeader";
import PanelCard from "@/components/panel/molecules/PanelCard/PanelCard";
import PanelButton from "@/components/panel/atoms/PanelButton/PanelButton";
import PanelIcon from "@/components/panel/atoms/PanelIcon/PanelIcon";
import EstadoDaTela from "@/components/panel/molecules/EstadoDaTela/EstadoDaTela";
import { useLista, lerNotificacao, lerTodasNotificacoes } from "@/lib/painel/api-cliente";
import { tempoRelativo } from "@/lib/painel/formato";
import styles from "./notificacoes.module.css";

const ICONE_POR_TIPO = {
  consulta_respondida: "chat",
  nova_consulta: "chat",
  compra_confirmada: "cart",
  compra_pronta_retirada: "cart",
  ativo_aguardando_aprovacao: "box",
  ativo_publicado: "box",
  novo_envio: "box",
  ativo_vendido: "tag",
  venda_realizada: "tag",
  valor_a_receber: "wallet",
  pagamento_realizado: "wallet",
  repasse_pendente: "wallet",
};

/**
 * Todas as notificações.
 *
 * O sino mostra só as seis mais recentes e tinha um "Ver todas" que não levava
 * a lugar nenhum. Esta é a lista completa, com o histórico já lido junto: uma
 * notificação lida continua sendo o registo de que algo aconteceu.
 */
export default function NotificacoesPage() {
  const { linhas, carregando, erro, recarregar } = useLista("/notifications?perPage=100");

  const naoLidas = (linhas || []).filter((n) => !n.readAt);

  const marcarUma = async (n) => {
    if (n.readAt) return;
    await lerNotificacao(n.id).catch(() => {});
    recarregar();
  };

  const marcarTodas = async () => {
    await lerTodasNotificacoes().catch(() => {});
    recarregar();
  };

  return (
    <>
      <PageHeader
        titulo="Notificações"
        descricao="Tudo o que aconteceu na sua conta."
        acoes={
          naoLidas.length > 0 ? (
            <PanelButton variant="ghost" onClick={marcarTodas}>
              Marcar todas como lidas
            </PanelButton>
          ) : null
        }
      />

      <PanelCard>
        <EstadoDaTela
          carregando={carregando}
          erro={erro}
          onTentarNovamente={recarregar}
          esqueleto="bloco"
          altura={260}
        >
          {!linhas?.length ? (
            <div className={styles.vazio}>
              <span className={styles.seloVazio}>
                <PanelIcon name="bell" size={20} />
              </span>
              <p className={styles.tituloVazio}>Nenhuma notificação por enquanto.</p>
              <p className={styles.detalheVazio}>
                Avisos de consultas, compras, publicações e repasses aparecem aqui.
              </p>
            </div>
          ) : (
          <ul className={styles.lista}>
            {(linhas || []).map((n) => {
              const conteudo = (
                <>
                  <span className={`${styles.icone} ${n.readAt ? "" : styles.viva}`}>
                    <PanelIcon name={ICONE_POR_TIPO[n.type] || "bell"} size={15} />
                  </span>
                  <span className={styles.texto}>
                    <strong>{n.title}</strong>
                    {n.body ? <span className={styles.corpo}>{n.body}</span> : null}
                    <span className={styles.quando}>{tempoRelativo(n.createdAt)}</span>
                  </span>
                  {!n.readAt && <span className={styles.ponto} aria-hidden="true" />}
                </>
              );

              return (
                <li key={n.id}>
                  {/* Nem toda notificação tem destino; nesse caso a linha não
                      finge ser clicável. */}
                  {n.link ? (
                    <Link
                      href={n.link}
                      className={`${styles.linha} ${n.readAt ? styles.lida : ""}`}
                      onClick={() => marcarUma(n)}
                    >
                      {conteudo}
                    </Link>
                  ) : (
                    <div className={`${styles.linha} ${styles.semLink} ${n.readAt ? styles.lida : ""}`}>
                      {conteudo}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
          )}
        </EstadoDaTela>
      </PanelCard>
    </>
  );
}
