"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import PanelField from "@/components/panel/molecules/PanelField/PanelField";
import PanelButton from "@/components/panel/atoms/PanelButton/PanelButton";
import PanelIcon from "@/components/panel/atoms/PanelIcon/PanelIcon";
import { useSession } from "@/lib/auth/SessionContext";
import AvisoDestino from "../AvisoDestino";
import styles from "@/components/panel/molecules/AuthForm/AuthForm.module.css";

/**
 * Criar conta.
 *
 * NÃO existe escolha entre comprador e vendedor. A mesma pessoa pode ser as
 * duas coisas — quem vende um lote de mobiliário também compra material de
 * obra — e obrigá-la a decidir no cadastro criava duas contas para a mesma
 * empresa ou a prendia no lado errado da plataforma. A Área do Cliente é uma
 * só, com COMPRAR e VENDER para todos.
 *
 * Papéis internos da RED (admin, curador, comercial, financeiro) continuam
 * fora daqui: são criados pela gestão, nunca por registo público.
 */
function Formulario() {
  const { criarConta } = useSession();
  const router = useRouter();
  const params = useSearchParams();
  const [erro, setErro] = useState(null);

  // Volta para onde a pessoa queria ir antes de ser interrompida pelo cadastro.
  const destino = params.get("de") || null;

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

  async function submeter(e) {
    e.preventDefault();
    setErro(null);

    const d = new FormData(e.currentTarget);
    if (d.get("password") !== d.get("confirmar")) {
      setErro("As senhas não coincidem.");
      return;
    }

    setEnviando(true);
    try {
      // Sem `role`: o registo público cria sempre o mesmo tipo de conta de
      // cliente, com acesso a comprar e a vender.
      await criarConta({
        name: d.get("name"),
        email: d.get("email"),
        password: d.get("password"),
        phone: d.get("phone") || undefined,
        company: d.get("company") || undefined,
      });
      router.push(destino || "/painel");
    } catch (e2) {
      setErro(
        e2.code === "EMAIL_IN_USE"
          ? "Já existe uma conta com este e-mail."
          : e2.details?.[0]?.motivo || e2.message
      );
      setEnviando(false);
    }
  }

  return (
    <>
      <header className={styles.cabeca}>
        <h1 className={styles.titulo}>Criar conta</h1>
        <p className={styles.apoio}>
          Leva menos de um minuto. Uma conta só: você compra e vende pela mesma Área do Cliente.
        </p>
      </header>

      <AvisoDestino de={destino} />

      <form className={styles.form} onSubmit={submeter}>
        {erro && (
          <p className={styles.erro}>
            <PanelIcon name="alert" size={15} />
            {erro}
          </p>
        )}

        <PanelField label="Nome completo" name="name" autoComplete="name" required />
        <PanelField label="E-mail" name="email" type="email" autoComplete="email" required />

        <div className={styles.linha}>
          <PanelField label="Telefone" name="phone" autoComplete="tel" placeholder="(11) 99999-0000" />
          <PanelField label="Empresa" name="company" placeholder="Opcional" />
        </div>

        <div className={styles.linha}>
          <PanelField
            label="Senha"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            dica="Mínimo de 8 caracteres."
            required
          />
          <PanelField
            label="Confirmar senha"
            name="confirmar"
            type="password"
            autoComplete="new-password"
            required
          />
        </div>

        <PanelButton type="submit" size="lg" className={styles.acao} disabled={enviando || !pronto}>
          {enviando ? "Criando…" : "Criar conta"}
        </PanelButton>
      </form>

      <p className={styles.alternativa}>
        Já tem conta?{" "}
        <Link href={destino ? `/entrar?de=${encodeURIComponent(destino)}` : "/entrar"}>Entrar</Link>
      </p>
    </>
  );
}

export default function CriarContaPage() {
  return (
    <Suspense fallback={null}>
      <Formulario />
    </Suspense>
  );
}
