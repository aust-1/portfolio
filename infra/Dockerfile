# Étape 1 : prérendu du site (SvelteKit + adapter-static).
FROM node:22-alpine AS build
WORKDIR /app
RUN corepack enable

COPY package.json pnpm-lock.yaml .npmrc ./
RUN pnpm install --frozen-lockfile --ignore-scripts

COPY . .

# Flags du CTF du site : passés au build par docker compose depuis le .env, jamais versionnés.
# Le build échoue si une valeur ne correspond pas à son empreinte (src/lib/flags/hashes.ts).
ARG FLAG_1
ARG FLAG_2
ARG FLAG_3
ARG FLAG_4
ARG FLAG_5
# (les ARG sont visibles comme variables d'environnement pendant les RUN qui suivent)
RUN pnpm exec svelte-kit sync && pnpm build

# Étape 2 : Caddy sert les fichiers statiques, sans privilèges, sur un port non privilégié.
FROM caddy:2-alpine AS serve
# Le binaire officiel porte cap_net_bind_service (pour écouter sur 80/443) : inutile sur 8080, et
# incompatible avec cap_drop: ALL + no-new-privileges (exec refusé). On retire la capability.
RUN apk add --no-cache libcap && setcap -r /usr/bin/caddy && apk del libcap \
  && addgroup -S site && adduser -S -G site site
COPY infra/Caddyfile.site /etc/caddy/Caddyfile
COPY --from=build --chown=site:site /app/build /srv
ENV XDG_CONFIG_HOME=/tmp/caddy-config XDG_DATA_HOME=/tmp/caddy-data
USER site
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --retries=3 --start-period=5s \
  CMD wget -qO- http://127.0.0.1:8080/ >/dev/null || exit 1
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
