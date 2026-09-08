"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import PanelField from "@/components/panel/molecules/PanelField/PanelField";
import PanelButton from "@/components/panel/atoms/PanelButton/PanelButton";
import PanelIcon from "@/components/panel/atoms/PanelIcon/PanelIcon";
import { post } from "@/lib/api";
import styles from "@/components/panel/molecules/AuthForm/AuthForm.module.css";

function Formulario() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");
  const [erro, setErro] = useState(null);
  const [enviando, setEnviando] = useState(false);

  async function submeter(e) {
    e.preventDefault();
    setErro(null);

    const d = new FormData(e.currentTarget);
    if (d.get("novaSenha") !== d.get("confirmar")) {
      setErro("As senhas não coincidem.");
      return;
    }

    setEnviando(true);
    try {
      await post("/auth/reset-password", { token, newPassword: d.get("novaSenha") });
      router.push("/entrar");
    } catch (e2) {
      setErro(
        e2.status === 400
          ? "Este link expirou ou já foi usado. Peça um novo."
          : e2.message
      );
      setEnviando(false);
    }
  }

  if (!token) {
    return (
      <>
        <header className={styles.cabeca}>
          <h1 className={styles.titulo}>Link inválido</h1>
        </header>
        <p className={styles.erro}>
          <PanelIcon name="alert" size={15} />
          Este link de redefinição não é válido. Peça um novo para continuar.
        </p>
        <p className={styles.alternativa}>
          <Link href="/recuperar-senha">Pedir novo link</Link>
        </p>
      </>
    );
  }

  return (
    <>
      <header className={styles.cabeca}>
        <h1 className={styles.titulo}>Criar nova senha</h1>
        <p className={styles.apoio}>Escolha uma senha com pelo menos 8 caracteres.</p>
      </header>

      <form className={styles.form} onSubmit={submeter}>
        {erro && (
          <p className={styles.erro}>
            <PanelIcon name="alert" size={15} />
            {erro}
          </p>
        )}
        <PanelField
          label="Nova senha"
          name="novaSenha"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
        <PanelField
          label="Confirmar nova senha"
          name="confirmar"
          type="password"
          autoComplete="new-password"
          required
        />
        <PanelButton type="submit" size="lg" className={styles.acao} disabled={enviando}>
          {enviando ? "Salvando…" : "Salvar nova senha"}
        </PanelButton>
      </form>
    </>
  );
}

export default function RedefinirSenhaPage() {
  return (
    <Suspense fallback={null}>
      <Formulario />
    </Suspense>
  );
}
