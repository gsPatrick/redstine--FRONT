"use client";

import { moeda } from "@/lib/painel/formato";
import styles from "./BarChart.module.css";

/**
 * Barras agrupadas — o grafico de "vendas realizadas x valores recebidos".
 *
 * Duas series lado a lado, nao empilhadas: empilhar sugeriria que recebido faz
 * parte de realizado no mesmo eixo, e a comparacao que interessa e entre as
 * duas alturas.
 *
 * O eixo Y vive numa COLUNA propria do grid, nao em posicionamento negativo.
 * A versao anterior tirava os rotulos com `left: -46px` contra um container
 * absoluto, e eles acabavam 45px fora do cartao — para fora da borda, nao
 * dentro do respiro.
 */
export default function BarChart({ dados = [], series = [], altura = 200, className = "" }) {
  if (!dados.length || !series.length) return null;

  const max = Math.max(...dados.flatMap((d) => series.map((s) => d[s.chave] || 0)));
  const teto = max || 1;
  const fracoes = [1, 0.75, 0.5, 0.25, 0];

  return (
    <div className={`${styles.wrap} ${className}`}>
      <ul className={styles.legenda}>
        {series.map((s) => (
          <li key={s.chave}>
            <span className={styles.marca} style={{ background: s.cor }} />
            {s.label}
          </li>
        ))}
      </ul>

      <div className={styles.plot} style={{ "--altura": `${altura}px` }}>
        <div className={styles.eixoY} aria-hidden="true">
          {fracoes.map((f) => (
            <span key={f}>{moeda(teto * f, { curta: true })}</span>
          ))}
        </div>

        <div className={styles.area}>
          <div className={styles.grade} aria-hidden="true">
            {fracoes.map((f) => (
              <span key={f} className={styles.linha} />
            ))}
          </div>

          <div className={styles.grupos}>
            {dados.map((d) => (
              <div key={d.rotulo} className={styles.grupo}>
                <div className={styles.barras}>
                  {series.map((s) => {
                    const valor = d[s.chave] || 0;
                    return (
                      <span
                        key={s.chave}
                        className={styles.barra}
                        style={{ height: `${(valor / teto) * 100}%`, background: s.cor }}
                        title={`${s.label}: ${moeda(valor)}`}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.eixoX} aria-hidden="true">
        {dados.map((d) => (
          <span key={d.rotulo}>{d.rotulo}</span>
        ))}
      </div>
    </div>
  );
}
