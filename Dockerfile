# ---------------------------------------------------------------------------
# Front RED — imagem de produção
#
# Três etapas. A separação existe porque cada uma muda por um motivo
# diferente: dependências mudam raramente, o código muda sempre, e a imagem
# final não precisa de nenhuma ferramenta de build.
# ---------------------------------------------------------------------------
FROM node:20-alpine AS deps

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci


# ---------------------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# O endereço da API entra no BUILD, não na execução.
#
# As telas do painel chamam a API do lado do cliente, e o Next embute as
# variáveis `NEXT_PUBLIC_*` no pacote JavaScript durante o build. Defini-la só
# no ambiente do contêiner não teria efeito no navegador — no EasyPanel, este
# valor vai em "Build arguments", não em "Environment".
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build


# ---------------------------------------------------------------------------
FROM node:20-alpine AS runner

RUN apk add --no-cache tini

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

WORKDIR /app

# `public` e `.next-build/static` não entram no standalone — o Next espera que
# sejam copiados à parte, e sem eles o site sobe sem imagens nem CSS.
COPY --from=builder /app/public ./public
COPY --from=builder --chown=node:node /app/.next-build/standalone ./
COPY --from=builder --chown=node:node /app/.next-build/static ./.next-build/static

USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "server.js"]
