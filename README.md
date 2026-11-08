# portfolio

Site personnel d'Eliott Roussille, servi sur [eliott-roussille.fr](https://eliott-roussille.fr).

SvelteKit entièrement prérendu (`adapter-static`), contenu en Markdown dans `content/`, servi par
Caddy dans un conteneur derrière le reverse proxy partagé du VPS.

```bash
pnpm install
pnpm dev          # développement
pnpm check        # types
pnpm lint
pnpm test         # tests unitaires
pnpm build        # site statique dans build/
```

Mettre à jour un projet ou un rôle : éditer le fichier Markdown correspondant dans
`content/projets/` ou `content/parcours/`. Le build échoue si le contenu est invalide.

## Déploiement

Même modèle que les autres apps du dépôt `opt` : build sur le VPS par `infra/deploy.sh`, lancé par
le workflow **Déploiement** après une CI verte, et chaque nuit (la CI planifiée relance tout).

- `.env` (non versionné) : `FLAG_1` à `FLAG_5`, voir `.env.example`. Le build échoue si une valeur
  ne correspond pas à son empreinte dans `src/lib/flags/hashes.ts`.
- Secrets GitHub : `VPS_HOST`, `VPS_USER`, `VPS_PATH`, `VPS_SSH_KEY`, `VPS_KNOWN_HOSTS`.
- L'image finale est un Caddy sans privilèges (`infra/Caddyfile.site`) qui pose les en-têtes de
  sécurité ; le Caddy partagé du VPS route `eliott-roussille.fr` vers `portfolio:8080`.
- Les stats GitHub viennent de `aust-1/github-stats` (`generated/portfolio.json`) ; en cas d'échec,
  l'instantané `src/lib/data/github-fallback.json` est utilisé.

Contenu provisoire ou à fournir : voir `docs/a-remplacer.md`.
