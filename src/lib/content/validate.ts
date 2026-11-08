import type { Period, Project, Role, RoleStatus } from './schema.ts';

/** Premier jour du mois AAAA-MM. */
export function monthStart(month: string): Date {
  const [y, m] = month.split('-').map(Number);
  return new Date(Date.UTC(y ?? 0, (m ?? 1) - 1, 1));
}

/** Premier jour du mois suivant : une période « jusqu'à 2025-05 » couvre tout mai. */
export function monthEnd(month: string): Date {
  const [y, m] = month.split('-').map(Number);
  return new Date(Date.UTC(y ?? 0, m ?? 1, 1));
}

function periodErrors(label: string, period: Period): string[] {
  if (period.end && period.end < period.start) {
    return [`${label} : la fin (${period.end}) précède le début (${period.start})`];
  }
  return [];
}

function duplicates(slugs: string[]): string[] {
  return slugs.filter((s, i) => slugs.indexOf(s) !== i);
}

/**
 * Règles qu'un schéma seul ne peut pas exprimer (références croisées, cohérence avec la date du
 * build). Renvoie la liste des erreurs, vide si le contenu est valide.
 */
export function validateContent(projects: Project[], roles: Role[]): string[] {
  const errors: string[] = [];
  const projectSlugs = new Set(projects.map((p) => p.slug));
  const roleSlugs = new Set(roles.map((r) => r.slug));

  for (const slug of duplicates(projects.map((p) => p.slug)))
    errors.push(`projet ${slug} : slug dupliqué`);
  for (const slug of duplicates(roles.map((r) => r.slug)))
    errors.push(`rôle ${slug} : slug dupliqué`);

  const featured = projects.filter((p) => p.featured);
  if (featured.length !== 4) {
    errors.push(`il faut exactement 4 projets vedettes, trouvé ${featured.length}`);
  }
  const orders = featured.map((p) => p.featuredOrder);
  if (orders.some((o) => o === undefined) || new Set(orders).size !== orders.length) {
    errors.push('chaque projet vedette doit avoir un featuredOrder unique de 1 à 4');
  }

  for (const p of projects) {
    errors.push(...periodErrors(`projet ${p.slug}`, p.period));
    for (const r of p.roles) {
      if (!roleSlugs.has(r)) errors.push(`projet ${p.slug} : rôle lié inexistant « ${r} »`);
    }
  }

  for (const r of roles) {
    errors.push(...periodErrors(`rôle ${r.slug}`, r.period));
    for (const p of r.relatedProjects) {
      if (!projectSlugs.has(p)) errors.push(`rôle ${r.slug} : projet lié inexistant « ${p} »`);
    }
  }

  return errors;
}

/**
 * Statut déduit des dates au moment du build : un rôle « à venir » devient « en cours » tout seul le
 * jour venu, sans éditer le contenu (le rebuild de nuit s'en charge).
 */
export function statusOf(period: Period, today: Date): RoleStatus {
  if (monthStart(period.start) > today) return 'a-venir';
  if (period.end !== undefined && monthEnd(period.end) <= today) return 'termine';
  return 'en-cours';
}
