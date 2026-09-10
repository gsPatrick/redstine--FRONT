"use client";

import { useState } from "react";
import PanelButton from "@/components/panel/atoms/PanelButton/PanelButton";
import PanelIcon from "@/components/panel/atoms/PanelIcon/PanelIcon";
import { aprovarPrecoDoAtivo } from "@/lib/painel/api-cliente";
import { moeda, percentual } from "@/lib/painel/formato";
import styles from "./ativos.module.css";

/**
 * Aprovação do fornecedor sobre preço e modelo.
 *
 * É a regra central da RED: nenhum ativo chega ao catálogo por um preço que o
 * dono não autorizou. A curadoria avalia e propõe; quem decide é o fornecedor.
 *
 * Por isso a tela mostra as três coisas que ele está aceitando — o preço, a
 * regra de divisão e quanto sobra para ele — antes do botão. Aprovar sem ver a
 * participação seria assinar em branco, e é exatamente o que a regra existe
 * para impedir.
 */
export default function AprovarPreco({ ativo, aoAprovar, aoCancelar }) {
  const [gravando, setGravando] = useState(false);
  const [erro, setErro] = useState(null);

  const aprovar = async () => {
    setErro(null);
    setGravando(true);
    try {
      await aprovarPrecoDoAtivo(ativo.id);
      aoAprovar();
    } catch (e) {
      setErro(e.details?.[0]?.motivo || e.message);
    } finally {
      setGravando(false);
    }
  };

  return (
    <div className={styles.aprovacao}>
      {erro && (
        <p className={styles.erroAprovacao}>
          <PanelIcon name="alert" size={15} />
          {erro}
        </p>
      )}

      <p className={styles.nomeAtivo}>{ativo.nome}</p>

      <dl className={styles.condicoes}>
        <div>
          <dt>Preço proposto pela RED</dt>
          <dd className={styles.destaque}>{moeda(ativo.preco)}</dd>
        </div>
        {ativo.precoMercado ? (
          <div>
            <dt>Preço de mercado</dt>
            <dd>{moeda(ativo.precoMercado)}</dd>
          </div>
        ) : null}
        <div>
          <dt>Modelo comercial</dt>
          <dd>{ativo.modelo || "—"}</dd>
        </div>
        <div>
          <dt>Sua participação</dt>
          <dd>{percentual(ativo.participacao)}</dd>
        </div>
        <div>
          <dt>Quantidade</dt>
          <dd>
            {ativo.quantidadeDisponivel} {ativo.unidade || ""}
          </dd>
        </div>
        <div>
          <dt>Sua receita potencial</dt>
          <dd className={styles.destaque}>{moeda(ativo.receitaPotencial)}</dd>
        </div>
      </dl>

      <p className={styles.aviso}>
        Ao aprovar, você autoriza a RED a publicar este ativo no catálogo por esse preço e
        com essa regra de divisão. Se algo estiver errado, fale com a RED antes de aprovar.
      </p>

      <div className={styles.acoesAprovacao}>
        <PanelButton type="button" variant="ghost" onClick={aoCancelar} disabled={gravando}>
          Agora não
        </PanelButton>
        <PanelButton variant="success" onClick={aprovar} disabled={gravando}>
          {gravando ? "Aprovando…" : "Aprovar preço e modelo"}
        </PanelButton>
      </div>
    </div>
  );
}
