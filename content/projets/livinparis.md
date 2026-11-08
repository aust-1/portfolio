---
title: Liv'in Paris
summary: Une plateforme de livraison de repas dans Paris qui calcule ses trajets sur le graphe du métro.
tags: [dev, web]
featured: false
period: { start: '2025-02', end: '2025-05' }
role: Développement en binôme, de la base de données aux algorithmes de graphes
team: 2
stack: [C#, .NET, MySQL, Docker, Théorie des graphes]
repo: https://github.com/aust-1/LivInParis
privateRepo: false
cover: { src: placeholder, alt: Visualisation du graphe du métro, placeholder: true }
---

## Rôle

Projet ESILV en binôme avec François Teynier. Nous avons tout construit à deux : modèle de données, services et algorithmes.

## Contexte

Une plateforme met en relation des cuisiniers et des clients dans Paris intra-muros. Pour livrer, il faut trouver le meilleur trajet entre deux adresses en utilisant le réseau du métro.

## Réalisation

- Architecture en couches C# : `Api`, `Domain`, `Infrastructure`, `Services`, avec un projet de tests.
- Base MySQL conteneurisée avec Docker et initialisée par script SQL.
- Modélisation du métro en graphe et calcul de plus courts chemins pour les livraisons.

<!-- À COMPLÉTER : algorithmes utilisés (Dijkstra, Bellman-Ford, Floyd-Warshall ?) et ce qu'ils ont montré. -->

## Résultat

Une plateforme fonctionnelle livrée en fin de semestre, avec son environnement de développement reproductible.
