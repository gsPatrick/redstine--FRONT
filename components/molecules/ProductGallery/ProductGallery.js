"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Icon from "@/components/atoms/Icon/Icon";
import styles from "./ProductGallery.module.css";

/**
 * Galeria do ativo.
 *
 * O descritivo novo da página de produto pede as miniaturas EM COLUNA, à
 * esquerda da imagem principal, e zoom na imagem. As duas coisas são opcionais
 * (`orientacao`, `zoom`) porque a mesma galeria serve a página do produto e os
 * lugares onde as miniaturas em linha continuam certas.
 *
 * O zoom é por `transform-origin` seguindo o cursor, e não lupa em painel
 * flutuante: a lupa precisa de uma segunda cópia da imagem numa resolução que
 * o acervo não tem — boa parte das fotos vem do fornecedor, em 1254px. Ampliar
 * o que existe é honesto; prometer detalhe que o ficheiro não contém, não.
 *
 * No toque não há cursor, e o zoom simplesmente não acontece: `onMouseMove`
 * não dispara. Melhor do que um zoom que fica preso onde o dedo tocou.
 */
export default function ProductGallery({
  images,
  name,
  orientacao = "horizontal",
  zoom = false,
  acaoCanto = null,
}) {
  const [active, setActive] = useState(0);
  const [origem, setOrigem] = useState(null);
  const palco = useRef(null);

  if (!images.length) return null;

  const current = images[active];
  const vertical = orientacao === "vertical";

  const seguirCursor = (event) => {
    if (!zoom || !palco.current) return;
    const r = palco.current.getBoundingClientRect();
    const x = ((event.clientX - r.left) / r.width) * 100;
    const y = ((event.clientY - r.top) / r.height) * 100;
    setOrigem(`${x}% ${y}%`);
  };

  return (
    <div className={`${styles.gallery} ${vertical ? styles.galleryVertical : ""}`}>
      {images.length > 1 ? (
        <ul className={`${styles.thumbs} ${vertical ? styles.thumbsVertical : ""}`}>
          {images.map((image, index) => (
            /* A chave inclui o índice porque o mesmo ficheiro pode aparecer
               duas vezes no ativo — o catálogo importado tem lotes com a foto
               repetida, e só o src fazia o React avisar de chave duplicada e
               potencialmente omitir uma miniatura. */
            <li key={`${image.src}-${index}`}>
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

      <div
        ref={palco}
        className={`${styles.stage} ${zoom ? styles.stageZoom : ""}`}
        onMouseMove={seguirCursor}
        onMouseLeave={() => setOrigem(null)}
      >
        <Image
          key={current.src}
          src={current.src}
          alt={current.alt || name}
          width={current.width}
          height={current.height}
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className={`${styles.main} ${origem ? styles.mainZoom : ""}`}
          style={origem ? { transformOrigin: origem } : undefined}
        />

        {/* Ação de canto (o coração, na página do produto). Fica aqui dentro e
            não no `ProductDetail` porque o enquadramento é do palco: posto
            fora, ele colava na coluna de miniaturas. */}
        {acaoCanto ? <div className={styles.canto}>{acaoCanto}</div> : null}

        {/*
          Dica do zoom.

          O protótipo mostra-a, e ela resolve um problema real: a ampliação só
          acontece com o cursor em cima, e sem aviso ninguém descobre que
          existe. Some enquanto o zoom está ativo — ali ela estaria por cima
          justamente do que se quer ver.
        */}
        {zoom ? (
          <span className={`${styles.dicaZoom} ${origem ? styles.dicaZoomOculta : ""}`}>
            <Icon name="magnifier" size={12} />
            Passe o mouse para ampliar
          </span>
        ) : null}
      </div>
    </div>
  );
}
