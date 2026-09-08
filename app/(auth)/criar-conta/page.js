"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PanelField from "@/components/panel/molecules/PanelField/PanelField";
import PanelButton from "@/components/panel/atoms/PanelButton/PanelButton";
import PanelIcon from "@/components/panel/atoms/PanelIcon/PanelIcon";
import { useSession } from "@/lib/auth/SessionContext";
import styles from "@/components/panel/molecules/AuthForm/AuthForm.module.css";

/**
 * Criar conta.
 *
 * O perfil é escolhido no cadastro porque muda a jornada inteira: quem vende
 * cai no painel de vendas, quem compra cai nas compras. Só existem estas duas
 * opções — papéis internos da RED (curador, comercial, financeiro) são criados
 * pela gestão, nunca por registo público.
 */
export default function CriarContaPage() {
  const { criarConta } = useSession();
  const router = useRouter();
  const [perfil, setPerfil] = useState("comprador");
  const [erro, setErro] = useState(null);
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
      await criarConta({
        name: d.get("name"),
        email: d.get("email"),
        password: d.get("password"),
        phone: d.get("phone") || undefined,
        company: d.get("company") || undefined,
        role: perfil,
      });
      router.push("/painel");
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
          Leva menos de um minuto. Você pode comprar e vender com a mesma conta.
        </p>
      </header>

      <form className={styles.form} onSubmit={submeter}>
        {erro && (
          <p className={styles.erro}>
            <PanelIcon name="alert" size={15} />
            {erro}
          </p>
        )}

        <span className={styles.rotuloGrupo}>Como você vai usar a RED?</span>
        <div className={styles.perfil}>
          {[
            { valor: "comprador", titulo: "Quero comprar", apoio: "Buscar ativos para minha operação." },
            { valor: "fornecedor", titulo: "Quero vender", apoio: "Disponibilizar ativos para avaliação." },
          ].map((o) => (
            <button
              key={o.valor}
              type="button"
              className={`${styles.opcaoPerfil} ${perfil === o.valor ? styles.perfilAtivo : ""}`}
              onClick={() => setPerfil(o.valor)}
              aria-pressed={perfil === o.valor}
            >
              <strong>{o.titulo}</strong>
              <span>{o.apoio}</span>
            </button>
          ))}
        </div>

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

        <PanelButton type="submit" size="lg" className={styles.acao} disabled={enviando}>
          {enviando ? "Criando…" : "Criar conta"}
        </PanelButton>
      </form>

      <p className={styles.alternativa}>
        Já tem conta? <Link href="/entrar">Entrar</Link>
      </p>
    </>
  );
}
