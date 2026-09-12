"use client";

import PanelShell from "@/components/panel/organisms/PanelShell/PanelShell";
import AuthGuard from "@/components/panel/organisms/AuthGuard/AuthGuard";
import { useSession } from "@/lib/auth/SessionContext";
import { useLista } from "@/lib/painel/api-cliente";
import { grupos, atalhosDeConta } from "./navegacao";

const PAPEL_INTERNO = {
  admin: "Administrador",
  curador: "Curadoria",
  comercial: "Comercial",
  financeiro: "Financeiro",
};

/**
 * Área do Cliente.
 *
 * O menu e a identidade saem da sessão real; as notificações, da API. Quem tem
 * capacidade de gestão ganha um atalho para a gestão — sem isso o time RED
 * teria de digitar a URL para trocar de ambiente.
 */
export default function PainelLayout({ children }) {
  const { utilizador, sair, podeGerir } = useSession();
  const { linhas: notificacoes } = useLista("/notifications?perPage=8", {
    ativo: !!utilizador,
  });

  // Rótulo do topo.
  //
  // Não diz mais "Comprador" ou "Fornecedor": a conta é uma só e a mesma
  // pessoa compra e vende pela mesma Área do Cliente — rotulá-la de
  // "Comprador" sugeria, falsamente, que ela não podia vender. Os papéis
  // internos da RED continuam identificados, porque quem é da equipe precisa
  // saber com que perfil está a olhar o ambiente.
  const usuario = {
    nome: [utilizador?.name, utilizador?.lastName].filter(Boolean).join(" ") || "—",
    papel: PAPEL_INTERNO[utilizador?.role] || "Cliente",
  };

  return (
    <AuthGuard>
      <PanelShell
        tema="claro"
        tituloMenu="Área do Cliente"
        grupos={grupos}
        usuario={usuario}
        notificacoes={(notificacoes || []).map(paraSino)}
        atalhosDeConta={[
          ...atalhosDeConta,
          ...(podeGerir ? [{ label: "Painel de Gestão", href: "/gestao", icone: "chart" }] : []),
        ]}
        onSair={sair}
      >
        {children}
      </PanelShell>
    </AuthGuard>
  );
}

/** Traduz a notificação da API para o formato do sino. */
function paraSino(n) {
  const categoria = n.type?.includes("compra")
    ? "compra"
    : n.type?.includes("consulta")
    ? "consulta"
    : n.type?.includes("ativo")
    ? "ativo"
    : n.type?.includes("venda")
    ? "venda"
    : "financeiro";

  return {
    id: n.id,
    categoria,
    tom: n.type?.includes("aguardando") ? "warn" : "ok",
    titulo: n.title,
    data: n.createdAt,
    link: n.link || "#",
    lida: !!n.readAt,
  };
}
