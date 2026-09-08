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

  const entrar = useCallback(
    async (email, password) => {
      const r = await post("/auth/login", { email, password });
      gravarToken(r.token);
      setUtilizador(r.user);
      return r.user;
    },
    []
  );

  const criarConta = useCallback(async (dados) => {
    const r = await post("/auth/register", dados);
    gravarToken(r.token);
    setUtilizador(r.user);
    return r.user;
  }, []);

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
