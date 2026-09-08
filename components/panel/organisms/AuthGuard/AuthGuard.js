"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "@/lib/auth/SessionContext";
import styles from "./AuthGuard.module.css";

/**
 * Porteiro das áreas autenticadas.
 *
 * Isto é conveniência de navegação, NÃO controle de acesso: quem bloqueia é a
 * API, que recusa por capacidade mesmo com token válido de outro perfil.
 * Esconder a tela apenas evita que o utilizador veja um painel que só lhe
 * devolveria 403.
 *
 * Enquanto a sessão carrega não decide nada — chutar para o login no primeiro
 * render faria o utilizador perder a página que pediu a cada F5.
 */
export default function AuthGuard({ children, capacidade, alternativas = [] }) {
  const { carregando, autenticado, capacidades } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // Qualquer uma das capacidades serve: o perfil Financeiro não tem
  // `commercial_read` mas entra na gestão pela área que é dele.
  const aceitas = capacidade ? [capacidade, ...alternativas] : [];
  const semPermissao = aceitas.length > 0 && !aceitas.some((c) => capacidades.includes(c));

  useEffect(() => {
    if (carregando) return;
    if (!autenticado) {
      // Guarda o destino para devolver a pessoa onde ela queria estar.
      router.replace(`/entrar?de=${encodeURIComponent(pathname)}`);
    } else if (semPermissao) {
      router.replace("/painel");
    }
  }, [carregando, autenticado, semPermissao, router, pathname]);

  if (carregando || !autenticado || semPermissao) {
    return (
      <div className={styles.espera} role="status" aria-live="polite">
        <span className={styles.giro} />
        <span className={styles.texto}>
          {carregando ? "Verificando sua sessão…" : "Redirecionando…"}
        </span>
      </div>
    );
  }

  return children;
}
