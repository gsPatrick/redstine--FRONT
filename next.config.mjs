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

  images: { unoptimized: false },
};

export default nextConfig;
