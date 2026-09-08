/**
 * Formatacao unica do painel.
 *
 * Existe para que "R$ 12.000,00" nunca apareca como "R$ 12000" duas telas
 * adiante. Tudo em pt-BR, e valores monetarios sempre com duas casas — dinheiro
 * truncado sugere numero redondo que nao e.
 */

const MOEDA = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
});

const MOEDA_CURTA = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

const NUMERO = new Intl.NumberFormat("pt-BR");

export function moeda(valor, { curta = false } = {}) {
  const n = Number(valor);
  if (!Number.isFinite(n)) return "—";
  return curta ? MOEDA_CURTA.format(n) : MOEDA.format(n);
}

export function numero(valor) {
  const n = Number(valor);
  return Number.isFinite(n) ? NUMERO.format(n) : "—";
}

export function percentual(valor, casas = 0) {
  const n = Number(valor);
  if (!Number.isFinite(n)) return "—";
  return `${n.toFixed(casas).replace(".", ",")}%`;
}

export function data(valor, { comHora = false } = {}) {
  if (!valor) return "—";
  const d = valor instanceof Date ? valor : new Date(valor);
  if (Number.isNaN(d.getTime())) return "—";

  const dia = String(d.getDate()).padStart(2, "0");
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const ano = d.getFullYear();
  if (!comHora) return `${dia}/${mes}/${ano}`;

  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${dia}/${mes}/${ano} ${hh}:${mm}`;
}

/** "há 5 min", "há 2 h" — usado no sino, onde a hora exata nao importa. */
export function tempoRelativo(valor) {
  if (!valor) return "";
  const d = valor instanceof Date ? valor : new Date(valor);
  const segundos = Math.floor((Date.now() - d.getTime()) / 1000);

  if (segundos < 60) return "agora";
  if (segundos < 3600) return `há ${Math.floor(segundos / 60)} min`;
  if (segundos < 86400) return `há ${Math.floor(segundos / 3600)} h`;
  if (segundos < 604800) return `há ${Math.floor(segundos / 86400)} d`;
  return data(d);
}

export function quantidade(valor, unidade = "un.") {
  return `${numero(valor)} ${unidade}`;
}

/** Variacao versus periodo anterior, ja com sinal e direcao. */
export function variacao(valor) {
  const n = Number(valor);
  if (!Number.isFinite(n) || n === 0) return null;
  return {
    texto: `${n > 0 ? "+" : ""}${n.toFixed(0)}%`,
    direcao: n > 0 ? "alta" : "baixa",
  };
}
