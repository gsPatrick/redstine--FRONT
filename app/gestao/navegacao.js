/**
 * Menu do Painel de Gestao.
 *
 * Quatro areas — Visao Geral, Comercial, Operacao, Financeiro — porque e assim
 * que o acesso e recortado: um utilizador Comercial nao ve Financeiro, um
 * Financeiro nao administra consultas, e um de Operacao ve inventario e fluxo
 * fisico mas nenhum valor de receita ou repasse. O menu abaixo e montado a
 * partir das CAPACIDADES do utilizador, nao do papel: esconder o item e
 * cortesia, o bloqueio real esta na API (que recusa mesmo com token valido de
 * outro perfil).
 *
 * A Visao Geral aparece para QUALQUER capacidade de gestao, nao so para a
 * comercial: ela e a leitura de saude global, e o que muda por perfil sao os
 * blocos que a API devolve la dentro — nao o direito de abrir a tela. Enquanto
 * a entrada exigia `commercial_read`, o perfil Financeiro entrava na gestao
 * sem ter primeira pagina nenhuma.
 */
const TODOS = [
  {
    rotulo: "",
    capacidades: ["commercial_read", "operation_read", "financial_read"],
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
          { label: "Envios", href: "/gestao/comercial/envios" },
          { label: "Consultas", href: "/gestao/comercial/consultas" },
          { label: "Ativos", href: "/gestao/comercial/ativos" },
          { label: "Pedidos", href: "/gestao/comercial/pedidos" },
          { label: "Vendas", href: "/gestao/comercial/vendas" },
        ],
      },
    ],
  },
  {
    rotulo: "Operação",
    capacidade: "operation_read",
    // Item raso, sem submenu: a area tem uma tela. Um acordeao para abrir um
    // unico filho e um clique a mais para chegar ao mesmo lugar.
    itens: [{ label: "Inventário", href: "/gestao/operacao", icone: "truck", exato: true }],
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
      { label: "Categorias", href: "/gestao/configuracoes/categorias", icone: "box" },
      { label: "Localizações", href: "/gestao/configuracoes/localizacoes", icone: "pin" },
      { label: "Usuários", href: "/gestao/configuracoes/usuarios", icone: "users" },
      { label: "Permissões", href: "/gestao/configuracoes/permissoes", icone: "shield" },
      { label: "Configurações", href: "/gestao/configuracoes", icone: "settings", exato: true },
    ],
  },
];

/**
 * `capacidade` exige aquela; `capacidades` aceita qualquer uma da lista.
 *
 * As duas formas existem porque as perguntas sao diferentes: a area de
 * Operacao pertence a uma capacidade so, e a Visao Geral pertence a todas.
 * Sem a segunda, ou a Visao Geral ficava presa ao comercial (como estava) ou
 * era preciso repetir o grupo tres vezes no menu.
 */
export function gruposPara(capacidades = []) {
  return TODOS.filter((g) => {
    if (g.capacidade) return capacidades.includes(g.capacidade);
    if (g.capacidades) return g.capacidades.some((c) => capacidades.includes(c));
    return true;
  });
}

export const atalhosDeConta = [
  { label: "Configurações", href: "/gestao/configuracoes", icone: "settings" },
  { label: "Área do Cliente", href: "/painel", icone: "user" },
];
