"use client";

import { useEffect, useState } from "react";
import ViewCount from "./ViewCount";
import { registrarVisualizacao } from "@/lib/visualizacoes";

/**
 * Visualizações na PÁGINA do produto (revisão do cliente, item 33).
 *
 * Faz as duas metades do item numa peça só: reporta a visita e exibe a
 * contagem. Separá-las daria dois componentes que precisam do mesmo número —
 * e o que exibisse mostraria o valor de antes da própria visita.
 *
 * É o único pedaço desta funcionalidade que precisa de ser componente de
 * cliente: a visita só existe no navegador. A página do produto continua a
 * renderizar-se no servidor; só esta ilha é hidratada.
 *
 * O número inicial vem do payload do catálogo (`product.views`), portanto a
 * contagem aparece no primeiro pintar, sem esperar pela rede. Quando a resposta
 * chega, o valor é substituído pelo total atualizado — que inclui esta visita
 * se ela contou. Não contando (mesmo visitante a recarregar), o número fica
 * como estava, que é precisamente o comportamento pedido.
 */
export default function VisualizacoesDoAtivo({ assetId, views = 0, size = "md", className = "" }) {
  const [total, setTotal] = useState(Number(views) || 0);

  useEffect(() => {
    let vivo = true;
    registrarVisualizacao(assetId).then((n) => {
      // `n` nulo significa "não reportado nesta navegação" ou falha de rede;
      // nos dois casos o número que já estava na tela continua correto.
      if (vivo && typeof n === "number") setTotal(n);
    });
    return () => {
      vivo = false;
    };
  }, [assetId]);

  return <ViewCount views={total} size={size} className={className} />;
}
