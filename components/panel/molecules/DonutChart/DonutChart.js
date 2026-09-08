"use client";

import styles from "./DonutChart.module.css";

/**
 * Rosca com legenda ao lado.
 *
 * Fatias abaixo de 1% ainda recebem um tracinho minimo: sumir com a fatia faz
 * o utilizador achar que o dado nao existe, quando ele so e pequeno.
 */
export default function DonutChart({ dados = [], total, formato, altura = 190, className = "" }) {
  const soma = dados.reduce((a, d) => a + Number(d.valor || 0), 0);
  if (!soma) return null;

  const raio = 60;
  const espessura = 20;
  const circunferencia = 2 * Math.PI * raio;

  let acumulado = 0;
  const fatias = dados.map((d) => {
    const fracao = Number(d.valor) / soma;
    const arco = Math.max(circunferencia * fracao - 3, 2);
    const fatia = {
      ...d,
      fracao,
      arco,
      offset: -circunferencia * acumulado,
    };
    acumulado += fracao;
    return fatia;
  });

  return (
    <div className={`${styles.wrap} ${className}`}>
      <svg viewBox="0 0 160 160" className={styles.svg} style={{ height: altura }} role="img">
        <g transform="rotate(-90 80 80)">
          {fatias.map((f) => (
            <circle
              key={f.rotulo}
              cx="80"
              cy="80"
              r={raio}
              fill="none"
              stroke={f.cor}
              strokeWidth={espessura}
              strokeDasharray={`${f.arco} ${circunferencia - f.arco}`}
              strokeDashoffset={f.offset}
              strokeLinecap="round"
            />
          ))}
        </g>
        {total !== undefined && (
          <>
            <text x="80" y="76" className={styles.totalValor}>
              {total}
            </text>
            <text x="80" y="93" className={styles.totalRotulo}>
              total
            </text>
          </>
        )}
      </svg>

      <ul className={styles.legenda}>
        {fatias.map((f) => (
          <li key={f.rotulo}>
            <span className={styles.marca} style={{ background: f.cor }} />
            <span className={styles.nome}>{f.rotulo}</span>
            <span className={styles.pct}>{Math.round(f.fracao * 100)}%</span>
            {formato && <span className={styles.valor}>{formato(f.valor)}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
