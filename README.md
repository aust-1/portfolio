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

Comme toutes les apps du VPS : après une CI verte (à chaque push et chaque nuit), le workflow
**Déploiement** se connecte au compte `gh-deploy` avec une clé bridée à `sudo opt-deploy
portfolio`. Le serveur avance le sous-module sur `origin/main`, reconstruit l'image et attend le
healthcheck. Mécanisme et mise en place : `docs/ci-deploy.md` du dépôt opt. À la main, sur le
serveur : `sudo opt-deploy portfolio`.

- `.env` (non versionné) : `FLAG_1` à `FLAG_5`, voir `.env.example`. Le build échoue si une valeur
  ne correspond pas à son empreinte dans `src/lib/flags/hashes.ts`.
- Secrets GitHub : `VPS_HOST`, `VPS_SSH_KEY` (clé dédiée, autorisée par
  `deploy-install.sh --key portfolio`), `VPS_KNOWN_HOSTS`.
- L'image finale est un Caddy sans privilèges (`infra/Caddyfile.site`) qui pose les en-têtes de
  sécurité ; le Caddy partagé du VPS route `eliott-roussille.fr` vers `portfolio:8080`.
- Les stats GitHub viennent de `aust-1/github-stats` (`generated/portfolio.json`) ; en cas d'échec,
  l'instantané `src/lib/data/github-fallback.json` est utilisé.

Contenu provisoire ou à fournir : voir `docs/a-remplacer.md`.
