"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { get, post, gravarToken, lerToken } from "@/lib/api";

const SessionContext = createContext(null);

/**
 * Sessão do utilizador.
 *
 * O token vive no localStorage e a identidade é recarregada da API a cada
 * abertura — nunca do que ficou guardado. Confiar num objeto de utilizador
 * gravado no navegador significaria exibir "Administrador" para quem foi
 * rebaixado a comprador ontem.
 *
 * `carregando` existe para as telas não decidirem nada enquanto a sessão está
 * sendo verificada: sem ele, o guard chuta o utilizador para o login no
 * primeiro render e ele perde a página que pediu.
 */
export function SessionProvider({ children }) {
  const [utilizador, setUtilizador] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const router = useRouter();

  const recarregar = useCallback(async () => {
    if (!lerToken()) {
      setUtilizador(null);
      setCarregando(false);
      return null;
    }
    try {
      const u = await get("/auth/me");
      setUtilizador(u);
      return u;
    } catch {
      gravarToken(null);
      setUtilizador(null);
      return null;
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    recarregar();
  }, [recarregar]);

  /**
   * Sobe os favoritos que o visitante juntou antes de ter sessão.
   *
   * Sem isto, quem favorita navegando sem conta e depois entra abre a tela de
   * Favoritos vazia: o coração do site gravava no navegador e a Área do
   * Cliente lê da API. Eram duas listas que não se falavam.
   *
   * Falha em silêncio de propósito: perder a sincronização é um incômodo,
   * derrubar o login por causa dela seria muito pior.
   */
  const sincronizarFavoritos = useCallback(async () => {
    try {
      const guardados = JSON.parse(window.localStorage.getItem("redestine.wishlist") || "[]");
      const ids = guardados.map((f) => f?.id).filter(Boolean);
      if (ids.length) await post("/wishlist/sync", { assetIds: ids });
    } catch {
      /* o navegador continua com a lista; a próxima ação reconcilia */
    }
  }, []);

  const entrar = useCallback(
    async (email, password) => {
      const r = await post("/auth/login", { email, password });
      gravarToken(r.token);
      setUtilizador(r.user);
      await sincronizarFavoritos();
      return r.user;
    },
    [sincronizarFavoritos]
  );

  const criarConta = useCallback(
    async (dados) => {
      const r = await post("/auth/register", dados);
      gravarToken(r.token);
      setUtilizador(r.user);
      await sincronizarFavoritos();
      return r.user;
    },
    [sincronizarFavoritos]
  );

  const sair = useCallback(() => {
    gravarToken(null);
    setUtilizador(null);
    router.push("/entrar");
  }, [router]);

  const valor = useMemo(
    () => ({
      utilizador,
      carregando,
      autenticado: !!utilizador,
      // Capacidade, não papel — a mesma lógica do backend. O front usa isto
      // só para esconder menu; quem bloqueia de verdade é a API.
      capacidades: utilizador?.capabilities || [],
      podeGerir: (utilizador?.capabilities || []).length > 0,
      entrar,
      criarConta,
      sair,
      recarregar,
    }),
    [utilizador, carregando, entrar, criarConta, sair, recarregar]
  );

  return <SessionContext.Provider value={valor}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession precisa estar dentro de <SessionProvider>.");
  return ctx;
}
