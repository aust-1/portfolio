---
title: Quiz Métro Paris
summary: Une application Android hors connexion pour apprendre à placer les 321 stations du métro parisien.
tags: [mobile, dev]
featured: false
period: { start: '2026-05', end: '2026-10' }
role: Projet personnel, conception et développement
team: 1
stack: [Kotlin, Jetpack Compose, Android, Python]
repo: https://github.com/aust-1/seterra-parisian-metro
privateRepo: false
cover: { src: placeholder, alt: Carte schématique du quiz, placeholder: true }
---

## Rôle

Projet personnel : je l'ai conçu, développé et testé seul.

## Contexte

Je voulais apprendre les stations du métro par cœur, à la façon de Seterra. Les applications existantes demandaient une connexion, affichaient de la publicité ou ne proposaient qu'un seul mode de jeu.

## Réalisation

- **Trois modes de jeu** : cliquer sur la carte, QCM, taper le nom de la station.
- **Difficulté réglable** : toutes les stations, les correspondances seulement, ou une sélection de lignes, avec ou sans le tracé affiché.
- **Carte schématique** avec zoom et déplacement tactiles.
- **Progression locale** : meilleur score par configuration, stations les plus ratées.
- **Aucune permission réseau** : les 321 stations et les 16 lignes sont embarquées dans l'APK. Un script Python, sans dépendance, les génère depuis le GTFS d'Île-de-France Mobilités.

## Résultat

Une application installable qui fonctionne en avion comme dans le métro, avec un moteur de quiz testé unitairement.
