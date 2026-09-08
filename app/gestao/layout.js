"use client";

import PanelShell from "@/components/panel/organisms/PanelShell/PanelShell";
import AuthGuard from "@/components/panel/organisms/AuthGuard/AuthGuard";
import { useSession } from "@/lib/auth/SessionContext";
import { useLista } from "@/lib/painel/api-cliente";
import { gruposPara, atalhosDeConta } from "./navegacao";

const ROTULO_PAPEL = {
  admin: "Administrador",
  curador: "Curadoria",
  comercial: "Comercial",
  financeiro: "Financeiro",
};

/**
 * Painel de Gestão.
 *
 * O menu é montado a partir das CAPACIDADES da sessão: quem é comercial não vê
 * Financeiro. Isso é conveniência — quem bloqueia de verdade é a API, que
 * recusa por URL mesmo com token válido de outro perfil.
 *
 * Tema escuro porque é ambiente de operação contínua; a Área do Cliente fica
 * clara, porque o cliente entra, resolve e sai.
 */
export default function GestaoLayout({ children }) {
  const { utilizador, capacidades, sair } = useSession();
  const { linhas: notificacoes } = useLista("/notifications?perPage=8", { ativo: !!utilizador });

  const usuario = {
    nome: [utilizador?.name, utilizador?.lastName].filter(Boolean).join(" ") || "—",
    papel: ROTULO_PAPEL[utilizador?.role] || utilizador?.role || "",
  };

  return (
    <AuthGuard capacidade="commercial_read" alternativas={["financial_read", "admin_read"]}>
      <PanelShell
        tema="escuro"
        tituloMenu="Painel de Gestão RED"
        grupos={gruposPara(capacidades)}
        usuario={usuario}
        notificacoes={(notificacoes || []).map(paraSino)}
        atalhosDeConta={atalhosDeConta}
        onSair={sair}
      >
        {children}
      </PanelShell>
    </AuthGuard>
  );
}

function paraSino(n) {
  const categoria = n.type?.includes("consulta")
    ? "consulta"
    : n.type?.includes("envio") || n.type?.includes("ativo")
    ? "ativo"
    : n.type?.includes("venda")
    ? "venda"
    : "financeiro";

  return {
    id: n.id,
    categoria,
    tom: n.type?.includes("pendente") || n.type?.includes("aguardando") ? "warn" : "ok",
    titulo: n.title,
    data: n.createdAt,
    link: n.link || "#",
    lida: !!n.readAt,
  };
}
