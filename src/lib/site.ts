// Constantes du site, en un seul endroit.
export const SITE = {
  url: 'https://eliott-roussille.fr',
  name: 'Eliott Roussille',
  handle: '@aust-1',
  email: 'eliottroussille@gmail.com',
  linkedin: 'https://www.linkedin.com/in/eliott-roussille',
  github: 'https://github.com/aust-1',
  docs: 'https://docs.eliott-roussille.fr',
  hook: "J'écris du code côté développeur, je le casse côté attaquant.",
  subtitle: 'Étudiant ingénieur cyber & manager, ESILV × EMLV',
} as const;

/**
 * À REMPLACER (docs/a-remplacer.md) : empreinte de la clé publiée sur /pgp.asc. Tant qu'elle vaut
 * null, ni le pied de page ni /ce-site ne mentionnent de clé, et security.txt n'a pas de ligne
 * Encryption (vérifié par src/lib/security-txt.test.ts).
 */
export const PGP_FINGERPRINT: string | null = null;
