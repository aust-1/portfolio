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
