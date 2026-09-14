"use client";

import PanelModal from "@/components/panel/molecules/PanelModal/PanelModal";
import StatusPill from "@/components/panel/atoms/StatusPill/StatusPill";
import PanelIcon from "@/components/panel/atoms/PanelIcon/PanelIcon";
import EstadoDaTela from "@/components/panel/molecules/EstadoDaTela/EstadoDaTela";
import { useRecurso } from "@/lib/painel/api-cliente";
import { moeda, numero, data } from "@/lib/painel/formato";
import { TOM_STATUS_OPERACIONAL } from "@/lib/painel/operacao";
import styles from "./operacao.module.css";

/**
 * Detalhe operacional de um ativo.
 *
 * O que a coluna "Ação" da tabela abre. Reúne o que é preciso para AGIR: de
 * quem é a guarda e como se fala com ela, quanto saldo há, há quanto tempo está
 * parado, e quais retiradas estão pendentes com pedido, comprador e
 * agendamento.
 *
 * Nada financeiro entra aqui: o único valor é o anunciado, o mesmo da tabela.
 * Receita da RED, repasse e custos são do Financeiro, e o perfil de Operação
 * não os alcança nem por URL.
 *
 * Diálogo e não página: a informação é curta, e sair da tabela para voltar a
 * ela a cada ativo perde a fila de trabalho que a pessoa estava a percorrer.
 */
export default function DetalheOperacional({ id, aoFechar }) {
  // Só busca quando há ativo aberto — a tela não carrega um detalhe que
  // ninguém pediu a cada render da tabela.
  const { dados, carregando, erro, recarregar } = useRecurso(
    id ? `/management/operation/assets/${id}` : null,
    { ativo: !!id }
  );

  return (
    <PanelModal
      aberto={!!id}
      aoFechar={aoFechar}
      titulo={dados?.nome || "Detalhe operacional"}
      descricao={dados ? `${dados.codigo || "sem código"} · ${dados.modelo}` : null}
      largura={640}
    >
      <EstadoDaTela carregando={carregando} erro={erro} onTentarNovamente={recarregar} altura={260}>
        {dados && (
          <div className={styles.detalhe}>
            <div className={styles.detTopo}>
              <StatusPill
                status={dados.statusOperacional}
                tone={TOM_STATUS_OPERACIONAL[dados.statusOperacionalChave]}
              />
              <span className={styles.tag}>Ciclo de vida: {dados.statusCicloDeVida}</span>
            </div>

            <dl className={styles.campos}>
              <Campo rotulo="Guarda" valor={dados.guarda === "red" ? "RED" : "Fornecedor"} />
              <Campo rotulo="Proprietário" valor={dados.proprietario} />
              <Campo rotulo="Categoria" valor={dados.subcategoria || dados.categoria} />
              <Campo rotulo="Condição" valor={dados.condicao} />
              <Campo
                rotulo="Localização"
                valor={dados.local}
                // O vazio aparece como pendência, não como traço: é exatamente
                // o dado que falta para responder "onde está o ativo".
                falta="não registrada"
              />
              <Campo
                rotulo="Saldo disponível"
                valor={`${numero(dados.quantidade)} ${dados.unidade} de ${numero(
                  dados.quantidadeOriginal
                )}`}
              />
              <Campo rotulo="Já vendido" valor={`${numero(dados.quantidadeVendida)} ${dados.unidade}`} />
              <Campo rotulo="Valor anunciado do saldo" valor={moeda(dados.valor)} />
              <Campo
                rotulo="Dias em estoque"
                valor={
                  dados.diasEmEstoque === null
                    ? null
                    : `${numero(dados.diasEmEstoque)} dias · desde ${data(dados.referenciaEstoque)}`
                }
              />
            </dl>

            {/* Só para RED Catálogo: é o único modelo em que o ativo está com
                terceiro e alguém precisa de um telefone para o mover. */}
            {dados.contatoDaGuarda && (
              <div className={styles.contato}>
                <PanelIcon name="pin" size={14} />
                <span>
                  <strong>Contato da guarda:</strong> {dados.contatoDaGuarda.nome}
                  {dados.contatoDaGuarda.telefone ? ` · ${dados.contatoDaGuarda.telefone}` : ""}
                  {dados.contatoDaGuarda.cidade ? ` · ${dados.contatoDaGuarda.cidade}` : ""}
                </span>
              </div>
            )}

            <h3 className={styles.subtitulo}>Retiradas pendentes</h3>
            {dados.retiradas.length === 0 ? (
              <p className={styles.semDado}>Nenhuma carga deste ativo à espera de sair.</p>
            ) : (
              <ul className={styles.retiradas}>
                {dados.retiradas.map((r) => (
                  <li key={r.itemId} className={r.atrasada ? styles.atrasada : ""}>
                    <span className={styles.pendTexto}>
                      <strong>
                        {r.pedido} · {r.comprador}
                      </strong>
                      <span>
                        {numero(r.quantidade)} {dados.unidade}
                        {r.localRetirada ? ` · ${r.localRetirada}` : ""}
                        {r.agendadaPara ? ` · agendada para ${data(r.agendadaPara)}` : ""}
                      </span>
                    </span>
                    <StatusPill
                      status={r.atrasada ? "Atrasada" : r.situacao}
                      tone={r.atrasada ? "danger" : "warn"}
                      size="sm"
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </EstadoDaTela>
    </PanelModal>
  );
}

function Campo({ rotulo, valor, falta = "—" }) {
  return (
    <div className={styles.campo}>
      <dt>{rotulo}</dt>
      <dd>{valor || <span className={styles.semDado}>{falta}</span>}</dd>
    </div>
  );
}
