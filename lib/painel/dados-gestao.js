/**
 * Dados do Painel de Gestao.
 *
 * Mesma base da Area do Cliente — o documento e explicito: e o MESMO registo,
 * com permissoes e visoes diferentes. O fornecedor ve "sua participacao 65% =
 * R$ 7.800"; a gestao ve a mesma venda com fornecedor, receita RED e margem.
 */

export const gestor = {
  nome: "João Silva",
  primeiroNome: "João",
  papel: "Administrador",
  capacidades: ["commercial_read", "commercial_write", "financial_read", "financial_write"],
};

export const notificacoes = [
  {
    id: "g1",
    categoria: "consulta",
    tom: "info",
    titulo: "Nova consulta recebida para Lote de Tubos PVC Tigre",
    data: "2026-09-08T04:20:00",
    link: "/gestao/comercial/consultas",
    lida: false,
  },
  {
    id: "g2",
    categoria: "ativo",
    tom: "warn",
    titulo: "Ativo #AT045 enviado para avaliação",
    data: "2026-09-08T03:55:00",
    link: "/gestao/comercial/ativos",
    lida: false,
  },
  {
    id: "g3",
    categoria: "venda",
    tom: "ok",
    titulo: "Venda #V032 realizada",
    data: "2026-09-08T03:25:00",
    link: "/gestao/financeiro/movimentacoes/V032",
    lida: false,
  },
  {
    id: "g4",
    categoria: "financeiro",
    tom: "ok",
    titulo: "Pagamento de R$ 7.800 realizado a Empresa ABC",
    data: "2026-09-08T02:25:00",
    link: "/gestao/financeiro/repasses",
    lida: true,
  },
];

/**
 * Indicadores de ESTADO — fotografia do agora, imunes ao filtro de periodo.
 * "Ativos publicados nos ultimos 7 dias" nao e uma pergunta valida: o ativo
 * esta publicado hoje ou nao esta.
 */
export const estado = {
  fornecedoresAtivos: 38,
  ativosPublicados: 356,
  valorTotalPublicado: 1482000,
  valorARepassar: 124860,
};

/** Indicadores de FLUXO — movimento do intervalo, respondem ao filtro. */
export const fluxo = {
  vendasRealizadas: 312400,
  receitaRed: 93720,
  valorFornecedores: 218680,
};

/** Variacoes versus periodo anterior, em pontos percentuais. */
export const variacoes = {
  fornecedoresAtivos: 5,
  ativosPublicados: 18,
  valorTotalPublicado: 12,
  vendasRealizadas: 22,
  receitaRed: 19,
  valorARepassar: 8,
};

/** Pendencias: o que exige acao humana hoje. Cada uma leva a sua lista. */
export const pendencias = [
  {
    rotulo: "Consultas aguardando atendimento",
    valor: 8,
    icone: "chat",
    tone: "warn",
    href: "/gestao/comercial/consultas",
    hrefLabel: "Ver consultas",
  },
  {
    rotulo: "Ativos aguardando avaliação",
    valor: 15,
    icone: "box",
    tone: "warn",
    href: "/gestao/comercial/ativos",
    hrefLabel: "Ver ativos",
  },
  {
    rotulo: "Vendas aguardando retirada",
    valor: 6,
    icone: "truck",
    tone: "info",
    href: "/gestao/comercial/vendas",
    hrefLabel: "Ver vendas",
  },
  {
    rotulo: "Repasses pendentes",
    valor: 21,
    icone: "wallet",
    tone: "accent",
    href: "/gestao/financeiro/repasses",
    hrefLabel: "Ver repasses",
  },
];

export const evolucaoVendas = [
  { rotulo: "Mai", valor: 58000 },
  { rotulo: "Jun", valor: 71000 },
  { rotulo: "Jul", valor: 94000 },
  { rotulo: "Ago", valor: 118000 },
  { rotulo: "Set", valor: 131000 },
  { rotulo: "Out", valor: 176000 },
];

export const vendasPorCategoria = [
  { rotulo: "Construção", valor: 140600, cor: "#1a8a4a" },
  { rotulo: "Equipamentos", valor: 93700, cor: "#0b5fb0" },
  { rotulo: "Mobiliário", valor: 46800, cor: "#e0a11b" },
  { rotulo: "Outros", valor: 31300, cor: "#8b929c" },
];

export const resumoConsultas = {
  total: 128,
  novas: 8,
  emAtendimento: 12,
  respondidas: 86,
  encerradas: 22,
};

export const consultas = [
  { id: "q1", data: "2026-05-16T10:25:00", cliente: "Empresa Y Ltda", ativo: "Lote de Tubos PVC Tigre", quantidade: 100, status: "Nova", responsavel: "Maria Santos", atualizacao: "2026-05-16T10:25:00" },
  { id: "q2", data: "2026-05-16T09:40:00", cliente: "Construtora Alfa", ativo: "Conexões PVC Tigre", quantidade: 200, status: "Em atendimento", responsavel: "Carlos Oliveira", atualizacao: "2026-05-16T09:55:00" },
  { id: "q3", data: "2026-05-15T16:15:00", cliente: "Indústria Beta", ativo: "Registros PVC", quantidade: 80, status: "Respondida", responsavel: "Fernanda Lima", atualizacao: "2026-05-15T16:20:00" },
  { id: "q4", data: "2026-05-15T11:30:00", cliente: "Empresa Gama", ativo: "Luva Soldável 25mm", quantidade: 120, status: "Em atendimento", responsavel: "Maria Santos", atualizacao: "2026-05-15T14:10:00" },
  { id: "q5", data: "2026-05-14T15:05:00", cliente: "Comércio Delta", ativo: "Joelho 90° 25mm", quantidade: 150, status: "Respondida", responsavel: "Carlos Oliveira", atualizacao: "2026-05-15T09:20:00" },
  { id: "q6", data: "2026-05-14T09:20:00", cliente: "Empresa Ômega", ativo: "Tubo Soldável 20mm", quantidade: 300, status: "Encerrada", responsavel: "Fernanda Lima", atualizacao: "2026-05-14T10:45:00" },
  { id: "q7", data: "2026-05-13T14:50:00", cliente: "Shopping Center", ativo: "Adaptador PVC", quantidade: 50, status: "Em atendimento", responsavel: "Maria Santos", atualizacao: "2026-05-13T15:10:00" },
  { id: "q8", data: "2026-05-13T10:10:00", cliente: "Fábrica Sigma", ativo: "Tubo Esgoto 100mm", quantidade: 80, status: "Respondida", responsavel: "Carlos Oliveira", atualizacao: "2026-05-13T11:00:00" },
];

export const ativos = [
  { id: "AT045", nome: "Lote de Tubos PVC Tigre", fornecedor: "Empresa X Ltda", categoria: "Construção", local: "Rio de Janeiro — RJ", modelo: "RED Catálogo", participacao: 65, preco: 12000, status: "Publicado", publicadoEm: "2026-05-02T09:00:00" },
  { id: "AT044", nome: "Conexões PVC Tigre", fornecedor: "Construtora Alfa", categoria: "Construção", local: "Belo Horizonte — MG", modelo: "RED Estoque", participacao: 50, preco: 8250, status: "Publicado", publicadoEm: "2026-05-01T14:00:00" },
  { id: "AT043", nome: "Cadeiras corporativas", fornecedor: "Indústria Beta", categoria: "Mobiliário", local: "São Paulo — SP", modelo: "RED Estoque", participacao: 50, preco: 24000, status: "Aguardando aprovação", publicadoEm: null },
  { id: "AT042", nome: "Cooler axial industrial", fornecedor: "Empresa Gama", categoria: "Equipamentos", local: "Curitiba — PR", modelo: "RED Catálogo", participacao: 65, preco: 5900, status: "Em avaliação", publicadoEm: null },
  { id: "AT041", nome: "Registros PVC", fornecedor: "Comércio Delta", categoria: "Construção", local: "Salvador — BA", modelo: "RED Catálogo", participacao: 65, preco: 2400, status: "Vendido", publicadoEm: "2026-04-20T10:00:00" },
  { id: "AT040", nome: "Difusores lineares", fornecedor: "Empresa Ômega", categoria: "Equipamentos", local: "Recife — PE", modelo: "RED Estoque", participacao: 50, preco: 18400, status: "Publicado", publicadoEm: "2026-04-18T11:00:00" },
  { id: "AT039", nome: "Luva Soldável 25mm", fornecedor: "Empresa X Ltda", categoria: "Construção", local: "Curitiba — PR", modelo: "RED Catálogo", participacao: 65, preco: 1600, status: "Inativo", publicadoEm: "2026-03-10T10:00:00" },
  { id: "AT038", nome: "Estações de trabalho", fornecedor: "Shopping Center", categoria: "Mobiliário", local: "Rio de Janeiro — RJ", modelo: "RED Estoque", participacao: 50, preco: 32000, status: "Publicado", publicadoEm: "2026-03-02T09:30:00" },
];

/**
 * Movimentacoes financeiras.
 *
 * Cada linha carrega o percentual APLICADO naquela venda — nao o percentual
 * atual da modalidade. E o snapshot da secao 8, e e o que permite auditar uma
 * venda antiga depois de uma mudanca de tabela.
 */
export const movimentacoes = [
  { id: "V032", venda: "#V032", data: "2026-05-16T10:25:00", cliente: "Empresa Y Ltda", fornecedor: "Empresa X Ltda", ativo: "Lote de Tubos PVC Tigre", quantidade: 100, valorBruto: 12000, custos: 0, participacao: 65, repasse: 7800, receitaRed: 4200, status: "A repassar", statusRetirada: "Aguardando retirada", previsaoPagamento: "2026-05-25", pagamento: null, comprovante: null },
  { id: "V031", venda: "#V031", data: "2026-05-16T09:10:00", cliente: "Construtora Alfa", fornecedor: "Construtora Alfa", ativo: "Conexões PVC Tigre", quantidade: 150, valorBruto: 7250, custos: 0, participacao: 60, repasse: 4350, receitaRed: 2900, status: "Pagamento programado", statusRetirada: "Retirado", previsaoPagamento: "2026-05-20", pagamento: null, comprovante: null },
  { id: "V030", venda: "#V030", data: "2026-05-15T16:00:00", cliente: "Indústria Beta", fornecedor: "Indústria Beta", ativo: "Registros PVC", quantidade: 80, valorBruto: 5600, custos: 0, participacao: 65, repasse: 3640, receitaRed: 1960, status: "Pago", statusRetirada: "Retirado", previsaoPagamento: "2026-05-17", pagamento: "2026-05-17", comprovante: "PIX-9928114" },
  { id: "V029", venda: "#V029", data: "2026-05-15T11:20:00", cliente: "Empresa Gama", fornecedor: "Empresa Gama", ativo: "Luva Soldável 25mm", quantidade: 120, valorBruto: 8400, custos: 0, participacao: 65, repasse: 5460, receitaRed: 2940, status: "A repassar", statusRetirada: "Aguardando retirada", previsaoPagamento: "2026-05-24", pagamento: null, comprovante: null },
  { id: "V028", venda: "#V028", data: "2026-05-14T15:00:00", cliente: "Comércio Delta", fornecedor: "Comércio Delta", ativo: "Joelho 90° 25mm", quantidade: 150, valorBruto: 6800, custos: 0, participacao: 60, repasse: 4080, receitaRed: 2720, status: "Pago", statusRetirada: "Retirado", previsaoPagamento: "2026-05-16", pagamento: "2026-05-16", comprovante: "TED-441029" },
  { id: "V027", venda: "#V027", data: "2026-05-14T09:15:00", cliente: "Empresa Ômega", fornecedor: "Empresa Ômega", ativo: "Tubo Soldável 20mm", quantidade: 300, valorBruto: 9600, custos: 0, participacao: 65, repasse: 6240, receitaRed: 3360, status: "A repassar", statusRetirada: "Aguardando retirada", previsaoPagamento: "2026-05-23", pagamento: null, comprovante: null },
  { id: "V026", venda: "#V026", data: "2026-05-13T14:40:00", cliente: "Shopping Center", fornecedor: "Shopping Center", ativo: "Adaptador PVC", quantidade: 50, valorBruto: 3250, custos: 0, participacao: 60, repasse: 1950, receitaRed: 1300, status: "Pago", statusRetirada: "Retirado", previsaoPagamento: "2026-05-15", pagamento: "2026-05-15", comprovante: "PIX-8817420" },
  { id: "V025", venda: "#V025", data: "2026-05-13T10:00:00", cliente: "Fábrica Sigma", fornecedor: "Fábrica Sigma", ativo: "Tubo Esgoto 100mm", quantidade: 80, valorBruto: 4800, custos: 0, participacao: 60, repasse: 2880, receitaRed: 1920, status: "Pagamento programado", statusRetirada: "Retirado", previsaoPagamento: "2026-05-19", pagamento: null, comprovante: null },
];

/** Historico de uma venda — alimenta o detalhe financeiro. */
export const historicoDaVenda = {
  V032: [
    { data: "2026-05-16T10:25:00", titulo: "Venda realizada", detalhe: "Venda #V032 criada com sucesso." },
    { data: "2026-05-16T10:30:00", titulo: "Cálculo financeiro", detalhe: "Regras comerciais aplicadas. Valor do fornecedor: R$ 7.800,00 | Receita RED: R$ 4.200,00" },
    { data: "2026-05-16T10:32:00", titulo: "Aguardando retirada", detalhe: "Cliente notificado sobre disponibilidade para retirada." },
    { data: "2026-05-16T10:35:00", titulo: "Registro financeiro", detalhe: "Venda registrada no contas a receber." },
  ],
};

export function movimentacaoPorId(id) {
  const chave = String(id).replace(/^#/, "");
  return movimentacoes.find((m) => m.id === chave) || null;
}

/** Totais do periodo, somados a partir das proprias linhas — nunca digitados
 *  a mao, senao o rodape da tabela discorda do que esta acima dele. */
export function totaisFinanceiros(linhas = movimentacoes) {
  return linhas.reduce(
    (acc, m) => ({
      valorBruto: acc.valorBruto + m.valorBruto,
      repasse: acc.repasse + m.repasse,
      receitaRed: acc.receitaRed + m.receitaRed,
    }),
    { valorBruto: 0, repasse: 0, receitaRed: 0 }
  );
}
