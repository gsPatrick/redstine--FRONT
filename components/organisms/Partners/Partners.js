import Image from "next/image";
import { partners } from "@/lib/home";
import styles from "./Partners.module.css";

/**
 * Ecossistema de parceiros.
 *
 * Carrossel contínuo de logotipos. A lista é duplicada no DOM porque a
 * animação corre metade da largura e reinicia — é o que faz o laço parecer
 * infinito sem salto visível.
 *
 * A estrutura aceita fornecedores, compradores, operadores e outros
 * participantes sem mudar: entra na lista, aparece no carrossel. Nesta versão
 * não há descrição da função de cada um — isso fica na página Sobre a RED.
 *
 * Com a lista vazia o bloco mostra espaços reservados em vez de sumir: o
 * cliente precisa ver onde os logotipos entram para saber o que enviar, e
 * inventar marcas aqui seria afirmar parcerias que não existem.
 */
const RESERVADOS = 6;

export default function Partners() {
  const temLogos = partners.length > 0;
  const itens = temLogos ? [...partners, ...partners] : Array.from({ length: RESERVADOS * 2 });

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.head}>
          <span className={styles.kicker}>Ecossistema</span>
          <h2 className={styles.title}>Parceiros e formadores do ecossistema</h2>
        </div>
      </div>

      <div className={styles.trilho}>
        <ul className={styles.faixa} aria-hidden={!temLogos}>
          {itens.map((p, i) =>
            temLogos ? (
              <li key={`${p.nome}-${i}`} className={styles.slot}>
                <Image
                  src={p.logo}
                  alt={p.nome}
                  width={200}
                  height={80}
                  className={styles.logo}
                />
              </li>
            ) : (
              <li key={i} className={`${styles.slot} ${styles.reservado}`}>
                <span>Logotipo</span>
              </li>
            )
          )}
        </ul>
      </div>

      {!temLogos && (
        <p className={styles.aviso}>
          Espaços reservados aos logotipos das empresas do ecossistema.
        </p>
      )}
    </section>
  );
}
