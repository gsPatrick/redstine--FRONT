import styles from "./Field.module.css";

export default function Field({
  label,
  name,
  type = "text",
  required = false,
  rows,
  options,
  accept,
  multiple,
  span = 1,
  dica,
}) {
  const id = `field-${name}`;
  // A dica é ligada ao campo por `aria-describedby`, não deixada solta ao lado:
  // sem isso o leitor de tela anuncia o rótulo e nunca a explicação.
  const idDica = dica ? `${id}-dica` : undefined;

  const campo = (
    <>
      {type === "textarea" ? (
        <textarea
          id={id}
          name={name}
          rows={rows || 4}
          required={required}
          className={`${styles.control} ${styles.textarea}`}
        />
      ) : type === "select" ? (
        <select id={id} name={name} required={required} className={styles.control}>
          <option value="">Selecione…</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          accept={accept}
          multiple={multiple}
          aria-describedby={idDica}
          className={styles.control}
        />
      )}
    </>
  );

  return (
    <div className={styles.field} data-span={span}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required ? <span className={styles.required}> *</span> : null}
      </label>
      {campo}
      {dica ? (
        <p id={idDica} className={styles.dica}>
          {dica}
        </p>
      ) : null}
    </div>
  );
}
