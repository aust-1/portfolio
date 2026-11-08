---
title: Infra DaVinciBot
summary: L'infrastructure auto-hébergée de l'association, de NixOS et k3s jusqu'à Docker sur un VPS durci.
tags: [infra, cyber]
featured: true
featuredOrder: 4
period: { start: '2026-02' }
role: Responsable de tout le système d'information de l'association
stack: [Docker, Kubernetes, NixOS, Linux, Caddy, Traefik, WireGuard, GitHub Actions]
privateRepo: true
cover: { src: placeholder, alt: Schéma de l'infrastructure DaVinciBot, placeholder: true }
roles: [davincibot-responsable-numerique]
---

## Rôle

Je suis responsable numérique de DaVinciBot, élu par l'association. J'administre l'infrastructure, je conçois la chaîne de déploiement et je réponds aux incidents.

## Contexte

L'association auto-héberge une quinzaine de services : ses sites, ses outils internes et ses services pour les membres. Il faut que tout tienne avec des bénévoles qui changent chaque année, sans jeton administrateur partagé et sans dépendre d'une seule personne.

## Réalisation

- **Deux infrastructures complémentaires** : un cluster Kubernetes sous NixOS, déclaratif et reproductible, et une stack Docker sur VPS.
- **Migration** : la flotte web passe du cluster NixOS/k3s à Ubuntu et Docker sur un VPS, derrière Caddy, en trois environnements.
- **Point d'entrée unique** : reverse proxy et tunnels chiffrés (Traefik, WireGuard) pour exposer des services hébergés sur des sites distants.
- **Chaîne de livraison** : GitHub Actions, registre d'images privé, promotion des images par digest, mise à jour des conteneurs déclenchée par API, runners auto-hébergés.
- **Durcissement** : audit de sécurité automatisé, SSH, fail2ban, paramètres noyau, contrôle d'intégrité des fichiers, cloisonnement des ports Docker.
- **Secrets** : le jeton administrateur partagé est remplacé par des comptes de service cloisonnés par environnement.
- **Incidents de production** : résolution DNS, tunnels réseau, dépendances entre services, supervision.

## Résultat

Environ 15 services auto-hébergés, 5 applications sur 14 environnements cloisonnés. Le dépôt est privé : les extraits ci-dessous sont commentés.

<!-- À COMPLÉTER : un ou deux extraits partageables (compose, workflow, règle de durcissement), commentés. -->
