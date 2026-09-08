"use client";

import PanelField from "@/components/panel/molecules/PanelField/PanelField";
import ContaLayout from "../ContaLayout";
import { useRecurso, salvarEmpresa } from "@/lib/painel/api-cliente";
import styles from "../conta.module.css";

/** A captação da RED é prioritariamente profissional e empresarial — por isso
 *  Empresa é uma página própria, e não um campo solto no cadastro pessoal. */
export default function EmpresaPage() {
  const { dados, carregando, erro, recarregar } = useRecurso("/me/profile");
  const e = dados?.empresa;

  return (
    <ContaLayout
      titulo="Empresa"
      descricao="Dados da pessoa jurídica vinculada à sua conta."
      secao="Empresa"
      carregando={carregando}
      erro={erro}
      onTentarNovamente={recarregar}
      onSubmit={salvarEmpresa}
    >
      {e && (
        <div className={styles.grade}>
          <PanelField
            label="Razão social"
            name="razaoSocial"
            defaultValue={e.razaoSocial || ""}
            className={styles.largo}
          />
          <PanelField label="Nome fantasia" name="nomeFantasia" defaultValue={e.nomeFantasia || ""} />
          <PanelField label="CNPJ" name="cnpj" defaultValue={e.cnpj || ""} />
          <PanelField label="Cargo / função" name="cargo" defaultValue={e.cargo || ""} />
          <PanelField
            label="E-mail corporativo"
            name="email"
            type="email"
            defaultValue={e.email || ""}
          />
        </div>
      )}
    </ContaLayout>
  );
}
