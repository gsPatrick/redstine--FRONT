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
}) {
  const id = `field-${name}`;

  return (
    <div className={styles.field} data-span={span}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required ? <span className={styles.required}> *</span> : null}
      </label>

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
          className={styles.control}
        />
      )}
    </div>
  );
}
