"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@/components/atoms/Icon/Icon";
import { mobileTabs } from "@/lib/navigation";
import styles from "./MobileTabBar.module.css";

export default function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav className={styles.bar} aria-label="Navegação rápida">
      <ul className={styles.list}>
        {mobileTabs.map((tab) => {
          const active = pathname === tab.href;
          return (
            <li key={tab.label} className={styles.item}>
              <Link
                href={tab.href}
                className={`${styles.link} ${active ? styles.active : ""}`}
                aria-current={active ? "page" : undefined}
              >
                <span className={styles.glyph}>
                  <Icon name={tab.icon} size={20} />
                </span>
                <span className={styles.label}>{tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
