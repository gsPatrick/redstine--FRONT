import { circularity } from "@/lib/home";
import styles from "./Circularity.module.css";

/**
 * Circularidade aplicada — versão repensada para desktop (item 36).
 *
 * O que havia antes: um anel SVG de 520px com as cinco etapas distribuídas por
 * seno/cosseno na circunferência. Medido em 1440px, o bloco tinha 971px de
 * altura — uma tela inteira — para comunicar cinco expressões de 13px, com
 * ~500px de container vazio ao lado do círculo e um miolo de 840px de nada.
 * Três defeitos concretos, não questão de gosto:
 *
 * 1. O rótulo da etapa 01 encostava no subtítulo da seção (topo em y=274
 *    contra um subtítulo que terminava em y=281). Colisão de texto.
 * 2. Os rótulos ficavam a 13px, menores que qualquer outro texto da home
 *    (--fs-body ≈ 17px), e com largura fixa de 130px quebravam em duas linhas
 *    de forma arbitrária.
 * 3. A distância entre marco e rótulo variava com o ângulo, então cada etapa
 *    aparecia a uma distância diferente do anel e as cinco não liam como
 *    conjunto. Sem ordem de leitura clara.
 *
 * A versão nova mantém a leitura de ciclo — o que o cliente elogia na home é o
 * layout editorial em duas colunas, e é esse padrão que o bloco passa a usar:
 * cabeçalho à esquerda, conteúdo à direita. As etapas viram uma lista vertical
 * numerada, com ordem de leitura óbvia, texto no tamanho do resto da página e
 * espaço para uma linha de explicação em cada uma. O retorno do ciclo é
 * desenhado por um colchete que liga a última etapa de volta à primeira —
 * mesma informação que o anel dava, sem gastar uma tela para isso.
 *
 * Sem dados dinâmicos e sem estado: componente de servidor puro.
 */
export default function Circularity() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.layout}>
          <div className={styles.head}>
            <span className={styles.kicker}>Circularidade</span>
            <h2 className={styles.title}>{circularity.title}</h2>
            <p className={styles.subtitle}>{circularity.subtitle}</p>
            {/* O fecho fica no cabeçalho, não no meio de um círculo: ali ele
                disputava atenção com o título da própria seção. */}
            <p className={styles.fecho}>{circularity.closing}</p>
          </div>

          <div className={styles.ciclo}>
            {/* Colchete que sai da última etapa e volta à primeira. É só borda
                com cantos arredondados: não distorce em nenhuma largura, ao
                contrário de um SVG esticado, e a seta no topo dá a direção. */}
            <span className={styles.retorno} aria-hidden="true" />

            <ol className={styles.etapas}>
              {circularity.items.map((item, i) => (
                <li key={item.label} className={styles.etapa}>
                  <span className={styles.marco}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={styles.texto}>
                    <strong className={styles.rotulo}>{item.label}</strong>
                    <span className={styles.detalhe}>{item.detail}</span>
                  </span>
                </li>
              ))}
            </ol>

            <p className={styles.recomeca} aria-hidden="true">
              e o ciclo recomeça
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
