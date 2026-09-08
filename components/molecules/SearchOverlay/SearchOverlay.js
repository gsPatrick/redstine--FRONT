"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "@/components/atoms/Icon/Icon";
import styles from "./SearchOverlay.module.css";

export default function SearchOverlay({ open, onClose }) {
  const router = useRouter();
  const inputRef = useRef(null);
  const [term, setTerm] = useState("");

  useEffect(() => {
    if (open) {
      const id = window.setTimeout(() => inputRef.current?.focus(), 240);
      return () => window.clearTimeout(id);
    }
    setTerm("");
  }, [open]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const submit = (event) => {
    event.preventDefault();
    const value = term.trim();
    if (!value) return;
    router.push(`/shop?s=${encodeURIComponent(value)}`);
    onClose();
  };

  return (
    <div
      className={`${styles.overlay} ${open ? styles.open : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Buscar ativos"
      aria-hidden={!open}
    >
      <button type="button" className={styles.backdrop} onClick={onClose} aria-label="Fechar busca" />

      <form className={styles.panel} onSubmit={submit}>
        <Icon name="magnifier" size={22} className={styles.glyph} />
        <input
          ref={inputRef}
          type="search"
          className={styles.input}
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          placeholder="Buscar ativos, categorias, marcas…"
          aria-label="Buscar"
        />
        <button type="button" className={styles.close} onClick={onClose} aria-label="Fechar">
          <Icon name="close" size={16} />
        </button>
      </form>
    </div>
  );
}
