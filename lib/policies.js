export const policies = {
  "termos-de-uso": {
    title: "Termos de Uso",
    blocks: [
      {
        heading: "Apresentação",
        items: ["Breve apresentação da RED e finalidade da plataforma."],
      },
      {
        heading: "Aceitação dos Termos",
        items: ["Ao utilizar o site, o usuário declara estar de acordo com estes termos."],
      },
      {
        heading: "Cadastro de usuários",
        items: ["Regras para criação de conta.", "Responsabilidade pelas informações."],
      },
      {
        heading: "Papel da RED",
        lead: "Explicar claramente:",
        items: [
          "A RED não é fabricante dos produtos.",
          "A RED atua como organizadora e intermediadora da operação comercial.",
        ],
      },
      {
        heading: "Responsabilidade dos fornecedores",
        items: [
          "Informações verdadeiras.",
          "Origem lícita.",
          "Condição dos ativos.",
          "Documentação quando necessária.",
        ],
      },
      {
        heading: "Responsabilidade dos compradores",
        items: [
          "Verificar informações.",
          "Solicitar esclarecimentos.",
          "Respeitar condições comerciais.",
        ],
      },
      { heading: "Propriedade intelectual", items: ["Marca.", "Imagens.", "Conteúdo."] },
      {
        heading: "Alterações",
        items: ["A RED poderá atualizar os termos quando necessário."],
      },
    ],
  },

  "politica-de-privacidade": {
    title: "Política de Privacidade",
    blocks: [
      {
        heading: "Dados coletados",
        items: [
          "Nome.",
          "Telefone.",
          "E-mail.",
          "Empresa.",
          "Informações enviadas em formulários.",
        ],
      },
      {
        heading: "Finalidade",
        items: ["Atendimento.", "Negociação.", "Comunicação.", "Melhoria da plataforma."],
      },
      {
        heading: "Compartilhamento",
        items: [
          "A RED não comercializa dados.",
          "Os dados poderão ser compartilhados apenas quando necessário para execução das operações.",
        ],
      },
      { heading: "Segurança", items: ["Medidas adotadas para proteger informações."] },
      {
        heading: "Direitos do usuário",
        items: ["Solicitar atualização.", "Correção.", "Exclusão.", "Contato."],
      },
    ],
  },

  "politica-de-venda": {
    title: "Política de Venda",
    blocks: [
      {
        heading: "Disponibilidade",
        items: ["Todos os ativos estão sujeitos à disponibilidade."],
      },
      {
        heading: "Informações dos produtos",
        items: [
          "As informações publicadas são organizadas pela RED com base nos dados disponíveis no momento da publicação.",
        ],
      },
      {
        heading: "Demonstração de interesse",
        items: ["O envio de interesse não caracteriza reserva automática."],
      },
      {
        heading: "Negociação",
        items: ["Cada operação poderá possuir condições específicas."],
      },
      { heading: "Pagamentos", items: ["Condições definidas durante a negociação."] },
      { heading: "Retirada", items: ["Responsabilidades.", "Prazos.", "Logística."] },
      { heading: "Cancelamentos", items: ["Condições."] },
      { heading: "Observações", items: ["Cada operação pode possuir regras específicas."] },
    ],
  },

  "politica-de-curadoria": {
    title: "Política de Curadoria",
    subtitle: "A qualidade do catálogo começa antes da publicação.",
    blocks: [
      {
        heading: "O papel da Curadoria",
        items: ["A RED avalia cada ativo antes de disponibilizá-lo para comercialização."],
      },
      {
        heading: "Critérios analisados",
        items: [
          "Condição.",
          "Potencial comercial.",
          "Categoria.",
          "Documentação.",
          "Logística.",
          "Demanda.",
        ],
      },
      {
        heading: "O que normalmente não aceitamos",
        items: [
          "Materiais sem identificação.",
          "Itens sem potencial comercial.",
          "Produtos incompatíveis com a proposta da plataforma.",
          "Materiais com restrições legais.",
        ],
      },
      {
        heading: "O que buscamos",
        items: [
          "Informações organizadas.",
          "Fotos.",
          "Descrição adequada.",
          "Condições transparentes.",
        ],
      },
      {
        heading: "Resultado",
        items: ["Um catálogo mais confiável para compradores e fornecedores."],
      },
    ],
  },
};

export const policySlugs = Object.keys(policies);
