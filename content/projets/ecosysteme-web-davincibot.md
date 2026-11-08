---
title: Écosystème web DaVinciBot
summary: Une plateforme de quatre applications SvelteKit qui partagent une authentification, une base et une CI.
tags: [web, dev, cyber]
featured: true
featuredOrder: 3
period: { start: '2025-11' }
role: Conception de l'architecture et développement full-stack, de la base Postgres à l'interface
stack: [SvelteKit, Svelte, TypeScript, Supabase, PostgreSQL, Tailwind CSS, pnpm, GitHub Actions]
repo: https://github.com/DaVinciBot
privateRepo: false
cover: { src: placeholder, alt: Page d'accueil de davincibot.fr, placeholder: true }
media:
  - { src: placeholder, alt: 'Back-office cash : gestion des membres', placeholder: true }
  - { src: placeholder, alt: 'Application formation : inscription à une session', placeholder: true }
roles: [davincibot-pole-numerique, davincibot-responsable-numerique]
---

## Rôle

J'ai commencé par l'application de formation, puis j'ai repris l'ensemble comme responsable numérique de l'association. Je conçois le découpage, j'écris le socle partagé et je développe les applications.

## Contexte

L'association avait besoin d'un site public, d'un back-office (trésorerie, commandes, membres), d'un outil d'inscription aux formations et d'un suivi des cotisations. Quatre besoins, une seule équipe bénévole : il fallait mutualiser au maximum.

## Les dépôts

**Applications**

- `davincibot.fr` : le site public, servi à la racine du domaine.
- `cash` : le panneau d'administration, servi sous `/admin`. Trésorerie, commandes, gestion des membres.
- `formation` : la gestion des formations, servie sous `/formation`. Sessions, formateurs, inscriptions, présences.

**Socle**

- `auth` : le service d'authentification centralisé, sur `auth.davincibot.fr`. Login, sessions, invitations, OIDC, MFA par e-mail, step-up et passkeys. Les trois sites lui délèguent tout et ne manipulent plus de tokens.
- `Supabased` (privé) : le backend Supabase, avec le schéma, les migrations versionnées, les edge functions et les types générés pour les applications.
- `packages` (privé) : les paquets npm partagés entre les applications.

**Intégrations**

- `helloasso-webhooks` : un micro-service qui reçoit les paiements HelloAsso. Il ne croit jamais le payload reçu (non signé) : il relit chaque paiement auprès de l'API, puis coche la cotisation dans Notion ou inscrit les places de l'événement.

**Industrialisation**

- `shared-workflows` : les workflows GitHub Actions réutilisables. Qualité (check, lint, tests, build), puis construction des conteneurs inspectés par hadolint, dive, dockle et Trivy avant toute publication.

## Choix d'architecture

- **Un domaine, plusieurs applications** : chaque application vit sous son chemin et se déploie seule.
- **L'authentification sort des applications** : un seul service gère les sessions, les autres ne voient jamais un token.
- **Tout ce qui se répète est mutualisé** : composants dans `packages`, CI dans `shared-workflows`. Un correctif se propage par une montée de version.

<!-- À COMPLÉTER : schéma d'architecture exporté si une version plus détaillée existe. -->

## Résultat

5 applications déployées sur 14 environnements cloisonnés (dev, staging, prod). Voir aussi la page [Infra DaVinciBot](/projets/infra-davincibot).
