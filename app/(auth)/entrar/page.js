"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import PanelField from "@/components/panel/molecules/PanelField/PanelField";
import PanelButton from "@/components/panel/atoms/PanelButton/PanelButton";
import PanelIcon from "@/components/panel/atoms/PanelIcon/PanelIcon";
import { useSession } from "@/lib/auth/SessionContext";
import styles from "@/components/panel/molecules/AuthForm/AuthForm.module.css";

function Formulario() {
  const { entrar } = useSession();
  const router = useRouter();
  const params = useSearchParams();
  const [erro, setErro] = useState(null);

  /**
   * Trava o envio até a hidratação.
   *
   * Um `<form>` sem `action` submete nativamente para a própria URL, por GET —
   * e os campos viram query string. Antes de o React assumir o formulário,
   * isso colocaria a SENHA na barra de endereço, no histórico do navegador e
   * nos logs do servidor.
   *
   * O botão só habilita quando este efeito roda, o que só acontece no cliente.
   */
  const [pronto, setPronto] = useState(false);
  useEffect(() => setPronto(true), []);
  const [enviando, setEnviando] = useState(false);

  // Volta para onde a pessoa queria ir antes de ser interrompida pelo login.
  const destino = params.get("de") || null;

  async function submeter(e) {
    e.preventDefault();
    setErro(null);
    setEnviando(true);

    const dados = new FormData(e.currentTarget);
    try {
      const u = await entrar(dados.get("email"), dados.get("password"));
      // Quem tem capacidade de gestão cai na gestão; os demais, na Área do
      // Cliente. Mandar todos para o mesmo lugar obrigaria o time RED a
      // navegar por uma área que não é a dele a cada login.
      router.push(destino || (u.acessaPainelDeGestao ? "/gestao" : "/painel"));
    } catch (e2) {
      // Mensagem única para credencial errada: distinguir "e-mail não existe"
      // de "senha incorreta" entrega ao atacante quais contas existem.
      setErro(
        e2.status === 401 || e2.status === 400
          ? "E-mail ou senha incorretos."
          : e2.message
      );
      setEnviando(false);
    }
  }

  return (
    <>
      <header className={styles.cabeca}>
        <h1 className={styles.titulo}>Acessar sua conta</h1>
        <p className={styles.apoio}>
          Acompanhe suas compras, consultas, ativos e resultados na RED.
        </p>
      </header>

      <form className={styles.form} onSubmit={submeter}>
        {erro && (
          <p className={styles.erro}>
            <PanelIcon name="alert" size={15} />
            {erro}
          </p>
        )}

        <PanelField
          label="E-mail"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="voce@empresa.com.br"
          required
        />
        <PanelField
          label="Senha"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />

        <Link href="/recuperar-senha" className={styles.esqueci}>
          Esqueci minha senha
        </Link>

        <PanelButton type="submit" size="lg" className={styles.acao} disabled={enviando || !pronto}>
          {enviando ? "Entrando…" : "Entrar"}
        </PanelButton>
      </form>

      <p className={styles.alternativa}>
        Ainda não tem conta? <Link href="/criar-conta">Criar conta</Link>
      </p>
    </>
  );
}

export default function EntrarPage() {
  return (
    <Suspense fallback={null}>
      <Formulario />
    </Suspense>
  );
}
