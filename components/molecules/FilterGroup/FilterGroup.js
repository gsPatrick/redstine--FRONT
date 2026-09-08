"use client";

import styles from "./FilterGroup.module.css";

export default function FilterGroup({ title, options, selected, onToggle }) {
  if (!options.length) return null;

  return (
    <fieldset className={styles.group}>
      <legend className={styles.legend}>
        <h3 className={styles.title}>{title}</h3>
      </legend>
      <ul className={styles.list}>
        {options.map((option) => {
          const checked = selected.includes(option.value);
          return (
            <li key={option.value}>
              <label className={styles.option}>
                <input
                  type="checkbox"
                  className={styles.input}
                  checked={checked}
                  onChange={() => onToggle(option.value)}
                />
                <span className={styles.box} aria-hidden="true" />
                <span className={styles.label}>{option.label}</span>
                <span className={styles.count}>{option.count}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}
