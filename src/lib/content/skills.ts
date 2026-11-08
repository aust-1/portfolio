import { TAG_LABELS, type Tag } from './schema.ts';

// Compétences dérivées des projets (spec §8) : aucune liste saisie à la main. Une compétence
// n'existe sur le site que si au moins un projet la porte dans son `stack` ou ses `tags`.

export type SkillFamily = 'langage' | 'outil' | 'domaine';

export type Skill = {
  name: string;
  slug: string;
  family: SkillFamily;
  /** Slugs des projets qui prouvent la compétence, dans l'ordre reçu. */
  projects: string[];
  /** Nombre de projets : sert à la taille dans la vue animée. */
  weight: number;
};

/** Variantes d'écriture → nom canonique (clés en minuscules). */
const ALIASES: Record<string, string> = {
  typescript: 'TypeScript',
  javascript: 'JavaScript',
  k8s: 'Kubernetes',
  kubernetes: 'Kubernetes',
  postgres: 'PostgreSQL',
  postgresql: 'PostgreSQL',
  'c/c++': 'C++',
  sveltekit: 'SvelteKit',
};

const LANGUAGES = new Set([
  'C',
  'C++',
  'C#',
  'Python',
  'TypeScript',
  'JavaScript',
  'Kotlin',
  'Bash',
  'SQL',
  'Zig',
  'Nix',
  'Rust',
  'Go',
  'Java',
]);

const SLUG_REPLACEMENTS: [RegExp, string][] = [
  [/\+\+/g, '-plus-plus'],
  [/#/g, '-sharp'],
  [/^\.net$/i, 'dotnet'],
];

export function skillSlug(name: string): string {
  let s = name.trim().toLowerCase();
  for (const [re, rep] of SLUG_REPLACEMENTS) s = s.replace(re, rep);
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function canonical(name: string): string {
  return ALIASES[name.trim().toLowerCase()] ?? name.trim();
}

export function deriveSkills(
  projects: { slug: string; stack: string[]; tags: readonly string[] }[],
): Skill[] {
  const bySlug = new Map<string, Skill>();

  const add = (rawName: string, family: SkillFamily, project: string) => {
    const name = canonical(rawName);
    const slug = skillSlug(name);
    const skill = bySlug.get(slug) ?? { name, slug, family, projects: [], weight: 0 };
    if (!skill.projects.includes(project)) skill.projects.push(project);
    skill.weight = skill.projects.length;
    bySlug.set(slug, skill);
  };

  for (const p of projects) {
    for (const tech of p.stack)
      add(tech, LANGUAGES.has(canonical(tech)) ? 'langage' : 'outil', p.slug);
    for (const tag of p.tags) add(TAG_LABELS[tag as Tag] ?? tag, 'domaine', p.slug);
  }

  return [...bySlug.values()].sort(
    (a, b) => b.weight - a.weight || a.name.localeCompare(b.name, 'fr'),
  );
}
