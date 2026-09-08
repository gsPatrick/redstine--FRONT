"use client";

import PageHeader from "@/components/panel/molecules/PageHeader/PageHeader";
import PanelCard from "@/components/panel/molecules/PanelCard/PanelCard";
import PanelIcon from "@/components/panel/atoms/PanelIcon/PanelIcon";
import EstadoDaTela from "@/components/panel/molecules/EstadoDaTela/EstadoDaTela";
import { useRecurso, useLista } from "@/lib/painel/api-cliente";
import styles from "../configuracoes.module.css";

/**
 * Matriz de permissoes.
 *
 * O aviso no topo nao e decorativo: e a diferenca entre esconder um menu e
 * controlar acesso. Esta tela mostra o que a API ja aplica — um utilizador sem
 * capacidade financeira recebe 403 ao chamar /management/financial, mesmo
 * digitando a URL a mao com um token valido.
 */
export default function PermissoesPage() {
  // A matriz vem da API — é o espelho do que o backend aplica, não uma cópia
  // mantida à mão que envelheceria em silêncio.
  const { dados, carregando, erro, recarregar } = useRecurso("/management/permissions");
  const { linhas: usuarios } = useLista("/users?perPage=100");

  const CAPACIDADES = dados?.capacidades || [];
  // Só os perfis que de fato entram na gestão: fornecedor e comprador não têm
  // capacidade nenhuma e ocupariam uma coluna vazia na matriz.
  const PERFIS = (dados?.perfis || []).filter((p) => p.acessaPainelDeGestao);
  const areas = [...new Set(CAPACIDADES.map((c) => c.area))];

  return (
    <>
      <PageHeader
        titulo="Permissões"
        descricao="Perfis de acesso e as capacidades de cada um."
        trilha={[{ label: "Configurações" }, { label: "Permissões" }]}
      />

      <div className={styles.avisoSeguranca}>
        <PanelIcon name="shield" size={17} />
        <p>
          O controle é aplicado no backend, por capacidade. Ocultar um menu não é controle de
          segurança: um usuário sem permissão financeira não acessa o dado por URL nem por API,
          mesmo com sessão válida.
        </p>
      </div>

      <EstadoDaTela carregando={carregando} erro={erro} onTentarNovamente={recarregar} altura={400}>
      {dados && (
      <>
      <div className={styles.perfis}>
        {PERFIS.map((p) => (
          <PanelCard key={p.chave} titulo={p.nome} descricao={p.descricao}>
            <ul className={styles.listaCaps}>
              {CAPACIDADES.map((c) => {
                const tem = p.capacidades.includes(c.chave);
                return (
                  <li key={c.chave} className={tem ? styles.temCap : styles.semCap}>
                    <PanelIcon name={tem ? "check" : "close"} size={14} />
                    <span>{c.label}</span>
                    <code>{c.chave}</code>
                  </li>
                );
              })}
            </ul>
            <p className={styles.contagemPerfil}>
              {usuarios.filter((u) => u.perfil === p.chave).length} usuário(s) com este perfil
            </p>
          </PanelCard>
        ))}
      </div>

      <PanelCard titulo="Matriz de capacidades" className={styles.matriz}>
        <div className={styles.matrizScroll}>
          <table className={styles.tabelaMatriz}>
            <thead>
              <tr>
                <th scope="col">Capacidade</th>
                <th scope="col">Área</th>
                {PERFIS.map((p) => (
                  <th key={p.chave} scope="col" className={styles.centro}>
                    {p.nome}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {areas.map((area) =>
                CAPACIDADES.filter((c) => c.area === area).map((c) => (
                  <tr key={c.chave}>
                    <td>
                      <code className={styles.chaveCap}>{c.chave}</code>
                    </td>
                    <td className={styles.areaCel}>{c.area}</td>
                    {PERFIS.map((p) => (
                      <td key={p.chave} className={styles.centro}>
                        {p.capacidades.includes(c.chave) ? (
                          <PanelIcon name="checkCircle" size={16} className={styles.sim} />
                        ) : (
                          <span className={styles.nao}>—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </PanelCard>
      </>
      )}
      </EstadoDaTela>
    </>
  );
}
