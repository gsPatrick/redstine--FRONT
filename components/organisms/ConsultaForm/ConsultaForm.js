"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/atoms/Button/Button";
import { post } from "@/lib/api";
import { useSession } from "@/lib/auth/SessionContext";
import styles from "./ConsultaForm.module.css";

/**
 * Consultar Condições.
 *
 * É a entrada da modalidade de consulta, e não existia: o ativo sob consulta
 * caía no carrinho como se fosse comprável, "Sob consulta" aparecia como forma
 * de pagamento, e a tela "Minhas Consultas" não tinha como receber nada.
 *
 * Consulta não é formulário de contato: gera uma cotação com referência, dono
 * do atendimento e histórico, que o comprador acompanha na Área do Cliente. Por
 * isso a confirmação diz onde acompanhar, e não só "recebemos".
 *
 * Quem tem sessão não reescreve os próprios dados — eles vêm do cadastro e os
 * campos ficam pré-preenchidos. Visitante pode consultar sem conta: exigir
 * cadastro antes de saber o preço afastaria justamente quem está avaliando.
 */
export default function ConsultaForm({ product, aoFechar }) {
  const { utilizador } = useSession();
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);
  const [feito, setFeito] = useState(null);

  const enviar = async (e) => {
    e.preventDefault();
    setErro(null);
    setEnviando(true);

    const f = new FormData(e.currentTarget);
    const texto = (k) => f.get(k)?.toString().trim() || undefined;

    try {
      const r = await post("/quotes", {
        assetId: product.id,
        buyerName: texto("buyerName"),
        buyerEmail: texto("buyerEmail"),
        buyerPhone: texto("buyerPhone"),
        company: texto("company"),
        quantity: f.get("quantity") ? Number(f.get("quantity")) : undefined,
        message: texto("message"),
      });
      setFeito(r?.reference || true);
    } catch (e2) {
      setErro(e2.details?.[0]?.motivo || e2.message);
    } finally {
      setEnviando(false);
    }
  };

  if (feito) {
    return (
      <div className={styles.sucesso}>
        <span className={styles.selo} aria-hidden="true">
          {/* SVG inline: o Icon do site nao tem "check", e criar um icone novo
              no atlas so para esta tela seria mais peso do que precisa. */}
          <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
            <path
              d="M20 6L9 17l-5-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <h3>Consulta enviada.</h3>
        <p>
          {typeof feito === "string" ? (
            <>
              Sua consulta é a <strong>{feito}</strong>. A equipe RED responde com preço e
              condições de retirada.
            </>
          ) : (
            <>A equipe RED responde com preço e condições de retirada.</>
          )}
        </p>
        <p className={styles.onde}>
          {utilizador ? (
            <>
              Acompanhe a resposta em{" "}
              <Link href="/painel/consultas">Minhas Consultas</Link>.
            </>
          ) : (
            <>
              A resposta vai para o e-mail informado.{" "}
              <Link href="/criar-conta">Criando uma conta</Link> você acompanha tudo em Minhas
              Consultas.
            </>
          )}
        </p>
        {aoFechar && (
          <Button type="button" variant="outline" size="sm" onClick={aoFechar}>
            Fechar
          </Button>
        )}
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={enviar}>
      <p className={styles.intro}>
        Este ativo é negociado <strong>sob consulta</strong>: o preço depende da quantidade, da
        retirada e do estado do lote. Diga o que precisa e a RED responde com as condições.
      </p>

      {erro && (
        <p className={styles.erro} role="alert">
          {erro}
        </p>
      )}

      <div className={styles.grade}>
        <label className={styles.campo}>
          <span>Nome</span>
          <input name="buyerName" defaultValue={utilizador?.name || ""} required minLength={2} />
        </label>
        <label className={styles.campo}>
          <span>E-mail</span>
          <input
            name="buyerEmail"
            type="email"
            defaultValue={utilizador?.email || ""}
            required
          />
        </label>
        <label className={styles.campo}>
          <span>Telefone</span>
          <input name="buyerPhone" defaultValue={utilizador?.phone || ""} />
        </label>
        <label className={styles.campo}>
          <span>Empresa</span>
          <input
            name="company"
            defaultValue={utilizador?.companyTradeName || utilizador?.company || ""}
          />
        </label>
        <label className={styles.campo}>
          <span>Quantidade desejada</span>
          <input name="quantity" type="number" min="1" placeholder="Ex.: 200" />
        </label>
        <label className={`${styles.campo} ${styles.largo}`}>
          <span>Mensagem</span>
          <textarea
            name="message"
            rows={4}
            placeholder="Prazo, local de retirada, necessidade de transporte…"
          />
        </label>
      </div>

      <div className={styles.rodape}>
        {aoFechar && (
          <Button type="button" variant="outline" size="sm" onClick={aoFechar}>
            Cancelar
          </Button>
        )}
        <button type="submit" className={styles.enviar} disabled={enviando}>
          {enviando ? "Enviando…" : "Enviar consulta"}
        </button>
      </div>
    </form>
  );
}
