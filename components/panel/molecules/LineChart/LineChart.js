"use client";

import { useId, useState } from "react";
import { moeda } from "@/lib/painel/formato";
import styles from "./LineChart.module.css";

/**
 * Grafico de linha em SVG puro — sem biblioteca, por exigencia do projeto.
 *
 * O eixo Y comeca sempre em zero. Cortar a base amplifica visualmente uma
 * variacao pequena e e a forma mais comum de um grafico honesto mentir.
 */
export default function LineChart({ dados = [], altura = 210, formato = moeda, className = "" }) {
  const [ativo, setAtivo] = useState(null);
  const id = useId();

  if (dados.length < 2) return null;

  // Gutter dimensionado pelo maior rotulo do eixo ("R$ 200.000"), e margem
  // direita suficiente para a metade da ultima etiqueta do eixo X — com 12px
  // a palavra "Out" saia 40px para fora do cartao.
  const L = 68;
  const R = 26;
  const T = 12;
  const B = 26;
  const W = 640;
  const H = altura;
  const areaW = W - L - R;
  const areaH = H - T - B;

  const max = Math.max(...dados.map((d) => d.valor));
  const teto = escalaBonita(max);
  const linhas = 4;

  const x = (i) => L + (areaW * i) / (dados.length - 1);
  const y = (v) => T + areaH - (areaH * v) / (teto || 1);

  const pontos = dados.map((d, i) => [x(i), y(d.valor)]);
  const linha = pontos.map(([px, py], i) => `${i ? "L" : "M"}${px} ${py}`).join(" ");
  const area = `${linha} L${pontos[pontos.length - 1][0]} ${T + areaH} L${pontos[0][0]} ${
    T + areaH
  } Z`;

  return (
    <div className={`${styles.wrap} ${className}`}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className={styles.svg}
        role="img"
        aria-label="Evolução ao longo do período"
      >
        <defs>
          <linearGradient id={`fill-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--pnl-accent)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--pnl-accent)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {Array.from({ length: linhas + 1 }, (_, i) => {
          const valor = (teto / linhas) * i;
          const py = y(valor);
          return (
            <g key={i}>
              <line x1={L} y1={py} x2={W - R} y2={py} className={styles.grade} />
              <text x={L - 8} y={py + 4} className={styles.eixoY}>
                {formato(valor, { curta: true })}
              </text>
            </g>
          );
        })}

        <path d={area} fill={`url(#fill-${id})`} />
        <path d={linha} className={styles.linha} />

        {dados.map((d, i) => (
          <g key={d.rotulo}>
            <text
              x={x(i)}
              y={H - 7}
              className={styles.eixoX}
              /* As pontas ancoram para dentro: centrado, metade do primeiro e
                 do ultimo rotulo cairia fora da area util do cartao. */
              textAnchor={i === 0 ? "start" : i === dados.length - 1 ? "end" : "middle"}
            >
              {d.rotulo}
            </text>
            <circle
              cx={x(i)}
              cy={y(d.valor)}
              r={ativo === i ? 5 : 3.2}
              className={styles.ponto}
            />
            {/* Alvo largo e invisivel: acertar um circulo de 3px com o rato
                num grafico de 12 pontos e frustrante. */}
            <rect
              x={x(i) - areaW / (dados.length - 1) / 2}
              y={T}
              width={areaW / (dados.length - 1)}
              height={areaH}
              fill="transparent"
              onMouseEnter={() => setAtivo(i)}
              onMouseLeave={() => setAtivo(null)}
            />
          </g>
        ))}
      </svg>

      {ativo !== null && (
        <div
          className={styles.dica}
          style={{ left: `${(x(ativo) / W) * 100}%`, top: `${(y(dados[ativo].valor) / H) * 100}%` }}
        >
          <strong>{formato(dados[ativo].valor)}</strong>
          <span>{dados[ativo].rotulo}</span>
        </div>
      )}
    </div>
  );
}

/** Teto redondo: 131.240 vira 150.000 em vez de um eixo com numeros quebrados. */
function escalaBonita(max) {
  if (!max) return 100;
  const ordem = 10 ** Math.floor(Math.log10(max));
  const passo = [1, 2, 2.5, 5, 10].find((p) => max <= p * ordem) || 10;
  return passo * ordem;
}
