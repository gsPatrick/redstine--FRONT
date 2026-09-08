import PanelIcon from "../../atoms/PanelIcon/PanelIcon";
import styles from "./ProductCell.module.css";

/** Celula de produto: miniatura + nome (+ apoio). Uma tabela de ativos sem
 *  imagem obriga a ler nomes quase identicos linha a linha. */
export default function ProductCell({ nome, imagem, apoio, className = "" }) {
  return (
    <span className={`${styles.celula} ${className}`}>
      <span className={styles.foto}>
        {imagem ? (
          <img src={imagem} alt="" loading="lazy" />
        ) : (
          <PanelIcon name="image" size={15} />
        )}
      </span>
      <span className={styles.texto}>
        <strong>{nome}</strong>
        {apoio && <em>{apoio}</em>}
      </span>
    </span>
  );
}
