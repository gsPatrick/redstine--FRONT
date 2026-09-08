"use client";

import PanelField from "@/components/panel/molecules/PanelField/PanelField";
import ContaLayout from "./ContaLayout";
import { useRecurso, salvarPerfil } from "@/lib/painel/api-cliente";
import { useSession } from "@/lib/auth/SessionContext";
import styles from "./conta.module.css";

export default function DadosCadastraisPage() {
  const { dados, carregando, erro, recarregar } = useRecurso("/me/profile");
  const { recarregar: recarregarSessao } = useSession();
  const d = dados?.dados;

  return (
    <ContaLayout
      titulo="Dados Cadastrais"
      descricao="Seus dados pessoais na RED."
      secao="Dados Cadastrais"
      carregando={carregando}
      erro={erro}
      onTentarNovamente={recarregar}
      onSubmit={async (form) => {
        await salvarPerfil(form);
        // O nome aparece no topo de toda a área: sem recarregar a sessão, o
        // cabeçalho continuaria mostrando o nome antigo até o próximo login.
        await recarregarSessao();
      }}
    >
      {d && (
        <div className={styles.grade}>
          <PanelField label="Nome" name="nome" defaultValue={d.nome || ""} />
          <PanelField label="Sobrenome" name="sobrenome" defaultValue={d.sobrenome || ""} />
          <PanelField label="CPF" name="cpf" defaultValue={d.cpf || ""} />
          <PanelField label="Telefone" name="telefone" defaultValue={d.telefone || ""} />
          <PanelField label="Cidade" name="cidade" defaultValue={d.cidade || ""} />
          <PanelField label="Estado (UF)" name="estado" maxLength={2} defaultValue={d.estado || ""} />
          <PanelField
            label="E-mail"
            name="email"
            type="email"
            defaultValue={d.email || ""}
            disabled
            className={styles.largo}
            dica="O e-mail é a identidade de login e não pode ser alterado por aqui. Fale com a RED se precisar trocá-lo."
          />
        </div>
      )}
    </ContaLayout>
  );
}
