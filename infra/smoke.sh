#!/usr/bin/env bash
# Vérifie les réponses du conteneur de production (Caddy + site prérendu), comme les verrait un
# visiteur : en-têtes de sécurité (pages, 404, redirections), cache, types, barre oblique finale.
# Usage : infra/smoke.sh http://localhost:8080
set -euo pipefail

BASE="${1:-http://localhost:8080}"
FAILS=0

fail() {
  echo "ÉCHEC : $*" >&2
  FAILS=$((FAILS + 1))
}
# Affiche « ok » pour une série de vérifications seulement si aucune n'a échoué depuis BEFORE.
BEFORE=0
ok() {
  [ "$FAILS" -eq "$BEFORE" ] && echo "ok : $*"
  BEFORE=$FAILS
}

# En-têtes d'une réponse, noms en minuscules, sans suivre les redirections.
headers() { curl -s -o /dev/null -D - --path-as-is "$BASE$1" | tr -d '\r' | sed 's/^\([^:]*\):/\L\1:/'; }
status() { curl -s -o /dev/null -w '%{http_code}' --path-as-is "$BASE$1"; }
header_value() { headers "$1" | sed -n "s/^$2: //p" | head -n1; }

SECURITY=(
  content-security-policy
  strict-transport-security
  x-content-type-options
  x-frame-options
  referrer-policy
  permissions-policy
  cross-origin-opener-policy
  cross-origin-resource-policy
  x-flag
)

check_security() {
  local path="$1" h
  h="$(headers "$path")"
  for name in "${SECURITY[@]}"; do
    grep -q "^$name: ." <<<"$h" || fail "$path : en-tête $name absent"
  done
  grep -q "frame-ancestors 'none'" <<<"$h" || fail "$path : CSP sans frame-ancestors 'none'"
  if grep -q '^server:' <<<"$h"; then fail "$path : en-tête Server présent"; fi
  ok "$path : en-têtes de sécurité"
}

# Pages existantes, page projet, erreur 404 et redirection : mêmes en-têtes partout.
for path in / /projets /projets/boggle /n-existe-pas /projets/; do
  check_security "$path"
done

# Pages : 200.
for path in / /projets /projets/boggle /a-propos /cv /parcours; do
  [ "$(status "$path")" = 200 ] || fail "$path ne répond pas 200"
done
ok 'pages : 200'

# 404 : statut, page prérendue lisible sans JavaScript, noindex, pas de cache.
[ "$(status /n-existe-pas)" = 404 ] || fail '/n-existe-pas ne répond pas 404'
body="$(curl -s "$BASE/n-existe-pas")"
grep -q '<title>404 · Eliott Roussille</title>' <<<"$body" || fail '404 sans <title>'
grep -q 'name="robots" content="noindex"' <<<"$body" || fail '404 sans noindex'
grep -q 'command not found' <<<"$body" || fail '404 sans le contenu terminal dans le HTML'
grep -q '<h1' <<<"$body" || fail '404 sans h1'
[ "$(header_value /n-existe-pas cache-control)" = no-cache ] || fail '404 sans Cache-Control no-cache'
ok '404 prérendue'

# Barre oblique finale : redirection permanente vers l'URL sans barre, requête conservée.
check_redirect() {
  local from="$1" to="$2" h
  h="$(headers "$from")"
  grep -q '^HTTP/[0-9.]* 308' <<<"$h" || fail "$from ne redirige pas en 308"
  [ "$(sed -n 's/^location: //p' <<<"$h")" = "$to" ] || fail "$from ne redirige pas vers $to"
}
check_redirect /projets/ /projets
check_redirect /a-propos/ /a-propos
check_redirect /projets/boggle/ /projets/boggle
check_redirect '/cv/?lang=fr' '/cv?lang=fr'
check_redirect //exemple.com/ /exemple.com
[ "$(status /)" = 200 ] || fail '/ ne répond plus 200'
ok 'barre oblique finale'

# Cache : fichiers versionnés immuables, le reste revalidé.
asset="$(curl -s "$BASE/" | grep -o '/_app/immutable/[^"]*\.js' | head -n1)"
[ -n "$asset" ] || fail 'aucun fichier /_app/immutable/ référencé par /'
[ -z "$asset" ] || [ "$(header_value "$asset" cache-control)" = 'public, max-age=31536000, immutable' ] ||
  fail "$asset sans Cache-Control immuable"
[ "$(header_value / cache-control)" = no-cache ] || fail '/ sans Cache-Control no-cache'
ok 'cache'

# security.txt en texte brut UTF-8.
[ "$(header_value /.well-known/security.txt content-type)" = 'text/plain; charset=utf-8' ] ||
  fail 'security.txt pas en text/plain; charset=utf-8'
ok 'security.txt'

if [ "$FAILS" -gt 0 ]; then
  echo "$FAILS vérification(s) en échec" >&2
  exit 1
fi
echo 'Toutes les vérifications passent.'
