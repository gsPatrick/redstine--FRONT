"use client";

import { useState } from "react";
import Section from "@/components/atoms/Section/Section";
import SectionTitle from "@/components/atoms/SectionTitle/SectionTitle";
import Field from "@/components/molecules/Field/Field";
import { post } from "@/lib/api";
import styles from "./LeadForm.module.css";

const fields = [
  { label: "Nome", name: "nome", required: true },
  { label: "Empresa", name: "empresa" },
  { label: "E-mail", name: "email", type: "email", required: true },
  { label: "Telefone", name: "telefone", type: "tel", required: true },
  { label: "Cidade / Estado", name: "cidade" },
  {
    label: "Tipo de ativo",
    name: "tipo",
    type: "select",
    options: ["RED Construção", "RED Equipamentos", "RED Mobiliário"],
  },
  { label: "Descrição", name: "descricao", type: "textarea", span: 2, required: true },
  { label: "Quantidade aproximada", name: "quantidade" },
  { label: "Observações", name: "observacoes", type: "textarea", span: 2 },
  {
    label: "Upload de fotos",
    name: "fotos",
    type: "file",
    accept: "image/*",
    multiple: true,
    span: 2,
  },
];

export default function LeadForm({ title, note, id = "enviar" }) {
  const [sent, setSent] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Envio para avaliação.
   *
   * Vai de fato para a API — antes o formulário apenas trocava o texto do
   * botão e o envio se perdia. O `authorized: true` é literal porque o botão
   * só chega a ser clicável com a autorização marcada.
   */
  const submit = async (event) => {
    event.preventDefault();
    if (!agreed) return;

    const d = new FormData(event.currentTarget);
    setSending(true);
    setError(null);

    try {
      await post("/submissions", {
        name: d.get("nome"),
        company: d.get("empresa") || undefined,
        email: d.get("email"),
        phone: d.get("telefone"),
        city: d.get("cidade") || undefined,
        assetType: d.get("tipo") || undefined,
        description: d.get("descricao"),
        approximateQuantity: d.get("quantidade") || undefined,
        notes: d.get("observacoes") || undefined,
        authorized: true,
      });
      setSent(true);
    } catch (e) {
      setError(
        e.details?.[0]?.motivo ||
          e.message ||
          "Não foi possível enviar agora. Tente novamente em instantes."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <Section tone="tinted" id={id}>
      <SectionTitle title={title} />

      <form className={styles.form} onSubmit={submit}>
        <div className={styles.grid}>
          {fields.map((field) => (
            <Field key={field.name} {...field} />
          ))}
        </div>

        <div className={styles.consent}>
          <p className={styles.consentTitle}>AUTORIZAÇÃO</p>
          <label className={styles.check}>
            <input
              type="checkbox"
              className={styles.checkInput}
              checked={agreed}
              onChange={(event) => setAgreed(event.target.checked)}
              required
            />
            <span className={styles.checkBox} aria-hidden="true" />
            <span className={styles.checkLabel}>
              Declaro que as informações enviadas são verdadeiras e que possuo autorização para
              disponibilizar os ativos para avaliação.
            </span>
          </label>
        </div>

        <div className={styles.actions}>
          {/* Só clicável com a autorização marcada: sem ela a RED não pode
              sequer avaliar o ativo. */}
          <button
            type="submit"
            className={styles.submit}
            disabled={sent || sending || !agreed}
          >
            {sent ? "Recebido" : sending ? "Enviando…" : "Enviar Ativos"}
          </button>
          {!agreed && !sent ? (
            <p className={styles.hint}>Marque a autorização acima para enviar.</p>
          ) : null}
          {sent ? (
            <p className={styles.feedback} role="status">
              Recebemos seu envio. A RED entrará em contato após a avaliação.
            </p>
          ) : null}
          {error ? (
            <p className={styles.error} role="alert">
              {error}
            </p>
          ) : null}
        </div>

        {note ? <p className={styles.note}>{note}</p> : null}
      </form>
    </Section>
  );
}
