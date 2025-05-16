FROM node:22-slim AS builder
LABEL com.centurylinklabs.watchtower.enable="true"

WORKDIR /app

# Habilitar Corepack y usar PNPM
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copiar archivos de configuración y lock primero
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias
RUN pnpm install

# Copiar el resto de los archivos
COPY . .

# Variables de entorno
ARG NEXT_PUBLIC_BACKEND_URI
ENV NEXT_PUBLIC_BACKEND_URI=https://api.wally.aichallenge.fun

# Build del frontend
RUN pnpm build

# ---------- Runner ----------
FROM node:22-slim

WORKDIR /app

# Instalar utilidades necesarias
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Habilitar Corepack y PNPM
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copiar lo necesario desde el builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.js ./next.config.js

EXPOSE 3001

CMD ["pnpm", "start", "--port", "3001"]