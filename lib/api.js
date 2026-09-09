/**
 * Cliente da API.
 *
 * Um lugar só monta URL, injeta o token e traduz erro. Espalhar `fetch` pelas
 * telas faria cada uma inventar o próprio tratamento de 401 — e a que
 * esquecesse deixaria o utilizador numa tela vazia sem saber que a sessão
 * caiu.
 */
import { API_URL } from "./config";

// Reexportado por conveniência: quem já importava `API_BASE` daqui continua
// funcionando, e o endereço segue definido num lugar só.
export const API_BASE = API_URL;

const CHAVE_TOKEN = "red.token";

export function lerToken() {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(CHAVE_TOKEN);
  } catch {
    return null;
  }
}

export function gravarToken(token) {
  try {
    if (token) window.localStorage.setItem(CHAVE_TOKEN, token);
    else window.localStorage.removeItem(CHAVE_TOKEN);
  } catch {
    /* navegação privada: a sessão vive só nesta aba */
  }
}

export class ErroDaApi extends Error {
  constructor({ status, code, message, details }) {
    super(message || "Não foi possível concluir a operação.");
    this.status = status;
    this.code = code;
    this.details = details || [];
  }
}

export async function api(caminho, { method = "GET", body, token, sinal } = {}) {
  const auth = token ?? lerToken();

  // Upload de ficheiros vai como FormData e nao pode ser serializado nem levar
  // Content-Type nosso: o browser precisa escrever o cabecalho com o boundary
  // do multipart, senao o multer nao encontra os campos.
  const multipart = typeof FormData !== "undefined" && body instanceof FormData;

  const res = await fetch(API_BASE + caminho, {
    method,
    headers: {
      ...(body && !multipart ? { "Content-Type": "application/json" } : {}),
      ...(auth ? { Authorization: `Bearer ${auth}` } : {}),
    },
    ...(body ? { body: multipart ? body : JSON.stringify(body) } : {}),
    signal: sinal,
  });

  if (res.status === 204) return null;

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    // Sessão expirada limpa o token na hora: manter um token morto guardado
    // faria a próxima navegação falhar de novo, com a mesma cara de erro
    // genérico.
    if (res.status === 401) gravarToken(null);
    throw new ErroDaApi({
      status: res.status,
      code: json?.error?.code,
      message: json?.error?.message,
      details: json?.error?.details,
    });
  }

  return json?.meta ? { data: json.data, meta: json.meta } : json?.data;
}

export const get = (c, o) => api(c, { ...o, method: "GET" });
export const post = (c, body, o) => api(c, { ...o, method: "POST", body });
export const patch = (c, body, o) => api(c, { ...o, method: "PATCH", body });
export const put = (c, body, o) => api(c, { ...o, method: "PUT", body });
export const del = (c, o) => api(c, { ...o, method: "DELETE" });
