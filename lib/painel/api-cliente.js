"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { del, get, patch, post, put } from "@/lib/api";

/**
 * Leitura de dados do painel.
 *
 * `useRecurso` é o único ponto que faz requisição nas telas: cada uma declara
 * o que precisa e recebe `{ dados, carregando, erro, recarregar }`. Sem isso,
 * cada tela repetiria o mesmo trio de estados — e a que esquecesse o `erro`
 * mostraria tabela vazia quando a API estivesse fora, o que é pior do que
 * dizer que falhou.
 */
export function useRecurso(caminho, { inicial = null, ativo = true } = {}) {
  const [dados, setDados] = useState(inicial);
  const [carregando, setCarregando] = useState(ativo);
  const [erro, setErro] = useState(null);
  // Guarda a requisição em curso: sem isto, trocar o filtro rápido faz a
  // resposta antiga chegar depois da nova e sobrescrever a tela.
  const atual = useRef(0);

  const buscar = useCallback(async () => {
    if (!ativo || !caminho) return;
    const meu = ++atual.current;
    setCarregando(true);
    setErro(null);
    try {
      const r = await get(caminho);
      if (meu === atual.current) setDados(r);
    } catch (e) {
      if (meu === atual.current) setErro(e);
    } finally {
      if (meu === atual.current) setCarregando(false);
    }
  }, [caminho, ativo]);

  useEffect(() => {
    buscar();
  }, [buscar]);

  return { dados, carregando, erro, recarregar: buscar };
}

/** Listagem paginada: separa as linhas do meta para a tela não desembrulhar. */
export function useLista(caminho, opcoes) {
  const { dados, ...resto } = useRecurso(caminho, opcoes);
  return {
    linhas: dados?.data ?? (Array.isArray(dados) ? dados : []),
    meta: dados?.meta ?? null,
    ...resto,
  };
}

/** Monta query string ignorando vazios — `?status=&page=1` polui e confunde. */
export function comFiltros(base, filtros = {}) {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(filtros)) {
    if (v !== undefined && v !== null && v !== "") p.set(k, v);
  }
  const q = p.toString();
  return q ? `${base}?${q}` : base;
}

/* ---------------------------------------------------------------- escritas */

export const salvarPerfil = (dados) => patch("/me/profile", dados);
export const salvarEmpresa = (dados) => patch("/me/company", dados);
export const salvarEnderecos = (dados) => put("/me/addresses", dados);
export const trocarSenha = (dados) => post("/me/password", dados);
export const enviarAtivo = (dados) => post("/me/asset-submissions", dados);

/**
 * Sobe as fotos do ativo e devolve os URLs guardados.
 *
 * E um passo separado do envio do formulario porque o corpo do envio e JSON e
 * espera `fotos` como lista de URLs — a API guarda o ficheiro primeiro e so
 * depois recebe a referencia.
 */
export const enviarFotosDoAtivo = (ficheiros) => {
  const corpo = new FormData();
  for (const f of ficheiros) corpo.append("files", f);
  return post("/uploads/submission-images", corpo);
};
export const alternarFavorito = (assetId) => post(`/wishlist/${assetId}/toggle`);

/**
 * Gestao do ativo.
 *
 * As imagens NAO entram no PATCH: o proprio schema da API as exclui do corpo
 * de atualizacao. Elas sao ficheiros, e ficheiro tem rota propria — anexar
 * envia multipart, ordenar manda a lista de ids na ordem nova, e remover apaga
 * a imagem, nao o ativo.
 */
export const atualizarAtivo = (id, dados) => patch(`/assets/${id}`, dados);
export const mudarStatusDoAtivo = (id, status, motivo) =>
  patch(`/assets/${id}/status`, { status, ...(motivo ? { motivo } : {}) });

export const anexarFotosAoAtivo = (id, ficheiros) => {
  const corpo = new FormData();
  for (const f of ficheiros) corpo.append("files", f);
  return post(`/uploads/assets/${id}/images`, corpo);
};
export const reordenarFotosDoAtivo = (id, imageIds) =>
  patch(`/uploads/assets/${id}/images/order`, { imageIds });
export const removerFotoDoAtivo = (imageId) => del(`/uploads/images/${imageId}`);

/** Curadoria de envios. Iniciar marca que o envio esta com alguem. */
export const iniciarAvaliacaoDeEnvio = (id) => post(`/submissions/${id}/start-review`);
export const avaliarEnvio = (id, dados) => post(`/submissions/${id}/evaluations`, dados);

export const salvarConfiguracoes = (dados) => patch("/management/settings", dados);
export const atribuirConsulta = (id, assignedTo) => post(`/quotes/${id}/assign`, { assignedTo });
export const responderConsulta = (id, dados) => post(`/quotes/${id}/respond`, dados);
export const programarRepasses = (ids, scheduledAt) =>
  post("/payouts/schedule", { ids, scheduledAt });
export const pagarRepasses = (ids, dados) => post("/payouts/mark-paid", { ids, ...dados });

/** Marca a notificação como lida e devolve o contador atualizado. */
export const lerNotificacao = (id) => post(`/notifications/${id}/read`);
export const lerTodasNotificacoes = () => post("/notifications/read-all");
