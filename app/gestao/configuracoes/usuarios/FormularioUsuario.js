"use client";

import { useState } from "react";
import PanelField from "@/components/panel/molecules/PanelField/PanelField";
import PanelButton from "@/components/panel/atoms/PanelButton/PanelButton";
import PanelIcon from "@/components/panel/atoms/PanelIcon/PanelIcon";
import { criarUsuario, atualizarUsuario } from "@/lib/painel/api-cliente";
import styles from "../configuracoes.module.css";

/** Os perfis internos aparecem primeiro: são os que se criam por aqui. */
const PERFIS = [
  { valor: "admin", label: "Master — acesso completo" },
  { valor: "curador", label: "Curadoria — avalia envios e administra ativos" },
  { valor: "comercial", label: "Comercial — ativos, consultas e vendas" },
  { valor: "financeiro", label: "Financeiro — cálculos, repasses e pagamentos" },
  { valor: "fornecedor", label: "Fornecedor" },
  { valor: "comprador", label: "Comprador" },
];

const STATUS = [
  { valor: "ativo", label: "Ativo" },
  { valor: "inativo", label: "Inativo" },
  { valor: "pendente", label: "Pendente" },
];

/**
 * Cadastro e edição de utilizador.
 *
 * O mesmo formulário para os dois casos, com uma diferença: na criação a senha
 * é obrigatória, e na edição fica em branco significando "não mexer" — um
 * campo de senha pré-preenchido com o valor atual seria mentira, porque a API
 * guarda o hash e não a senha.
 *
 * O perfil define as capacidades, e é o perfil que decide se a pessoa entra no
 * Painel de Gestão. Por isso a descrição de cada um está no próprio rótulo:
 * escolher "Comercial" sem saber que isso esconde o financeiro é o tipo de erro
 * que só aparece semanas depois.
 */
export default function FormularioUsuario({ usuario, aoGravar, aoCancelar }) {
  const editando = Boolean(usuario);
  const [gravando, setGravando] = useState(false);
  const [erro, setErro] = useState(null);

  const gravar = async (e) => {
    e.preventDefault();
    setErro(null);
    setGravando(true);

    const f = new FormData(e.currentTarget);
    const texto = (k) => f.get(k)?.toString().trim() || undefined;

    const dados = {
      name: texto("name"),
      email: texto("email"),
      role: texto("role"),
      status: texto("status"),
      phone: texto("phone"),
      company: texto("company"),
      document: texto("document"),
      city: texto("city"),
      state: texto("state")?.toUpperCase(),
    };

    const senha = texto("password");
    if (senha) dados.password = senha;

    try {
      if (editando) await atualizarUsuario(usuario.id, dados);
      else await criarUsuario(dados);
      aoGravar();
    } catch (e2) {
      setErro(e2.details?.[0]?.motivo || e2.message);
    } finally {
      setGravando(false);
    }
  };

  return (
    <form className={styles.formUsuario} onSubmit={gravar}>
      {erro && (
        <p className={styles.erroForm}>
          <PanelIcon name="alert" size={15} />
          {erro}
        </p>
      )}

      <div className={styles.gradeForm}>
        <PanelField
          label="Nome"
          name="name"
          defaultValue={usuario?.nome || ""}
          required
          minLength={2}
          className={styles.formLargo}
        />
        <PanelField
          label="E-mail"
          name="email"
          type="email"
          defaultValue={usuario?.email || ""}
          required
          className={styles.formLargo}
        />
        <PanelField
          label={editando ? "Nova senha" : "Senha"}
          name="password"
          type="password"
          required={!editando}
          minLength={8}
          autoComplete="new-password"
          dica={
            editando
              ? "Deixe em branco para manter a senha atual."
              : "Mínimo de 8 caracteres."
          }
          className={styles.formLargo}
        />
        <PanelField
          label="Perfil"
          name="role"
          as="select"
          required
          defaultValue={usuario?.perfil || ""}
          opcoes={[{ valor: "", label: "Selecione…" }, ...PERFIS]}
          className={styles.formLargo}
          dica="Define o que a pessoa vê e pode fazer."
        />
        <PanelField
          label="Status"
          name="status"
          as="select"
          defaultValue={usuario?.status || "ativo"}
          opcoes={STATUS}
        />
        <PanelField label="Telefone" name="phone" defaultValue={usuario?.telefone || ""} />
        <PanelField label="Empresa" name="company" defaultValue={usuario?.empresa || ""} />
        <PanelField label="CPF / CNPJ" name="document" defaultValue={usuario?.documento || ""} />
        <PanelField label="Cidade" name="city" defaultValue={usuario?.cidade || ""} />
        <PanelField
          label="UF"
          name="state"
          maxLength={2}
          defaultValue={usuario?.estado || ""}
          placeholder="RJ"
        />
      </div>

      <div className={styles.rodapeForm}>
        <PanelButton type="button" variant="ghost" onClick={aoCancelar} disabled={gravando}>
          Cancelar
        </PanelButton>
        <PanelButton type="submit" disabled={gravando}>
          {gravando ? "Salvando…" : editando ? "Salvar alterações" : "Criar usuário"}
        </PanelButton>
      </div>
    </form>
  );
}
