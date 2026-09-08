"use client";

import { useState } from "react";
import styles from "./Tabs.module.css";

export default function Tabs({ items, variant = "solid", initial = 0 }) {
  const [active, setActive] = useState(initial);

  return (
    <div className={styles.tabs}>
      <div className={`${styles.list} ${styles[variant]}`} role="tablist">
        {items.map((item, index) => (
          <button
            key={item.label}
            type="button"
            role="tab"
            aria-selected={active === index}
            className={`${styles.tab} ${active === index ? styles.tabActive : ""}`}
            onClick={() => setActive(index)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {items.map((item, index) => (
        <div
          key={item.label}
          className={styles.panel}
          role="tabpanel"
          hidden={active !== index}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
