/**
 * Endereço da API.
 *
 * ÚNICO ponto do projeto que define para onde o front fala.
 *
 * `NEXT_PUBLIC_API_URL` tem prioridade, para o mesmo código servir a
 * ambientes diferentes sem editar arquivo. Sem ela, o endereço é escolhido
 * pelo ambiente: produção usa o domínio da API, desenvolvimento usa o
 * localhost.
 *
 * Escolher pelo ambiente, em vez de um valor fixo único, evita o acidente
 * clássico: subir para produção com o endereço de desenvolvimento e o painel
 * tentar falar com o localhost da máquina do visitante.
 *
 * `NEXT_PUBLIC_` é obrigatório no prefixo — sem ele o Next não expõe a
 * variável ao navegador, e as telas do painel, que chamam a API do lado do
 * cliente, ficariam sem endereço.
 */
const PRODUCAO = "https://redstine-redstine--api.9jczjy.easypanel.host/api/v1";
const LOCAL = "http://localhost:4000/api/v1";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "production" ? PRODUCAO : LOCAL);
