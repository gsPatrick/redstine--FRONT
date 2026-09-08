/**
 * Cliente da API para componentes de servidor.
 *
 * Separado de `lib/api.js` porque as necessidades são outras: aqui não existe
 * token no navegador, e o que importa é o cache. `lib/api.js` continua sendo o
 * cliente do navegador, com sessão.
 *
 * O endereço vem de `lib/config.js`, o único ponto do projeto que o define.
 */
import { API_URL } from "./config";

export const API_BASE = API_URL;

/**
 * O catálogo muda quando a curadoria publica um ativo, não a cada visita.
 * Revalidar a cada minuto dá página instantânea sem servir preço velho por
 * muito tempo.
 */
const REVALIDAR = 60;

export async function buscarNaApi(caminho, { revalidate = REVALIDAR } = {}) {
  try {
    const res = await fetch(API_BASE + caminho, {
      next: { revalidate },
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      console.error(`[api] ${res.status} em ${caminho}`);
      return null;
    }

    const json = await res.json();
    return json?.meta ? { data: json.data, meta: json.meta } : json?.data;
  } catch (e) {
    // A vitrine não pode cair com a API: devolve null e cada tela decide se
    // mostra lista vazia ou estado de erro. Derrubar a home inteira porque o
    // carrossel falhou seria pior.
    console.error(`[api] falha em ${caminho}:`, e.message);
    return null;
  }
}
