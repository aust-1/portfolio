// Ressources recommandées (spec §9). Chaque lien porte une phrase qui dit pourquoi.
export type Lien = { label: string; href: string; why: string };
export type Groupe = { id: string; title: string; links: Lien[] };

export const LIENS: Groupe[] = [
  {
    id: 'sentrainer',
    title: "S'entraîner",
    links: [
      {
        label: 'Root-Me',
        href: 'https://www.root-me.org',
        why: 'Des centaines de challenges en français, classés par catégorie : le meilleur point de départ.',
      },
      {
        label: 'Hack The Box',
        href: 'https://www.hackthebox.com',
        why: "Des machines complètes à compromettre, du scan initial à l'élévation de privilèges.",
      },
      {
        label: 'TryHackMe',
        href: 'https://tryhackme.com',
        why: 'Des parcours guidés pas à pas, idéaux pour apprendre une notion avant de la pratiquer seul.',
      },
      {
        label: 'PortSwigger Web Security Academy',
        href: 'https://portswigger.net/web-security',
        why: 'La référence gratuite en sécurité web : chaque vulnérabilité avec sa théorie et ses labs.',
      },
      {
        label: 'OverTheWire',
        href: 'https://overthewire.org/wargames/',
        why: 'Bandit pour apprivoiser le terminal Linux, puis des wargames de plus en plus bas niveau.',
      },
      {
        label: 'pwn.college',
        href: 'https://pwn.college',
        why: "Un cours complet d'exploitation binaire, de l'assembleur jusqu'au noyau.",
      },
    ],
  },
  {
    id: 'ctf',
    title: 'CTF',
    links: [
      {
        label: 'CTFtime',
        href: 'https://ctftime.org',
        why: 'Le calendrier des compétitions, les classements des équipes et les write-ups publiés.',
      },
    ],
  },
  {
    id: 'references',
    title: 'Références offensives',
    links: [
      {
        label: 'OWASP Top 10 et Cheat Sheets',
        href: 'https://owasp.org/www-project-top-ten/',
        why: 'Le socle commun pour parler de sécurité applicative avec les équipes de développement.',
      },
      {
        label: 'HackTricks',
        href: 'https://book.hacktricks.wiki',
        why: 'Le carnet de méthodes le plus complet, du pentest réseau au cloud.',
      },
      {
        label: 'PayloadsAllTheThings',
        href: 'https://github.com/swisskyrepo/PayloadsAllTheThings',
        why: 'Des charges utiles prêtes à adapter pour chaque classe de vulnérabilité.',
      },
      {
        label: 'GTFOBins',
        href: 'https://gtfobins.github.io',
        why: "Comment détourner un binaire Unix légitime pour élever ses privilèges ou s'échapper.",
      },
      {
        label: 'CyberChef',
        href: 'https://gchq.github.io/CyberChef/',
        why: 'Le couteau suisse pour décoder, déchiffrer et transformer des données dans le navigateur.',
      },
    ],
  },
  {
    id: 'veille',
    title: 'Veille',
    links: [
      {
        label: 'CERT-FR',
        href: 'https://www.cert.ssi.gouv.fr',
        why: 'Les alertes et avis de sécurité officiels, à suivre pour savoir quoi corriger en premier.',
      },
      {
        label: "Publications de l'ANSSI",
        href: 'https://cyber.gouv.fr/publications',
        why: "Les guides d'hygiène et de durcissement qui font référence en France.",
      },
    ],
  },
  {
    id: 'dev',
    title: 'Dev et infra',
    links: [
      {
        label: 'Pro Git',
        href: 'https://git-scm.com/book/fr/v2',
        why: 'Le livre officiel de Git, gratuit et en français : comprendre au lieu de mémoriser.',
      },
      {
        label: 'Tutoriel officiel Svelte',
        href: 'https://svelte.dev/tutorial',
        why: 'Interactif, court et à jour : le moyen le plus rapide de prendre en main Svelte et SvelteKit.',
      },
      {
        label: 'Documentation Docker',
        href: 'https://docs.docker.com',
        why: 'Les guides de référence pour conteneuriser proprement, réseau et sécurité compris.',
      },
      {
        label: 'Documentation Caddy',
        href: 'https://caddyserver.com/docs/',
        why: 'Le serveur web qui sert ce site : HTTPS automatique et configuration lisible.',
      },
    ],
  },
  {
    id: 'perso',
    title: 'Mes ressources',
    links: [
      {
        label: 'docs.eliott-roussille.fr',
        href: 'https://docs.eliott-roussille.fr',
        why: 'Mes notes de cours et documentations techniques, publiées au fil de mes études.',
      },
      {
        label: 'Supports de formation DaVinciBot',
        href: 'https://docs.eliott-roussille.fr',
        why: "Les supports que j'utilise pour former les nouveaux membres : Git, POO, outillage.",
      },
    ],
  },
];
