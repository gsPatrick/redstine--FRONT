"use client";

import { useState } from "react";
import Link from "next/link";
import Icon from "@/components/atoms/Icon/Icon";
import styles from "./MegaMenu.module.css";

export default function MegaMenu({ columns, open }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div
      className={`${styles.dropdown} ${open ? styles.open : ""}`}
      aria-hidden={!open}
      onMouseLeave={() => setHovered(null)}
    >
      <ul className={styles.level1}>
        {columns.map((column) => {
          const active = hovered === column.label;
          return (
            <li
              key={column.label}
              className={styles.parent}
              onMouseEnter={() => setHovered(column.label)}
            >
              <Link
                href={column.href}
                className={`${styles.parentLink} ${active ? styles.parentActive : ""}`}
              >
                <span>{column.label}</span>
                <Icon name="caretRight" size={9} className={styles.caret} />
              </Link>

              <ul className={`${styles.level2} ${active ? styles.level2Open : ""}`}>
                {column.items.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className={styles.childLink}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
