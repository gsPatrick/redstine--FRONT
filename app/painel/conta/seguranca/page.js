"use client";

import PanelField from "@/components/panel/molecules/PanelField/PanelField";
import ContaLayout from "../ContaLayout";
import { trocarSenha } from "@/lib/painel/api-cliente";
import styles from "../conta.module.css";

/**
 * Segurança.
 *
 * A troca exige a senha atual mesmo com sessão válida: uma sessão esquecida
 * aberta num computador partilhado não pode virar troca de senha.
 *
 * "Encerrar sessões" não aparece porque a V1 não tem controle de sessões — o
 * token é stateless e não há como revogar um individualmente. Prometer o botão
 * e não revogar nada seria pior do que não oferecer.
 */
export default function SegurancaPage() {
  return (
    <ContaLayout
      titulo="Segurança"
      descricao="Senha de acesso à sua conta."
      secao="Segurança"
      rotuloAcao="Alterar senha"
      onSubmit={async (form) => {
        if (form.novaSenha !== form.confirmar) {
          throw new Error("As senhas não coincidem.");
        }
        await trocarSenha({ senhaAtual: form.senhaAtual, novaSenha: form.novaSenha });
      }}
    >
      <p className={styles.aviso}>
        Para sua segurança, pedimos a senha atual mesmo com você já autenticado.
      </p>

      <h2 className={styles.tituloSecao}>Alterar senha</h2>
      <div className={styles.grade}>
        <PanelField
          label="Senha atual"
          name="senhaAtual"
          type="password"
          autoComplete="current-password"
          className={styles.largo}
          required
        />
        <PanelField
          label="Nova senha"
          name="novaSenha"
          type="password"
          autoComplete="new-password"
          minLength={8}
          dica="Mínimo de 8 caracteres."
          required
        />
        <PanelField
          label="Confirmar nova senha"
          name="confirmar"
          type="password"
          autoComplete="new-password"
          required
        />
      </div>
    </ContaLayout>
  );
}
