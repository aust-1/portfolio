#!/usr/bin/env bash
# Exécuté sur le VPS (à la main, ou par .github/workflows/deploy.yml après une CI verte et chaque
# nuit). Récupère la dernière version de main, reconstruit l'image (ce qui rafraîchit aussi les
# stats GitHub) et redémarre le site.
#
# Ce dépôt est un sous-module du dépôt opt (apps/portfolio) : ce script avance SON propre HEAD
# (légitime, c'est son dépôt), puis, si présent, aligne le pointeur enregistré par le dépôt opt sur
# le commit réellement déployé (scripts/app-bump.sh), sans quoi `git status` à la racine de /opt
# afficherait ce sous-module comme modifié en permanence.
set -euo pipefail

cd "$(dirname "$0")/.."

git fetch --quiet origin main
git reset --hard origin/main

docker compose build --pull
docker compose up -d --remove-orphans
docker image prune -f >/dev/null

# Le site doit répondre avant de déclarer le déploiement réussi
ok=0
for i in $(seq 1 30); do
  if docker compose exec -T portfolio wget -qO- http://127.0.0.1:8080/ >/dev/null 2>&1; then
    ok=1
    break
  fi
  sleep 2
done

if [[ "$ok" != "1" ]]; then
  echo "Le site ne répond pas après le déploiement" >&2
  docker compose logs --tail=50 portfolio >&2
  exit 1
fi

echo "Déploiement OK ($(git rev-parse --short HEAD))"

REPO_ROOT="$PWD"

# Le Caddyfile de l'app a pu changer avec le code déployé : on republie les routes du proxy
# partagé (dépôt opt), comme le fait scripts/app-deploy.sh.
ROUTES_SYNC="$REPO_ROOT/../../scripts/routes-sync.sh"
if [[ -x "$ROUTES_SYNC" ]]; then
  "$ROUTES_SYNC" || echo "routes-sync.sh : routes non republiées (à faire à la main)" >&2
fi
OPT_BUMP="$REPO_ROOT/../../scripts/app-bump.sh"
if [[ -x "$OPT_BUMP" ]]; then
  "$OPT_BUMP" --to "$(git rev-parse HEAD)" --commit "$(basename "$REPO_ROOT")" \
    || echo "app-bump.sh : pointeur non aligné dans le dépôt opt (à faire à la main)" >&2
fi
