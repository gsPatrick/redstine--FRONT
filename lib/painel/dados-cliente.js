/**
 * Dados da Area do Cliente.
 *
 * Camada unica de leitura: as telas nunca montam numero na mao. Quando a API
 * entrar, muda-se este ficheiro (as funcoes viram fetch) e nenhuma pagina e
 * tocada — as formas devolvidas aqui sao exatamente as que a API ja produz em
 * /api/v1/me e /api/v1/management.
 *
 * O percentual do fornecedor vive no ATIVO, nunca na modalidade: se o RED
 * Catalogo passar de 65% para 60% amanha, uma venda antiga nao pode mudar de
 * valor. Por isso cada venda carrega o proprio `participacao`.
 */

export const usuario = {
  nome: "João Silva",
  primeiroNome: "João",
  papel: "Fornecedor",
  email: "joao.silva@empresa.com.br",
  telefone: "(21) 98886-7777",
  cpf: "123.456.789-00",
  empresa: {
    razaoSocial: "Construtora Silva & Filhos Ltda",
    nomeFantasia: "Silva Construções",
    cnpj: "12.345.678/0001-90",
    cargo: "Diretor de Suprimentos",
    email: "contato@silvaconstrucoes.com.br",
  },
};

export const notificacoes = [
  {
    id: "n1",
    categoria: "compra",
    tom: "info",
    titulo: "Compra #1045 disponível para retirada.",
    data: "2026-08-18T10:30:00",
    link: "/painel/compras/1045",
    lida: false,
  },
  {
    id: "n2",
    categoria: "consulta",
    tom: "ok",
    titulo: "Sua consulta sobre Lote de Tubos PVC foi respondida.",
    data: "2026-08-15T14:20:00",
    link: "/painel/consultas/c1",
    lida: false,
  },
  {
    id: "n3",
    categoria: "ativo",
    tom: "ok",
    titulo: "Ativo Lote de Tubos PVC Tigre foi publicado.",
    data: "2026-08-14T09:15:00",
    link: "/painel/vender/ativos",
    lida: false,
  },
  {
    id: "n4",
    categoria: "financeiro",
    tom: "ok",
    titulo: "Pagamento de R$ 7.800,00 realizado.",
    data: "2026-08-12T16:40:00",
    link: "/painel/vender/financeiro",
    lida: true,
  },
];

/** Bloco COMPRAR da Visao Geral. Tres indicadores, nada mais. */
export const resumoComprar = {
  compras: 4,
  consultas: 2,
  favoritos: 8,
};

/**
 * Bloco VENDER da Visao Geral. Quatro indicadores.
 * "Recebido" fica de fora de proposito: a Visao Geral resume, quem detalha
 * dinheiro e a pagina Financeiro.
 */
export const resumoVender = {
  ativosPublicados: 12,
  ativosVendidos: 5,
  receitaPotencial: 48600,
  aReceber: 7800,
  recebido: 13600,
  vendasRealizadas: 21400,
};

export const atividades = [
  {
    titulo: "Compra #1045 disponível para retirada",
    data: "2026-08-18T10:30:00",
    href: "/painel/compras/1045",
  },
  {
    titulo: "Sua consulta sobre Lote de Tubos PVC foi respondida",
    data: "2026-08-15T14:20:00",
    href: "/painel/consultas/c1",
  },
  {
    titulo: "Ativo Lote de Tubos PVC Tigre foi publicado",
    data: "2026-08-14T09:15:00",
    href: "/painel/vender/ativos",
  },
];

export const compras = [
  {
    id: "1045",
    pedido: "#1045",
    data: "2026-08-14T10:25:00",
    produto: "Lote de Tubos PVC Tigre",
    imagem: "/images/2026/07/DIFUSOR-LINEAR-142x12-fundo-galpao-01--300x300.png",
    quantidade: 100,
    valor: 12000,
    status: "Aguardando retirada",
    formaPagamento: "Transferência bancária",
    retirada: {
      local: "Obra Barra da Tijuca",
      endereco: "Av. das Américas, 15.000 — Barra da Tijuca, Rio de Janeiro / RJ, 22793-081",
      responsavel: "Carlos Henrique",
      contato: "(21) 99999-8888",
      agendamento: null,
      instrucoes: "Apresentar documento com foto. Horário comercial.",
    },
    historico: [
      { data: "2026-08-14T10:25:00", titulo: "Compra confirmada" },
      { data: "2026-08-15T09:00:00", titulo: "Retirada liberada" },
      { titulo: "Retirada agendada", futuro: true },
      { titulo: "Retirada realizada", futuro: true },
    ],
  },
  {
    id: "1040",
    pedido: "#1040",
    data: "2026-08-10T15:10:00",
    produto: "Conexões PVC Tigre",
    imagem: "/images/2026/07/Difusor-plenum-linear-fundo-galpao-01--300x300.png",
    quantidade: 150,
    valor: 8250,
    status: "Retirada agendada",
    formaPagamento: "PIX",
    retirada: {
      local: "Estoque RED — Belo Horizonte",
      endereco: "Rua Sapucaí, 320 — Floresta, Belo Horizonte / MG",
      responsavel: "Equipe RED",
      contato: "(31) 3333-2222",
      agendamento: "2026-08-20T14:00:00",
      instrucoes: "Retirada com veículo próprio.",
    },
    historico: [
      { data: "2026-08-10T15:10:00", titulo: "Compra confirmada" },
      { data: "2026-08-11T11:00:00", titulo: "Retirada liberada" },
      { data: "2026-08-13T09:40:00", titulo: "Retirada agendada", detalhe: "20/08/2026 às 14:00" },
      { titulo: "Retirada realizada", futuro: true },
    ],
  },
  {
    id: "1035",
    pedido: "#1035",
    data: "2026-08-05T09:00:00",
    produto: "Registros PVC",
    imagem: "/images/2026/07/Cooler-axial-fundo-galpao-01--300x300.png",
    quantidade: 80,
    valor: 2400,
    status: "Retirado",
    formaPagamento: "Boleto",
    retirada: {
      local: "Estoque RED — Salvador",
      endereco: "Av. Luís Viana, 1.200 — Salvador / BA",
      responsavel: "Equipe RED",
      contato: "(71) 3222-1111",
      agendamento: "2026-08-08T10:00:00",
      instrucoes: "—",
    },
    historico: [
      { data: "2026-08-05T09:00:00", titulo: "Compra confirmada" },
      { data: "2026-08-06T10:00:00", titulo: "Retirada liberada" },
      { data: "2026-08-07T14:00:00", titulo: "Retirada agendada" },
      { data: "2026-08-08T10:20:00", titulo: "Produto retirado" },
    ],
  },
  {
    id: "1020",
    pedido: "#1020",
    data: "2026-07-28T11:30:00",
    produto: "Luva Soldável 25mm",
    imagem: "/images/2026/07/Catraca-fundo-galpao-01-300x300.png",
    quantidade: 200,
    valor: 1600,
    status: "Concluído",
    formaPagamento: "PIX",
    retirada: {
      local: "Estoque RED — Curitiba",
      endereco: "Rua João Negrão, 800 — Curitiba / PR",
      responsavel: "Equipe RED",
      contato: "(41) 3111-0000",
      agendamento: "2026-07-30T09:00:00",
      instrucoes: "—",
    },
    historico: [
      { data: "2026-07-28T11:30:00", titulo: "Compra confirmada" },
      { data: "2026-07-29T08:00:00", titulo: "Retirada liberada" },
      { data: "2026-07-30T09:15:00", titulo: "Produto retirado" },
      { data: "2026-07-30T09:20:00", titulo: "Operação concluída" },
    ],
  },
  {
    id: "1018",
    pedido: "#1018",
    data: "2026-07-22T16:00:00",
    produto: "Joelho 90° 25mm",
    imagem: "/images/2026/07/Cavadeira-fundo-branco--300x300.png",
    quantidade: 120,
    valor: 1200,
    status: "Cancelado",
    formaPagamento: "Boleto",
    retirada: null,
    historico: [
      { data: "2026-07-22T16:00:00", titulo: "Compra registrada" },
      { data: "2026-07-24T10:00:00", titulo: "Compra cancelada", detalhe: "Boleto não compensado." },
    ],
  },
];

export const consultas = [
  {
    id: "c1",
    data: "2026-08-14T09:30:00",
    produto: "Lote de Tubos PVC Tigre",
    imagem: "/images/2026/07/DIFUSOR-LINEAR-142x12-fundo-galpao-01--300x300.png",
    quantidade: 100,
    status: "Respondida",
    atualizacao: "2026-08-15T14:20:00",
    mensagem: "Preciso confirmar disponibilidade para retirada em duas etapas.",
    resposta:
      "Disponibilidade confirmada. A retirada pode ser feita em duas etapas, sem custo adicional, desde que dentro de 15 dias.",
    podeComprar: true,
  },
  {
    id: "c2",
    data: "2026-08-12T11:00:00",
    produto: "Conexões PVC Tigre",
    imagem: "/images/2026/07/Difusor-plenum-linear-fundo-galpao-01--300x300.png",
    quantidade: 200,
    status: "Em atendimento",
    atualizacao: "2026-08-14T11:05:00",
    mensagem: "Vocês conseguem volume maior que o anunciado?",
    resposta: null,
    podeComprar: false,
  },
  {
    id: "c3",
    data: "2026-08-08T16:00:00",
    produto: "Registros PVC",
    imagem: "/images/2026/07/Cooler-axial-fundo-galpao-01--300x300.png",
    quantidade: 80,
    status: "Recebida",
    atualizacao: "2026-08-08T16:30:00",
    mensagem: "Qual a condição das peças?",
    resposta: null,
    podeComprar: false,
  },
  {
    id: "c4",
    data: "2026-08-01T10:00:00",
    produto: "Joelho 90° 25mm",
    imagem: "/images/2026/07/Cavadeira-fundo-branco--300x300.png",
    quantidade: 120,
    status: "Encerrada",
    atualizacao: "2026-08-03T10:15:00",
    mensagem: "Entrega em Niterói é possível?",
    resposta: "Não trabalhamos com entrega nesta operação. Retirada no local.",
    podeComprar: false,
  },
];

export const favoritos = [
  {
    id: "f1",
    nome: "Lote de Tubos PVC Tigre",
    imagem: "/images/2026/07/DIFUSOR-LINEAR-142x12-fundo-galpao-01--300x300.png",
    categoria: "Construção",
    local: "Rio de Janeiro — RJ",
    preco: 12000,
    modalidade: "compra",
    disponivel: true,
  },
  {
    id: "f2",
    nome: "Conexões PVC Tigre",
    imagem: "/images/2026/07/Difusor-plenum-linear-fundo-galpao-01--300x300.png",
    categoria: "Construção",
    local: "Belo Horizonte — MG",
    preco: 8250,
    modalidade: "consulta",
    disponivel: true,
  },
  {
    id: "f3",
    nome: "Registros PVC",
    imagem: "/images/2026/07/Cooler-axial-fundo-galpao-01--300x300.png",
    categoria: "Construção",
    local: "Salvador — BA",
    preco: 2400,
    modalidade: "compra",
    disponivel: true,
  },
  {
    id: "f4",
    nome: "Luva Soldável 25mm",
    imagem: "/images/2026/07/Catraca-fundo-galpao-01-300x300.png",
    categoria: "Construção",
    local: "Curitiba — PR",
    preco: 1600,
    modalidade: "compra",
    disponivel: false,
  },
];

export const meusAtivos = [
  {
    id: "a1",
    nome: "Lote de Tubos PVC Tigre",
    imagem: "/images/2026/07/DIFUSOR-LINEAR-142x12-fundo-galpao-01--300x300.png",
    codigo: "RED-0451",
    categoria: "Construção",
    subcategoria: "Tubos PVC",
    local: "Rio de Janeiro — RJ",
    modelo: "RED Catálogo",
    preco: 12000,
    participacao: 65,
    quantidadeOriginal: 1000,
    quantidadeDisponivel: 900,
    condicao: "Novo — sobra de obra",
    status: "Publicado",
    publicadoEm: "2026-08-14T09:15:00",
    atualizadoEm: "2026-08-15T10:00:00",
  },
  {
    id: "a2",
    nome: "Conexões PVC Tigre",
    imagem: "/images/2026/07/Difusor-plenum-linear-fundo-galpao-01--300x300.png",
    codigo: "RED-0448",
    categoria: "Construção",
    subcategoria: "Conexões",
    local: "Belo Horizonte — MG",
    modelo: "RED Catálogo",
    preco: 8250,
    participacao: 65,
    quantidadeOriginal: 400,
    quantidadeDisponivel: 400,
    condicao: "Novo",
    status: "Publicado",
    publicadoEm: "2026-08-02T14:00:00",
    atualizadoEm: "2026-08-02T14:00:00",
  },
  {
    id: "a3",
    nome: "Registros PVC",
    imagem: "/images/2026/07/Cooler-axial-fundo-galpao-01--300x300.png",
    codigo: "RED-0440",
    categoria: "Construção",
    subcategoria: "Registros",
    local: "Salvador — BA",
    modelo: "RED Catálogo",
    preco: 2400,
    participacao: 65,
    quantidadeOriginal: 300,
    quantidadeDisponivel: 300,
    condicao: "Usado — bom estado",
    status: "Em avaliação",
    publicadoEm: null,
    atualizadoEm: "2026-08-09T11:00:00",
  },
  {
    id: "a4",
    nome: "Luva Soldável 25mm",
    imagem: "/images/2026/07/Catraca-fundo-galpao-01-300x300.png",
    codigo: "RED-0432",
    categoria: "Construção",
    subcategoria: "Conexões",
    local: "Curitiba — PR",
    modelo: "RED Catálogo",
    preco: 1600,
    participacao: 65,
    quantidadeOriginal: 500,
    quantidadeDisponivel: 0,
    condicao: "Novo",
    status: "Inativo",
    publicadoEm: "2026-07-10T10:00:00",
    atualizadoEm: "2026-07-31T18:00:00",
  },
];

/**
 * Vendas do fornecedor.
 *
 * `participacao` e `valorFornecedor` sao snapshot da transacao, nao calculo ao
 * vivo — o documento e explicito na secao 8: alteracao futura de percentual nao
 * pode recalcular venda ja realizada.
 */
export const vendas = [
  {
    id: "V032",
    venda: "#V032",
    data: "2026-08-14T10:25:00",
    ativo: "Lote de Tubos PVC Tigre",
    quantidade: 100,
    valorVenda: 12000,
    participacao: 65,
    valorFornecedor: 7800,
    modelo: "RED Catálogo",
    statusRetirada: "Aguardando retirada",
    status: "A receber",
  },
  {
    id: "V028",
    venda: "#V028",
    data: "2026-08-02T09:00:00",
    ativo: "Conexões PVC Tigre",
    quantidade: 50,
    valorVenda: 2750,
    participacao: 65,
    valorFornecedor: 1787.5,
    modelo: "RED Catálogo",
    statusRetirada: "Retirado",
    status: "Pago",
  },
  {
    id: "V021",
    venda: "#V021",
    data: "2026-08-02T14:30:00",
    ativo: "Registros PVC",
    quantidade: 40,
    valorVenda: 1200,
    participacao: 65,
    valorFornecedor: 780,
    modelo: "RED Catálogo",
    statusRetirada: "Retirado",
    status: "Pago",
  },
  {
    id: "V015",
    venda: "#V015",
    data: "2026-07-26T11:00:00",
    ativo: "Luva Soldável 25mm",
    quantidade: 50,
    valorVenda: 6000,
    participacao: 65,
    valorFornecedor: 3900,
    modelo: "RED Catálogo",
    statusRetirada: "Retirado",
    status: "Pagamento programado",
  },
  {
    id: "V010",
    venda: "#V010",
    data: "2026-07-18T15:00:00",
    ativo: "Conexões PVC Tigre",
    quantidade: 100,
    valorVenda: 5900,
    participacao: 65,
    valorFornecedor: 3835,
    modelo: "RED Catálogo",
    statusRetirada: "Retirado",
    status: "Pago",
  },
];

/** Pagamentos ja liquidados — a aba "Histórico de pagamentos". */
export const pagamentos = [
  {
    id: "p1",
    data: "2026-08-12T16:40:00",
    venda: "#V028",
    ativo: "Conexões PVC Tigre",
    valor: 1787.5,
    meio: "PIX",
    comprovante: "PIX-8842197",
  },
  {
    id: "p2",
    data: "2026-08-05T10:15:00",
    venda: "#V021",
    ativo: "Registros PVC",
    valor: 780,
    meio: "Transferência bancária",
    comprovante: "TED-551023",
  },
  {
    id: "p3",
    data: "2026-07-22T09:30:00",
    venda: "#V010",
    ativo: "Conexões PVC Tigre",
    valor: 3835,
    meio: "PIX",
    comprovante: "PIX-7710884",
  },
];

/** Grafico 1 do dashboard de vendas: realizado x recebido, por periodo. */
export const resultadosFinanceiros = [
  { rotulo: "22/07", realizado: 3835, recebido: 3835 },
  { rotulo: "29/07", realizado: 3900, recebido: 0 },
  { rotulo: "05/08", realizado: 780, recebido: 780 },
  { rotulo: "12/08", realizado: 1787.5, recebido: 1787.5 },
  { rotulo: "18/08", realizado: 7800, recebido: 0 },
];

/** Grafico 2: distribuicao do portfolio por status. */
export const ativosPorStatus = [
  { rotulo: "Publicados", valor: 12, cor: "#1a8a4a" },
  { rotulo: "Vendidos", valor: 5, cor: "#0b5fb0" },
  { rotulo: "Em avaliação", valor: 1, cor: "#e0a11b" },
  { rotulo: "Inativos", valor: 2, cor: "#9aa2ae" },
];

export function compraPorId(id) {
  return compras.find((c) => c.id === String(id)) || null;
}

export function consultaPorId(id) {
  return consultas.find((c) => c.id === String(id)) || null;
}

export function ativoPorId(id) {
  return meusAtivos.find((a) => a.id === String(id)) || null;
}

export function vendaPorId(id) {
  return vendas.find((v) => v.id === String(id)) || null;
}
