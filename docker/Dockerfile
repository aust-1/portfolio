# syntax=docker/dockerfile:1.6

############################
# Build stage
############################
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN \
    if [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable && pnpm i --frozen-lockfile; \
    elif [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    else npm i; fi

COPY . .
RUN npm run build

############################
# Serve stage (nginx)
############################
FROM nginx:alpine AS serve
COPY --from=build /app/dist /usr/share/nginx/html

# SPA fallback (important pour Vite + router côté client)
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
