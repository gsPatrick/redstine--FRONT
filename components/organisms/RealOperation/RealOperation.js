import Image from "next/image";
import { realOperation } from "@/lib/home";
import styles from "./RealOperation.module.css";

/**
 * A RED nasceu de operações reais.
 *
 * Grid de fotografias reais — operações, desmontes, transporte, ativos
 * identificados, materiais armazenados e produtos comercializados. Sem texto
 * explicativo: o bloco existe para provar, e prova mostrando.
 */
export default function RealOperation({
  fotos = realOperation,
  kicker = "Operação real",
  titulo = "A RED nasceu de operações reais.",
}) {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.head}>
          <span className={styles.kicker}>{kicker}</span>
          <h2 className={styles.title}>{titulo}</h2>
        </div>

        <div className={styles.grid}>
          {fotos.map((foto, i) => (
            <figure key={foto.src} className={styles.tile}>
              <Image
                src={foto.src}
                alt={foto.alt}
                width={480}
                height={360}
                sizes="(max-width: 767px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className={styles.image}
                // As duas primeiras costumam entrar na dobra em telas grandes.
                loading={i < 2 ? "eager" : "lazy"}
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
