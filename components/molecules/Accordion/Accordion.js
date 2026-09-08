"use client";

import { useState } from "react";
import Icon from "@/components/atoms/Icon/Icon";
import styles from "./Accordion.module.css";

export default function Accordion({ items }) {
  const [open, setOpen] = useState(() => items.findIndex((item) => item.open));

  return (
    <div className={styles.accordion}>
      {items.map((item, index) => {
        const expanded = open === index;
        return (
          <div key={item.title} className={styles.item}>
            <button
              type="button"
              className={styles.trigger}
              onClick={() => setOpen(expanded ? -1 : index)}
              aria-expanded={expanded}
            >
              <span className={styles.label}>{item.title}</span>
              <Icon
                name="chevron"
                size={11}
                className={`${styles.caret} ${expanded ? styles.caretOpen : ""}`}
              />
            </button>

            <div className={`${styles.panel} ${expanded ? styles.panelOpen : ""}`}>
              <div className={styles.panelInner}>{item.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
