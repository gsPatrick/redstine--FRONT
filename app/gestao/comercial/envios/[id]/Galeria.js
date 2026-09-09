"use client";

import { useEffect, useState } from "react";
import PanelIcon from "@/components/panel/atoms/PanelIcon/PanelIcon";
import styles from "./envio.module.css";

/**
 * Galeria das fotos do envio.
 *
 * Ampliar importa: a curadoria decide condição olhando ferrugem, trinca e
 * desgaste, e uma miniatura de 96px não permite ver nada disso. A foto abre
 * numa camada por cima, com navegação por teclado — quem avalia percorre as
 * imagens em sequência, não uma de cada vez com o mouse.
 */
export default function Galeria({ fotos = [], legenda = "" }) {
  const [aberta, setAberta] = useState(null);

  useEffect(() => {
    if (aberta === null) return undefined;
    const tecla = (e) => {
      if (e.key === "Escape") setAberta(null);
      if (e.key === "ArrowRight") setAberta((i) => (i + 1) % fotos.length);
      if (e.key === "ArrowLeft") setAberta((i) => (i - 1 + fotos.length) % fotos.length);
    };
    document.addEventListener("keydown", tecla);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", tecla);
      document.body.style.overflow = "";
    };
  }, [aberta, fotos.length]);

  // Um envio sem fotos não é um erro: o formulário do site não as exige. Mas é
  // uma informação que muda o trabalho da curadoria, então é dita, não omitida.
  if (!fotos.length) {
    return (
      <div className={styles.semFotos}>
        <span className={styles.seloSemFotos}>
          <PanelIcon name="image" size={20} />
        </span>
        <p>Nenhuma foto anexada.</p>
        <span>
          Avaliar condição sem imagem costuma exigir contato com o fornecedor antes de decidir.
        </span>
      </div>
    );
  }

  return (
    <>
      <ul className={styles.galeria}>
        {fotos.map((src, i) => (
          <li key={src}>
            <button
              type="button"
              className={styles.thumb}
              onClick={() => setAberta(i)}
              aria-label={`Ampliar foto ${i + 1} de ${fotos.length}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`${legenda} — foto ${i + 1}`} loading="lazy" />
            </button>
          </li>
        ))}
      </ul>

      {aberta !== null && (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label={`Foto ${aberta + 1} de ${fotos.length}`}
          onClick={() => setAberta(null)}
        >
          <button type="button" className={styles.fechar} aria-label="Fechar">
            <PanelIcon name="close" size={18} />
          </button>

          {fotos.length > 1 && (
            <button
              type="button"
              className={`${styles.seta} ${styles.setaEsq}`}
              aria-label="Foto anterior"
              onClick={(e) => {
                e.stopPropagation();
                setAberta((i) => (i - 1 + fotos.length) % fotos.length);
              }}
            >
              <PanelIcon name="chevronLeft" size={20} />
            </button>
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={fotos[aberta]}
            alt={`${legenda} — foto ${aberta + 1}`}
            className={styles.ampliada}
            onClick={(e) => e.stopPropagation()}
          />

          {fotos.length > 1 && (
            <button
              type="button"
              className={`${styles.seta} ${styles.setaDir}`}
              aria-label="Próxima foto"
              onClick={(e) => {
                e.stopPropagation();
                setAberta((i) => (i + 1) % fotos.length);
              }}
            >
              <PanelIcon name="chevronRight" size={20} />
            </button>
          )}

          <span className={styles.contador}>
            {aberta + 1} / {fotos.length}
          </span>
        </div>
      )}
    </>
  );
}
