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
 * Aprovacao do fornecedor sobre preco e modelo.
 *
 * E a regra central da RED: nenhum ativo chega ao catalogo por preco que o
 * dono nao autorizou. Sem esta chamada o ativo fica preso em "aguardando
 * aprovacao" e a publicacao e recusada pela API.
 */
export const aprovarPrecoDoAtivo = (id) => post(`/assets/${id}/supplier-approval`);

/**
 * Gestao do ativo.
 *
 * As imagens NAO entram no PATCH: o proprio schema da API as exclui do corpo
 * de atualizacao. Elas sao ficheiros, e ficheiro tem rota propria — anexar
 * envia multipart, ordenar manda a lista de ids na ordem nova, e remover apaga
 * a imagem, nao o ativo.
 */
/** Cadastro direto no catalogo. Nasce em rascunho — publicar e passo separado. */
export const criarAtivo = (dados) => post("/assets", dados);
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
export const atualizarEnvio = (id, dados) => patch(`/submissions/${id}`, dados);
export const iniciarAvaliacaoDeEnvio = (id) => post(`/submissions/${id}/start-review`);
export const avaliarEnvio = (id, dados) => post(`/submissions/${id}/evaluations`, dados);

/**
 * Categorias e subcategorias do catalogo.
 *
 * Nao ha remocao: uma categoria com ativos nao pode simplesmente sumir — o
 * ativo ficaria orfao. Desativar tira do catalogo e preserva o historico.
 */
export const criarCategoria = (dados) => post("/catalog/categories", dados);
export const atualizarCategoria = (id, dados) => patch(`/catalog/categories/${id}`, dados);
export const criarSubcategoria = (dados) => post("/catalog/subcategories", dados);
export const atualizarSubcategoria = (id, dados) => patch(`/catalog/subcategories/${id}`, dados);

/** Utilizadores do sistema. Criar exige senha; atualizar so a troca se vier. */
export const criarUsuario = (dados) => post("/users", dados);
export const atualizarUsuario = (id, dados) => patch(`/users/${id}`, dados);
export const removerUsuario = (id) => del(`/users/${id}`);

export const salvarConfiguracoes = (dados) => patch("/management/settings", dados);
export const atribuirConsulta = (id, assignedTo) => post(`/quotes/${id}/assign`, { assignedTo });
export const responderConsulta = (id, dados) => post(`/quotes/${id}/respond`, dados);
export const mudarStatusDaConsulta = (id, status, motivo) =>
  patch(`/quotes/${id}/status`, { status, ...(motivo ? { motivo } : {}) });
/**
 * Pedidos.
 *
 * O ciclo operacional inteiro: confirmar a venda, registar pagamento e
 * retirada, e concluir. A conclusao NAO e um status que se escolhe — a API
 * verifica as condicoes e recusa se faltar alguma; `pendenciasDoPedido`
 * devolve exatamente quais faltam, para a tela dizer o que falta em vez de
 * so falhar.
 */
export const confirmarPedido = (id) => post(`/orders/${id}/confirm`);
export const mudarStatusDoPedido = (id, status, motivo) =>
  patch(`/orders/${id}/status`, { status, ...(motivo ? { motivo } : {}) });
export const registrarPagamento = (id, dados) => patch(`/orders/${id}/payment`, dados);
export const registrarRetirada = (id, dados) => patch(`/orders/${id}/pickup`, dados);
export const concluirPedido = (id) => post(`/orders/${id}/complete`);

export const programarRepasses = (ids, scheduledAt) =>
  post("/payouts/schedule", { ids, scheduledAt });
export const pagarRepasses = (ids, dados) => post("/payouts/mark-paid", { ids, ...dados });

/** Marca a notificação como lida e devolve o contador atualizado. */
export const lerNotificacao = (id) => post(`/notifications/${id}/read`);
export const lerTodasNotificacoes = () => post("/notifications/read-all");
