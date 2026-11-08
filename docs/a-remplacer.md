# À remplacer ou compléter

Tout ce qui est provisoire sur le site. Chaque ligne indique le fichier à modifier.

## Médias

Les médias marqués `placeholder: true` dans le frontmatter s'affichent comme un emplacement « image à
venir ». Pour les remplacer : déposer l'image dans `static/media/projets/<slug>/`, puis mettre
`src: /media/projets/<slug>/<fichier>` et retirer `placeholder: true`.

| Projet                       | Fichier                                           | Médias attendus                                           |
| ---------------------------- | ------------------------------------------------- | --------------------------------------------------------- |
| Coupe de France de Robotique | `content/projets/coupe-de-france-de-robotique.md` | couverture (robot), équipe à La Roche-sur-Yon, match 2025 |
| DVCTF x bug bounty           | `content/projets/dvctf-bug-bounty.md`             | couverture                                                |
| Écosystème web DaVinciBot    | `content/projets/ecosysteme-web-davincibot.md`    | couverture (davincibot.fr), cash, formation               |
| Infra DaVinciBot             | `content/projets/infra-davincibot.md`             | couverture (schéma)                                       |
| Quiz Métro Paris             | `content/projets/app-metro.md`                    | couverture (capture de l'app)                             |
| Hackathons                   | `content/projets/hackathons.md`                   | couverture                                                |
| Liv'in Paris                 | `content/projets/livinparis.md`                   | couverture                                                |
| FablaBot                     | `content/projets/bot-discord.md`                  | couverture                                                |
| Boggle                       | `content/projets/boggle.md`                       | couverture                                                |

## Textes (commentaires `À COMPLÉTER` dans les fichiers)

- `coupe-de-france-de-robotique.md` : une difficulté technique précise et la solution retenue.
- `dvctf-bug-bounty.md` : volet organisation ; classements CTF ; nombre de défis publiés.
- `ecosysteme-web-davincibot.md` : schéma d'architecture plus détaillé si besoin.
- `infra-davincibot.md` : un ou deux extraits de code partageables, commentés.
- `hackathons.md` : **tout** (dates, sujets, équipes, réalisations, résultats d'Adopt AI et European Defense Tech). La date de début du projet (`2026-01`) est provisoire.
- `livinparis.md` : algorithmes de graphes utilisés.
- `bot-discord.md` : commandes ou modules écrits personnellement.
- `boggle.md` : taille de l'équipe et part personnelle.
- Tous les textes sont des brouillons rédigés à partir de LinkedIn, du CV et des README : à relire.

## Sécurité

- `static/pgp.asc` : publier la clé publique PGP.
- `src/lib/site.ts` : `PGP_FINGERPRINT`, empreinte de cette clé (affichée dans le pied de page).
- `static/.well-known/security.txt` : la date `Expires` est à renouveler chaque année.

## Flags

Les cinq valeurs vivent dans le `.env` du VPS (`FLAG_1` à `FLAG_5`) et ne sont jamais versionnées.
Pour en changer : mettre à jour `.env` et les empreintes dans `src/lib/flags/hashes.ts`.
