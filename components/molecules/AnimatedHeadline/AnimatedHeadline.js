"use client";

import { useEffect, useState } from "react";
import styles from "./AnimatedHeadline.module.css";

export default function AnimatedHeadline({ prefix, words, interval = 2400 }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (words.length < 2) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % words.length);
    }, interval);

    return () => window.clearInterval(id);
  }, [words.length, interval]);

  return (
    <h3 className={styles.headline}>
      <span className={styles.prefix}>{prefix}</span>
      <span
        className={styles.slot}
        style={{
          minWidth: `${words.reduce((a, b) => (b.length > a.length ? b : a), "").length}ch`,
        }}
      >
        {words.map((word, i) => (
          <span
            key={word}
            className={`${styles.word} ${i === index ? styles.active : ""}`}
            aria-hidden={i === index ? undefined : "true"}
          >
            {word}
          </span>
        ))}
      </span>
    </h3>
  );
}
