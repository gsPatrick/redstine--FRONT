/**
 * Menu do Painel de Gestao.
 *
 * Tres areas — Visao Geral, Comercial, Financeiro — porque e assim que o acesso
 * e recortado: um utilizador Comercial nao ve Financeiro, e um Financeiro nao
 * administra consultas. O menu abaixo e montado a partir das CAPACIDADES do
 * utilizador, nao do papel: esconder o item e cortesia, o bloqueio real esta na
 * API (que recusa mesmo com token valido de outro perfil).
 */
const TODOS = [
  {
    rotulo: "",
    capacidade: "commercial_read",
    itens: [{ label: "Visão Geral", href: "/gestao", icone: "overview", exato: true }],
  },
  {
    rotulo: "Comercial",
    capacidade: "commercial_read",
    itens: [
      {
        label: "Comercial",
        icone: "chart",
        filhos: [
          { label: "Consultas", href: "/gestao/comercial/consultas" },
          { label: "Ativos", href: "/gestao/comercial/ativos" },
          { label: "Vendas", href: "/gestao/comercial/vendas" },
        ],
      },
    ],
  },
  {
    rotulo: "Financeiro",
    capacidade: "financial_read",
    itens: [
      {
        label: "Financeiro",
        icone: "wallet",
        filhos: [
          { label: "Movimentações", href: "/gestao/financeiro/movimentacoes" },
          { label: "Repasses", href: "/gestao/financeiro/repasses" },
          { label: "Relatórios", href: "/gestao/financeiro/relatorios" },
        ],
      },
    ],
  },
  {
    rotulo: "Configurações",
    capacidade: "admin_read",
    itens: [
      { label: "Usuários", href: "/gestao/configuracoes/usuarios", icone: "users" },
      { label: "Permissões", href: "/gestao/configuracoes/permissoes", icone: "shield" },
      { label: "Configurações", href: "/gestao/configuracoes", icone: "settings", exato: true },
    ],
  },
];

export function gruposPara(capacidades = []) {
  return TODOS.filter((g) => !g.capacidade || capacidades.includes(g.capacidade));
}

export const atalhosDeConta = [
  { label: "Configurações", href: "/gestao/configuracoes", icone: "settings" },
  { label: "Área do Cliente", href: "/painel", icone: "user" },
];
