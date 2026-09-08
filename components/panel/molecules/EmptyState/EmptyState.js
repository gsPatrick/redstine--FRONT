import PanelIcon from "../../atoms/PanelIcon/PanelIcon";
import PanelButton from "../../atoms/PanelButton/PanelButton";
import styles from "./EmptyState.module.css";

/** Estado vazio com saida. Uma tela vazia sem proximo passo deixa o
 *  utilizador sem saber se falta dado ou se algo quebrou. */
export default function EmptyState({ icone = "box", titulo, descricao, acao }) {
  return (
    <div className={styles.vazio}>
      <span className={styles.icone}>
        <PanelIcon name={icone} size={22} />
      </span>
      <p className={styles.titulo}>{titulo}</p>
      {descricao && <p className={styles.descricao}>{descricao}</p>}
      {acao && (
        <PanelButton href={acao.href} size="sm" className={styles.acao}>
          {acao.label}
        </PanelButton>
      )}
    </div>
  );
}
