/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * Diretórios separados por ambiente.
   *
   * `next build` e `next dev` disputavam o mesmo `.next` e o build matava o
   * servidor de desenvolvimento no meio de uma sessão. Separar resolve.
   */
  distDir: process.env.NODE_ENV === "production" ? ".next-build" : ".next",

  /**
   * Saída standalone para o contêiner.
   *
   * O Next monta em `.next-build/standalone` um servidor com apenas as
   * dependências que o código de fato usa. A imagem final cai de ~1 GB para
   * ~200 MB e não precisa carregar o `node_modules` inteiro.
   */
  output: "standalone",

  /**
   * Hosts de onde as imagens podem vir.
   *
   * `next/image` recusa qualquer host nao declarado e responde 500 — nao um
   * espaco vazio, a PAGINA INTEIRA quebra. Enquanto o catalogo so tinha
   * imagens locais (`/images/...`) isso nunca apareceu; passa a aparecer no
   * momento em que um ativo publicado tem foto enviada pelo painel, porque
   * essas ficam no dominio da API.
   *
   * O host de producao esta aqui pelo mesmo motivo que esta no env da API:
   * esquecer de o declarar nao daria erro no build, so na primeira pagina de
   * produto com foto.
   */
  images: {
    unoptimized: false,
    remotePatterns: [
      { protocol: "https", hostname: "redstine-redstine--api.9jczjy.easypanel.host" },
      { protocol: "http", hostname: "localhost" },
      // Permite apontar para outra API sem mexer no codigo.
      ...(process.env.NEXT_PUBLIC_API_URL
        ? [
            {
              protocol: new URL(process.env.NEXT_PUBLIC_API_URL).protocol.replace(":", ""),
              hostname: new URL(process.env.NEXT_PUBLIC_API_URL).hostname,
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;
