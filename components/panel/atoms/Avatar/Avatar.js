import styles from "./Avatar.module.css";

/** Iniciais em vez de foto: a V1 nao tem upload de avatar, e um placeholder
 *  generico repetido em toda a lista nao distingue ninguem. */
function iniciais(nome = "") {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (!partes.length) return "?";
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

export default function Avatar({ nome, src, size = 36, className = "" }) {
  if (src) {
    return (
      <img
        src={src}
        alt={nome || ""}
        className={`${styles.avatar} ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <span
      className={`${styles.avatar} ${styles.iniciais} ${className}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }}
      aria-hidden="true"
    >
      {iniciais(nome)}
    </span>
  );
}
