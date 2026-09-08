"use client";

import PanelField from "@/components/panel/molecules/PanelField/PanelField";
import ContaLayout from "../ContaLayout";
import { useRecurso, salvarEnderecos } from "@/lib/painel/api-cliente";
import styles from "../conta.module.css";

const CAMPOS = ["cep", "logradouro", "numero", "complemento", "bairro", "cidade", "estado"];

/**
 * Endereços.
 *
 * Dois endereços distintos porque servem a operações distintas: o de retirada
 * define para onde o comprador vai; o de cobrança vai na nota. Um campo só
 * obrigaria a escolher qual dos dois ficaria errado.
 */
export default function EnderecosPage() {
  const { dados, carregando, erro, recarregar } = useRecurso("/me/profile");
  const end = dados?.enderecos;

  return (
    <ContaLayout
      titulo="Endereços"
      descricao="Endereço de retirada e endereço de cobrança."
      secao="Endereços"
      carregando={carregando}
      erro={erro}
      onTentarNovamente={recarregar}
      onSubmit={(form) =>
        // O formulário é plano (`retirada.cep`); a API espera dois objetos.
        salvarEnderecos({
          retirada: Object.fromEntries(CAMPOS.map((c) => [c, form[`retirada.${c}`] || ""])),
          cobranca: Object.fromEntries(CAMPOS.map((c) => [c, form[`cobranca.${c}`] || ""])),
        })
      }
    >
      {end && (
        <>
          <h2 className={styles.tituloSecao}>Endereço de retirada</h2>
          <Bloco prefixo="retirada" valores={end.retirada} />

          <h2 className={styles.tituloSecao}>Endereço de cobrança</h2>
          <Bloco prefixo="cobranca" valores={end.cobranca} />
        </>
      )}
    </ContaLayout>
  );
}

function Bloco({ prefixo, valores }) {
  const v = valores || {};
  return (
    <div className={styles.grade}>
      <PanelField label="CEP" name={`${prefixo}.cep`} defaultValue={v.cep || ""} />
      <PanelField label="Cidade" name={`${prefixo}.cidade`} defaultValue={v.cidade || ""} />
      <PanelField
        label="Logradouro"
        name={`${prefixo}.logradouro`}
        defaultValue={v.logradouro || ""}
        className={styles.largo}
      />
      <PanelField label="Número" name={`${prefixo}.numero`} defaultValue={v.numero || ""} />
      <PanelField label="Bairro" name={`${prefixo}.bairro`} defaultValue={v.bairro || ""} />
      <PanelField
        label="Complemento"
        name={`${prefixo}.complemento`}
        defaultValue={v.complemento || ""}
        placeholder="Galpão, bloco, referência…"
      />
      <PanelField
        label="Estado (UF)"
        name={`${prefixo}.estado`}
        maxLength={2}
        defaultValue={v.estado || ""}
      />
    </div>
  );
}
