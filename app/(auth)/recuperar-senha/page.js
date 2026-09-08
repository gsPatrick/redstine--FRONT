"use client";

import Link from "next/link";
import { useState } from "react";
import PanelField from "@/components/panel/molecules/PanelField/PanelField";
import PanelButton from "@/components/panel/atoms/PanelButton/PanelButton";
import PanelIcon from "@/components/panel/atoms/PanelIcon/PanelIcon";
import { post } from "@/lib/api";
import styles from "@/components/panel/molecules/AuthForm/AuthForm.module.css";

export default function RecuperarSenhaPage() {
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);

  async function submeter(e) {
    e.preventDefault();
    setEnviando(true);
    const email = new FormData(e.currentTarget).get("email");
    // Erro e sucesso levam à mesma tela de propósito: responder diferente para
    // e-mail inexistente entregaria quais contas existem na plataforma.
    await post("/auth/forgot-password", { email }).catch(() => {});
    setEnviado(true);
  }

  if (enviado) {
    return (
      <>
        <header className={styles.cabeca}>
          <h1 className={styles.titulo}>Verifique seu e-mail</h1>
        </header>
        <p className={styles.sucesso}>
          <PanelIcon name="checkCircle" size={15} />
          Se houver uma conta com esse e-mail, enviamos um link para redefinir a senha. O link vale
          por 1 hora.
        </p>
        <p className={styles.alternativa}>
          <Link href="/entrar">Voltar para o login</Link>
        </p>
      </>
    );
  }

  return (
    <>
      <header className={styles.cabeca}>
        <h1 className={styles.titulo}>Recuperar senha</h1>
        <p className={styles.apoio}>
          Informe o e-mail da sua conta e enviamos um link para você criar uma nova senha.
        </p>
      </header>

      <form className={styles.form} onSubmit={submeter}>
        <PanelField label="E-mail" name="email" type="email" autoComplete="email" required />
        <PanelButton type="submit" size="lg" className={styles.acao} disabled={enviando}>
          {enviando ? "Enviando…" : "Enviar link"}
        </PanelButton>
      </form>

      <p className={styles.alternativa}>
        Lembrou a senha? <Link href="/entrar">Entrar</Link>
      </p>
    </>
  );
}
