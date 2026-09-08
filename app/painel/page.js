"use client";

import Link from "next/link";
import PanelCard from "@/components/panel/molecules/PanelCard/PanelCard";
import PanelButton from "@/components/panel/atoms/PanelButton/PanelButton";
import PanelIcon from "@/components/panel/atoms/PanelIcon/PanelIcon";
import EstadoDaTela from "@/components/panel/molecules/EstadoDaTela/EstadoDaTela";
import { moeda, numero, data as fmtData } from "@/lib/painel/formato";
import { useRecurso } from "@/lib/painel/api-cliente";
import { useSession } from "@/lib/auth/SessionContext";
import styles from "./page.module.css";

/**
 * Visão Geral.
 *
 * Uma chamada pinta a página inteira: `/me/overview` já devolve os dois blocos
 * e as últimas atividades. Encadear três requisições aqui faria a tela montar
 * em pedaços, com os números aparecendo em ordem aleatória.
 *
 * "Recebido" não aparece no bloco Vender de propósito: a Visão Geral resume,
 * quem detalha dinheiro é a página Financeiro.
 */
export default function VisaoGeralPage() {
  const { utilizador } = useSession();
  const { dados, carregando, erro, recarregar } = useRecurso("/me/overview");

  return (
    <>
      <header className={styles.saudacao}>
        <h1>Olá, {utilizador?.name || ""}.</h1>
        <p>Acompanhe suas compras, consultas, ativos e resultados na RED.</p>
      </header>

      <EstadoDaTela carregando={carregando} erro={erro} onTentarNovamente={recarregar} altura={320}>
        {dados && (
          <>
            <div className={styles.blocos}>
              <PanelCard className={styles.bloco} padding="lg">
                <div className={styles.blocoTopo}>
                  <span className={`${styles.selo} ${styles.seloCompra}`}>
                    <PanelIcon name="cart" size={16} />
                  </span>
                  <h2>Comprar</h2>
                </div>

                <div className={styles.numeros}>
                  <Indicador rotulo="Compras" valor={numero(dados.comprar.compras)} href="/painel/compras" />
                  <Indicador rotulo="Consultas" valor={numero(dados.comprar.consultas)} href="/painel/consultas" />
                  <Indicador rotulo="Favoritos" valor={numero(dados.comprar.favoritos)} href="/painel/favoritos" />
                </div>

                <PanelButton href="/painel/compras" variant="success" className={styles.cta}>
                  Ver minhas compras
                </PanelButton>
              </PanelCard>

              <PanelCard className={styles.bloco} padding="lg">
                <div className={styles.blocoTopo}>
                  <span className={`${styles.selo} ${styles.seloVenda}`}>
                    <PanelIcon name="tag" size={16} />
                  </span>
                  <h2>Vender</h2>
                </div>

                <div className={styles.numeros}>
                  <Indicador
                    rotulo="Ativos publicados"
                    valor={numero(dados.vender.ativosPublicados)}
                    href="/painel/vender/ativos"
                    verLabel="Ver ativos"
                  />
                  <Indicador
                    rotulo="Ativos vendidos"
                    valor={numero(dados.vender.ativosVendidos)}
                    href="/painel/vender/vendas"
                    verLabel="Ver vendas"
                  />
                  <Indicador
                    rotulo="Receita potencial"
                    valor={moeda(dados.vender.receitaPotencial, { curta: true })}
                    href="/painel/vender/financeiro"
                    verLabel="Ver detalhes"
                  />
                </div>

                <div className={styles.receber}>
                  <span className={styles.receberRotulo}>A receber</span>
                  <strong className={styles.receberValor}>{moeda(dados.vender.aReceber)}</strong>
                </div>

                <PanelButton href="/painel/vender" className={styles.cta}>
                  Acessar painel de vendas
                </PanelButton>
              </PanelCard>
            </div>

            <PanelCard
              titulo="Últimas atividades"
              acao={
                <Link href="/painel/compras" className={styles.verTudo}>
                  Ver todas as notificações
                </Link>
              }
            >
              {dados.atividades?.length ? (
                <ul className={styles.atividades}>
                  {dados.atividades.map((a) => (
                    <li key={a.id}>
                      <Link href={a.href || "#"}>
                        <PanelIcon name="checkCircle" size={16} className={styles.check} />
                        <span className={styles.atividadeTitulo}>{a.titulo}</span>
                        <time>{fmtData(a.data, { comHora: true })}</time>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.semAtividade}>
                  Nada por aqui ainda. Suas movimentações aparecem nesta lista.
                </p>
              )}
            </PanelCard>
          </>
        )}
      </EstadoDaTela>
    </>
  );
}

function Indicador({ rotulo, valor, href, verLabel = "Ver todas" }) {
  return (
    <div className={styles.indicador}>
      <span className={styles.indRotulo}>{rotulo}</span>
      <strong className={styles.indValor}>{valor}</strong>
      <Link href={href} className={styles.indLink}>
        {verLabel}
      </Link>
    </div>
  );
}
