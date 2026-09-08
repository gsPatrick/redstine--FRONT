"use client";

import { useEffect, useState } from "react";
import styles from "./KenBurnsSlideshow.module.css";

export default function KenBurnsSlideshow({
  slides,
  duration = 5000,
  transition = 500,
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, duration);

    return () => window.clearInterval(id);
  }, [slides.length, duration]);

  return (
    <div className={styles.stage} aria-hidden="true">
      {slides.map((slide, i) => (
        <div
          key={slide}
          className={`${styles.slide} ${i === index ? styles.active : ""}`}
          style={{
            backgroundImage: `url(${slide})`,
            transitionDuration: `${transition}ms`,
            animationDuration: `${duration + transition}ms`,
          }}
        />
      ))}
    </div>
  );
}
