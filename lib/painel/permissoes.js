/**
 * Perfis e capacidades do Painel de Gestao (documento oficial, secao 19).
 *
 * Controle por CAPACIDADE, nao por papel. A razao pratica: a lista de papeis
 * cresce (comercial, financeiro, curador...) e a pergunta que o backend precisa
 * responder e sempre a mesma — este utilizador pode ler/escrever dado
 * financeiro? Amarrar rota a papel obriga a editar codigo toda vez que o
 * organograma muda.
 *
 * E o mais importante: esta tabela e o espelho do que a API faz, nao a regra.
 * Esconder o menu e cortesia; o bloqueio real esta no backend, que recusa por
 * URL mesmo com token valido de outro perfil.
 */
export const CAPACIDADES = [
  { chave: "commercial_read", label: "Ler dados comerciais", area: "Comercial" },
  { chave: "commercial_write", label: "Editar dados comerciais", area: "Comercial" },
  { chave: "financial_read", label: "Ler dados financeiros", area: "Financeiro" },
  { chave: "financial_write", label: "Editar dados financeiros", area: "Financeiro" },
  { chave: "admin_read", label: "Ler configurações", area: "Administração" },
  { chave: "admin_write", label: "Editar configurações e usuários", area: "Administração" },
];

export const PERFIS = [
  {
    chave: "master",
    nome: "Master",
    descricao: "Acesso completo às três áreas.",
    capacidades: CAPACIDADES.map((c) => c.chave),
  },
  {
    chave: "comercial",
    nome: "Comercial",
    descricao:
      "Fornecedores, ativos, consultas e vendas. Não vê receita líquida da RED, repasses consolidados nem pagamentos.",
    capacidades: ["commercial_read", "commercial_write"],
  },
  {
    chave: "financeiro",
    nome: "Financeiro",
    descricao:
      "Vendas, cálculos, custos, repasses e pagamentos. Não administra consultas, anúncios nem publicação.",
    capacidades: ["financial_read", "financial_write"],
  },
];

export const usuarios = [
  { id: "u1", nome: "João Silva", email: "joao.silva@redestine.com.br", perfil: "master", ativo: true, ultimoAcesso: "2026-09-08T04:10:00" },
  { id: "u2", nome: "Maria Santos", email: "maria.santos@redestine.com.br", perfil: "comercial", ativo: true, ultimoAcesso: "2026-09-08T03:40:00" },
  { id: "u3", nome: "Carlos Oliveira", email: "carlos.oliveira@redestine.com.br", perfil: "comercial", ativo: true, ultimoAcesso: "2026-09-07T18:20:00" },
  { id: "u4", nome: "Fernanda Lima", email: "fernanda.lima@redestine.com.br", perfil: "financeiro", ativo: true, ultimoAcesso: "2026-09-07T16:05:00" },
  { id: "u5", nome: "Ricardo Alves", email: "ricardo.alves@redestine.com.br", perfil: "financeiro", ativo: false, ultimoAcesso: "2026-07-30T11:00:00" },
];

export function perfilPorChave(chave) {
  return PERFIS.find((p) => p.chave === chave);
}
