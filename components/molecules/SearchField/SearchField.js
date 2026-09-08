"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "@/components/atoms/Icon/Icon";
import styles from "./SearchField.module.css";

export default function SearchField({ className = "" }) {
  const router = useRouter();
  const [term, setTerm] = useState("");

  const submit = (event) => {
    event.preventDefault();
    const value = term.trim();
    router.push(value ? `/shop?s=${encodeURIComponent(value)}` : "/shop");
  };

  return (
    <form className={`${styles.form} ${className}`} onSubmit={submit} role="search">
      <input
        type="search"
        className={styles.input}
        value={term}
        onChange={(event) => setTerm(event.target.value)}
        aria-label="Buscar"
      />
      <button type="submit" className={styles.submit} aria-label="Buscar">
        <Icon name="magnifier" size={14} />
      </button>
    </form>
  );
}
