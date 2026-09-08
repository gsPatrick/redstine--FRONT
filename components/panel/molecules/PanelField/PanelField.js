import styles from "./PanelField.module.css";

/** Campo de formulario do painel. Um so componente para input, select e
 *  textarea — tres implementacoes divergem no foco e no espacamento. */
export default function PanelField({
  label,
  name,
  type = "text",
  as = "input",
  opcoes = [],
  dica,
  erro,
  className = "",
  ...rest
}) {
  const id = `campo-${name}`;

  return (
    <div className={`${styles.campo} ${className}`}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}

      {as === "select" ? (
        <select id={id} name={name} className={styles.controle} {...rest}>
          {opcoes.map((o) => (
            <option key={o.valor} value={o.valor}>
              {o.label}
            </option>
          ))}
        </select>
      ) : as === "textarea" ? (
        <textarea id={id} name={name} className={`${styles.controle} ${styles.area}`} {...rest} />
      ) : (
        <input id={id} name={name} type={type} className={styles.controle} {...rest} />
      )}

      {erro ? <span className={styles.erro}>{erro}</span> : dica && <span className={styles.dica}>{dica}</span>}
    </div>
  );
}
