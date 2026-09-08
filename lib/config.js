/**
 * Endereço da API.
 *
 * ÚNICO ponto do projeto que define para onde o front fala. Trocar por
 * produção é mudar a linha abaixo — nada mais.
 *
 * A variável de ambiente tem prioridade, para o mesmo build servir a
 * ambientes diferentes sem recompilar. Quando não existe, vale o valor
 * fixo: em desenvolvimento, o localhost; em produção, o domínio da API.
 *
 * `NEXT_PUBLIC_` é obrigatório no prefixo — sem ele o Next não expõe a
 * variável ao navegador, e as telas do painel, que chamam a API do lado do
 * cliente, ficariam sem endereço.
 */
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
