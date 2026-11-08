// En-têtes de sécurité posés par le Caddy interne (infra/Caddyfile.site). Liste affichée sur
// /ce-site ; un test vérifie qu'elle reste alignée avec le Caddyfile.
export const SECURITY_HEADERS: { name: string; why: string }[] = [
  {
    name: 'Content-Security-Policy',
    why: 'Scripts autorisés par empreinte SHA-256, aucun script tiers hors des statistiques auto-hébergées, aucune intégration dans un cadre.',
  },
  {
    name: 'Strict-Transport-Security',
    why: 'HTTPS imposé pendant deux ans, sous-domaines compris, inscription possible à la liste preload.',
  },
  { name: 'X-Content-Type-Options', why: "Le navigateur ne devine jamais le type d'un fichier." },
  {
    name: 'X-Frame-Options',
    why: 'Aucune page ne peut être affichée dans un cadre (clickjacking).',
  },
  { name: 'Referrer-Policy', why: "Seule l'origine est transmise aux sites externes." },
  {
    name: 'Permissions-Policy',
    why: 'Caméra, micro, géolocalisation, paiement et capteurs désactivés.',
  },
  { name: 'Cross-Origin-Opener-Policy', why: 'Isole la fenêtre des autres origines.' },
  {
    name: 'Cross-Origin-Resource-Policy',
    why: "Les ressources ne sont servies qu'au site lui-même.",
  },
];
