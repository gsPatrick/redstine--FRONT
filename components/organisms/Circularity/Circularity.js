import { circularity } from "@/lib/home";
import styles from "./Circularity.module.css";

/**
 * Circularidade aplicada.
 *
 * Desenhado como um CÍRCULO de verdade, não como linha com seta voltando: o
 * ciclo termina onde começa, e a forma precisa dizer isso sozinha. A versão
 * anterior era uma régua horizontal — lia-se como um processo com fim.
 *
 * As cinco etapas ficam ao redor do anel, cada uma com o próprio marco. No
 * centro, a frase que fecha a ideia. Em telas estreitas o círculo vira lista
 * vertical, porque cinco rótulos numa circunferência de 320px ficam
 * ilegíveis.
 */
/**
 * Dois raios, não um.
 *
 * O marco numerado fica SOBRE o anel (42%, o mesmo raio do círculo) e o rótulo
 * fica FORA dele (58%). Com um raio só, o texto pousava em cima da linha
 * vermelha e ficava ilegível.
 */
const RAIO_MARCO = 42;
const RAIO_ROTULO = 58;

const ponto = (angulo, raio) => ({
  x: 50 + raio * Math.cos(angulo),
  y: 50 + raio * Math.sin(angulo),
});

export default function Circularity() {
  const total = circularity.items.length;

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.head}>
          <span className={styles.kicker}>Circularidade</span>
          <h2 className={styles.title}>{circularity.title}</h2>
          <p className={styles.subtitle}>{circularity.subtitle}</p>
        </div>

        <div className={styles.palco}>
          <div className={styles.anel} aria-hidden="true">
            <svg viewBox="0 0 100 100" className={styles.svg}>
              <circle cx="50" cy="50" r="42" className={styles.trilho} />
              {/* Arco vermelho com uma abertura: é a abertura que dá a leitura
                  de movimento — um anel fechado parece um selo, não um ciclo. */}
              <circle cx="50" cy="50" r="42" className={styles.arco} />
            </svg>
            {/* O centro NÃO repete uma das etapas — "Novos ciclos de uso" já é
                a etapa 04. Aqui fica o que o ciclo inteiro produz. */}
            <span className={styles.miolo}>
              <strong>O ativo segue</strong>
              <em>produtivo</em>
            </span>
          </div>

          <ol className={styles.nos}>
            {circularity.items.map((item, i) => {
              // Começa no topo (-90°) e distribui as etapas no sentido horário.
              const ang = (i / total) * 2 * Math.PI - Math.PI / 2;
              const marco = ponto(ang, RAIO_MARCO);
              const rotulo = ponto(ang, RAIO_ROTULO);
              return (
                <li key={item} className={styles.no}>
                  <span
                    className={styles.marco}
                    style={{ "--x": `${marco.x}%`, "--y": `${marco.y}%` }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={styles.rotulo}
                    style={{ "--x": `${rotulo.x}%`, "--y": `${rotulo.y}%` }}
                  >
                    {item}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
