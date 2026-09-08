import PanelBreadcrumb from "../PanelBreadcrumb/PanelBreadcrumb";
import styles from "./PageHeader.module.css";

export default function PageHeader({ titulo, descricao, trilha, acoes, className = "" }) {
  return (
    <header className={`${styles.head} ${className}`}>
      {trilha?.length > 0 && <PanelBreadcrumb itens={trilha} className={styles.trilha} />}
      <div className={styles.linha}>
        <div className={styles.texto}>
          <h1 className={styles.titulo}>{titulo}</h1>
          {descricao && <p className={styles.descricao}>{descricao}</p>}
        </div>
        {acoes && <div className={styles.acoes}>{acoes}</div>}
      </div>
    </header>
  );
}
