import { z } from 'zod';

/** Mois au format AAAA-MM : la précision du CV et de LinkedIn. */
const Month = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'date attendue au format AAAA-MM');

/** Texte affiché : apostrophe droite uniquement (spec §3). */
const Text = z
  .string()
  .min(1)
  .refine(
    (s) => !s.includes(String.fromCharCode(0x2019)),
    "apostrophe typographique interdite, utiliser '",
  );

const Slug = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'slug en minuscules et tirets');

export const TAGS = [
  'cyber',
  'web',
  'infra',
  'robotique',
  'embarque',
  'gestion-de-projet',
  'mobile',
  'dev',
  'pedagogie',
] as const;
export type Tag = (typeof TAGS)[number];

export const TAG_LABELS: Record<Tag, string> = {
  cyber: 'cyber',
  web: 'web',
  infra: 'infra',
  robotique: 'robotique',
  embarque: 'embarqué',
  'gestion-de-projet': 'gestion de projet',
  mobile: 'mobile',
  dev: 'dev',
  pedagogie: 'pédagogie',
};

export const Period = z.object({ start: Month, end: Month.optional() });
export type Period = z.infer<typeof Period>;

const Media = z.object({
  src: z.string().min(1),
  alt: Text,
  /** true : média pas encore fourni, affiché comme emplacement à remplacer. */
  placeholder: z.boolean().default(false),
});

const Link = z.object({ label: Text, href: z.string().url() });

export const ProjectSchema = z.object({
  title: Text,
  slug: Slug,
  summary: Text,
  tags: z.array(z.enum(TAGS)).min(1),
  featured: z.boolean(),
  /** Ordre d'affichage des 4 vedettes sur l'accueil. */
  featuredOrder: z.number().int().min(1).max(4).optional(),
  period: Period,
  /** Ce que j'ai fait personnellement, en une ligne. */
  role: Text,
  team: z.number().int().positive().optional(),
  /** Alimente /competences : une compétence n'existe que si un projet la porte. */
  stack: z.array(Text).min(1),
  repo: z.string().url().optional(),
  /** Dépôt privé : affiche « dépôt privé » et des extraits commentés. (`private` est réservé par mdsvex.) */
  privateRepo: z.boolean(),
  cover: Media.optional(),
  media: z.array(Media).default([]),
  awards: z.array(Text).default([]),
  links: z.array(Link).default([]),
  /** Rôles de la timeline liés à ce projet (slugs). */
  roles: z.array(Slug).default([]),
});
export type Project = z.infer<typeof ProjectSchema>;

export const ROLE_STATUS = ['en-cours', 'termine', 'a-venir'] as const;
export type RoleStatus = (typeof ROLE_STATUS)[number];

export const ROLE_KINDS = ['formation', 'association', 'enseignement', 'stage'] as const;

export const RoleSchema = z.object({
  title: Text,
  slug: Slug,
  organization: Text,
  kind: z.enum(ROLE_KINDS),
  /** Regroupe des rôles successifs d'une même structure (ex. « fablab »). */
  group: Slug.optional(),
  place: Text.optional(),
  period: Period,
  summary: Text.optional(),
  missions: z.array(Text).default([]),
  achievements: z.array(Text).default([]),
  skills: z.array(Text).default([]),
  relatedProjects: z.array(Slug).default([]),
  media: z.array(Media).default([]),
});
export type Role = z.infer<typeof RoleSchema>;

export const AwardSchema = z.object({
  title: Text,
  issuer: Text,
  date: Month,
  kind: z.enum(['certification', 'classement', 'prix']),
  detail: Text.optional(),
  url: z.string().url().optional(),
});
export type Award = z.infer<typeof AwardSchema>;
