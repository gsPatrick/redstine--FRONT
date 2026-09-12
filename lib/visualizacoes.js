"use client";

import { API_URL } from "./config";

/**
 * Registro de visualização de produto (revisão do cliente, item 33).
 *
 * A API já coletava o evento (`POST /events/product-view`) desde o primeiro
 * dia e o front nunca o reportava. Isto liga as duas pontas.
 *
 * ---------------------------------------------------------------------------
 * Como o mesmo visitante NÃO é contado a cada refresh
 * ---------------------------------------------------------------------------
 *
 * A deduplicação acontece em DOIS níveis, e os dois são necessários:
 *
 *  1. AQUI, por sessão do navegador. Um identificador estável é gerado uma vez
 *     e guardado em `localStorage`, e vai em cada chamada no cabeçalho
 *     `x-session-id`. Além disso, um conjunto em memória impede a segunda
 *     chamada na mesma navegação — o React 18 monta os efeitos duas vezes em
 *     desenvolvimento, e sem isto cada abertura de página contava duas.
 *
 *  2. NA API, por janela de tempo. O servidor procura o mesmo par
 *     (ativo, visitante) nas últimas horas e, se encontra, responde
 *     `contabilizada: false` sem incrementar nada.
 *
 * Por que os dois? Porque nenhum sozinho basta. O `localStorage` é apagável e
 * não existe em navegação privada, então a contagem seria inflável a partir do
 * cliente; e sem o corte local o front dispararia pedidos inúteis a cada
 * recarregamento. Quem tem a palavra final é sempre o servidor — o front só
 * evita o pedido óbvio.
 *
 * Quando não há `localStorage` (navegação privada, cookies bloqueados), a
 * chamada segue SEM o cabeçalho e a API recai na impressão de IP + user-agent.
 * Menos preciso, e é o compromisso certo: o alternativo era não contar essas
 * visitas de todo.
 *
 * Falha de rede é engolida de propósito. Uma página de produto não pode deixar
 * de abrir porque o analytics não respondeu.
 */

const CHAVE = "red.visitante";
const reportados = new Set();

export function idDoVisitante() {
  if (typeof window === "undefined") return null;
  try {
    let id = window.localStorage.getItem(CHAVE);
    if (!id) {
      id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `v-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
      window.localStorage.setItem(CHAVE, id);
    }
    return id;
  } catch {
    // Navegação privada: sem identificador estável, a API decide pelo IP.
    return null;
  }
}

/**
 * Reporta a visualização e devolve o total do ativo (ou `null` se falhou).
 *
 * A API responde com a contagem já atualizada, o que evita uma segunda viagem
 * só para ler o número depois de o ter reportado.
 */
export async function registrarVisualizacao(assetId, { payload } = {}) {
  if (!assetId || typeof window === "undefined") return null;
  if (reportados.has(assetId)) return null;
  reportados.add(assetId);

  const sessao = idDoVisitante();

  try {
    const res = await fetch(`${API_URL}/events/product-view`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(sessao ? { "x-session-id": sessao } : {}),
      },
      body: JSON.stringify({ assetId, ...(payload ? { payload } : {}) }),
      // `keepalive` para a chamada sobreviver a um clique imediato que navegue
      // para outra página antes de a resposta chegar.
      keepalive: true,
    });

    if (!res.ok) return null;
    const json = await res.json().catch(() => null);
    return json?.data?.visualizacoes ?? null;
  } catch {
    return null;
  }
}
