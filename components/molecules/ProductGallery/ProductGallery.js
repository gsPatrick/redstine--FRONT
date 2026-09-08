"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./ProductGallery.module.css";

export default function ProductGallery({ images, name }) {
  const [active, setActive] = useState(0);
  if (!images.length) return null;

  const current = images[active];

  return (
    <div className={styles.gallery}>
      <div className={styles.stage}>
        <Image
          key={current.src}
          src={current.src}
          alt={current.alt || name}
          width={current.width}
          height={current.height}
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className={styles.main}
        />
      </div>

      {images.length > 1 ? (
        <ul className={styles.thumbs}>
          {images.map((image, index) => (
            <li key={image.src}>
              <button
                type="button"
                className={`${styles.thumb} ${index === active ? styles.thumbActive : ""}`}
                onClick={() => setActive(index)}
                aria-label={`Imagem ${index + 1}`}
              >
                <Image
                  src={image.src}
                  alt=""
                  width={140}
                  height={140}
                  className={styles.thumbImage}
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
