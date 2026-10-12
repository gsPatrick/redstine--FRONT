"use client";

/**
 * Seletor de quantidade com VENDA MÍNIMA.
 *
 * O descritivo novo da página de produto introduz a venda mínima como
 * propriedade do ativo: "o seletor deve iniciar na venda mínima, o botão de
 * diminuir fica desativado quando chega nela, e o carrinho tem de respeitar a
 * mesma regra". O exemplo dado é mínima 5 com 15 em estoque, que permite de 5
 * a 15.
 *
 * Existe como peça única porque são DOIS lugares com a mesma regra — página do
 * produto e carrinho — e a regra duplicada é como nasce o carrinho que aceita
 * 3 num ativo de mínima 5.
 *
 * Três decisões que não são óbvias:
 *
 *  - O "−" fica `disabled` no mínimo, e não some. Botão que desaparece move os
 *    irmãos de lugar e o utilizador clica no que entrou no lugar dele.
 *  - O campo é digitável, porque numa mínima de 50 ninguém clica 50 vezes; mas
 *    só se normaliza o que foi digitado quando o campo perde o foco. Corrigir a
 *    cada tecla impede de apagar o "1" de "15" para escrever "8".
 *  - O máximo é o estoque. Sem ele, o seletor deixa pedir 30 de um lote de 15 e
 *    a recusa só aparece depois, no checkout.
 */
export default function QuantidadeSeletor({
  valor,
  minimo = 1,
  maximo = null,
  aoMudar,
  rotulo = "Quantidade",
  styles,
}) {
  const min = Math.max(1, Number(minimo) || 1);
  const max = maximo === null || maximo === undefined ? null : Math.max(min, Number(maximo));

  const limitar = (n) => {
    const numero = Number(n);
    if (!Number.isFinite(numero)) return min;
    const piso = Math.max(min, Math.floor(numero));
    return max === null ? piso : Math.min(max, piso);
  };

  const noMinimo = valor <= min;
  const noMaximo = max !== null && valor >= max;

  return (
    <div className={styles.stepper}>
      <button
        type="button"
        className={styles.step}
        onClick={() => aoMudar(limitar(valor - 1))}
        disabled={noMinimo}
        aria-label="Diminuir quantidade"
      >
        −
      </button>

      <input
        type="number"
        inputMode="numeric"
        min={min}
        max={max ?? undefined}
        className={styles.quantity}
        value={valor}
        onChange={(event) => {
          const bruto = event.target.value;
          // Vazio é estado de digitação, não zero: deixa-se passar e o `blur`
          // devolve ao mínimo.
          if (bruto === "") return aoMudar("");
          aoMudar(Math.max(0, Math.floor(Number(bruto) || 0)));
        }}
        onBlur={() => aoMudar(limitar(valor))}
        aria-label={rotulo}
      />

      <button
        type="button"
        className={styles.step}
        onClick={() => aoMudar(limitar(valor + 1))}
        disabled={noMaximo}
        aria-label="Aumentar quantidade"
      >
        +
      </button>
    </div>
  );
}

/** Mínima do ativo, com as linhas antigas (sem o campo) a valerem 1. */
export function minimaDe(item) {
  return Math.max(1, Number(item?.minOrderQuantity || 1));
}
