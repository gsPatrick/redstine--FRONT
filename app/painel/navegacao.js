/**
 * Estrutura de menu da Area do Cliente — exatamente a do documento.
 *
 * Notificacoes nao aparecem aqui de proposito: o sino e transversal, fica no
 * cabecalho, e nao um item no mesmo nivel de Comprar e Vender.
 */
export const grupos = [
  {
    rotulo: "",
    itens: [{ label: "Visão Geral", href: "/painel", icone: "overview", exato: true }],
  },
  {
    rotulo: "Comprar",
    itens: [
      { label: "Minhas Compras", href: "/painel/compras", icone: "cart" },
      { label: "Minhas Consultas", href: "/painel/consultas", icone: "chat" },
      { label: "Favoritos", href: "/painel/favoritos", icone: "heart" },
    ],
  },
  {
    rotulo: "Vender",
    itens: [
      { label: "Dashboard", href: "/painel/vender", icone: "chart", exato: true },
      { label: "Meus Ativos", href: "/painel/vender/ativos", icone: "box" },
      { label: "Vendas", href: "/painel/vender/vendas", icone: "tag" },
      { label: "Financeiro", href: "/painel/vender/financeiro", icone: "wallet" },
      { label: "Enviar Ativos", href: "/painel/vender/enviar", icone: "upload" },
    ],
  },
  {
    rotulo: "Minha Conta",
    itens: [
      { label: "Dados Cadastrais", href: "/painel/conta", icone: "user", exato: true },
      { label: "Empresa", href: "/painel/conta/empresa", icone: "building" },
      { label: "Endereços", href: "/painel/conta/enderecos", icone: "pin" },
      { label: "Segurança", href: "/painel/conta/seguranca", icone: "lock" },
    ],
  },
];

export const atalhosDeConta = [
  { label: "Dados cadastrais", href: "/painel/conta", icone: "user" },
  { label: "Segurança", href: "/painel/conta/seguranca", icone: "lock" },
];
