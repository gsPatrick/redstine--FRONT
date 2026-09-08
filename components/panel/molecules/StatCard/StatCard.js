import Link from "next/link";
import PanelIcon from "../../atoms/PanelIcon/PanelIcon";
import styles from "./StatCard.module.css";

/**
 * Cartao de indicador.
 *
 * `natureza` e a parte que importa e nao e decoracao:
 *   estado — fotografia do agora (ativos publicados, receita potencial)
 *   fluxo  — movimento do periodo (vendas realizadas, recebido)
 *
 * Indicador de estado nao responde ao filtro temporal, e o cartao diz isso
 * ao utilizador em vez de deixa-lo descobrir sozinho que o numero nao mudou.
 */
export default function StatCard({
  rotulo,
  valor,
  icone,
  variacao,
  nota,
  natureza,
  href,
  hrefLabel = "Ver todas",
  destaque = false,
  tone = "neutral",
  className = "",
}) {
  const Wrapper = href ? Link : "div";
  const props = href ? { href } : {};

  return (
    <Wrapper
      {...props}
      className={`${styles.card} ${destaque ? styles.destaque : ""} ${
        href ? styles.clicavel : ""
      } ${className}`}
    >
      <div className={styles.topo}>
        {icone && (
          <span className={`${styles.icone} ${styles[tone]}`}>
            <PanelIcon name={icone} size={16} />
          </span>
        )}
        <span className={styles.rotulo}>{rotulo}</span>
      </div>

      <strong className={styles.valor}>{valor}</strong>

      <div className={styles.rodape}>
        {variacao && (
          <span className={`${styles.variacao} ${styles[variacao.direcao]}`}>
            <PanelIcon name={variacao.direcao === "alta" ? "arrowUp" : "arrowDown"} size={12} />
            {variacao.texto}
            <em>vs período anterior</em>
          </span>
        )}
        {!variacao && nota && <span className={styles.nota}>{nota}</span>}
        {!variacao && !nota && natureza === "estado" && (
          <span className={styles.nota}>Situação atual</span>
        )}
        {href && <span className={styles.link}>{hrefLabel}</span>}
      </div>
    </Wrapper>
  );
}
