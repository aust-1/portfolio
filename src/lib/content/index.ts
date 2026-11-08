import type { Component } from 'svelte';
import { AWARDS } from './awards.ts';
import { ProjectSchema, RoleSchema, type Project, type Role } from './schema.ts';
import { monthStart, validateContent } from './validate.ts';

type MdModule = { default: Component; metadata?: Record<string, unknown> };

export type ProjectEntry = Project & { Body: Component };
export type RoleEntry = Role & { Body: Component };

function slugFromPath(path: string): string {
  return path.split('/').pop()!.replace(/\.md$/, '');
}

function load<T extends { slug: string }>(
  modules: Record<string, MdModule>,
  parse: (data: unknown) => T,
  kind: string,
): (T & { Body: Component })[] {
  return Object.entries(modules).map(([path, mod]) => {
    const slug = slugFromPath(path);
    let data: T;
    try {
      data = parse({ slug, ...mod.metadata });
    } catch (e) {
      const detail = e instanceof Error ? e.message : String(e);
      throw new Error(`${kind} ${path} invalide :\n${detail}`, { cause: e });
    }
    if (data.slug !== slug) throw new Error(`${kind} ${path} : le slug doit être « ${slug} »`);
    return { ...data, Body: mod.default };
  });
}

const byStartDesc = (a: { period: { start: string } }, b: { period: { start: string } }) =>
  monthStart(b.period.start).getTime() - monthStart(a.period.start).getTime();

const projects = load(
  import.meta.glob<MdModule>('/content/projets/*.md', { eager: true }),
  (d) => ProjectSchema.parse(d),
  'projet',
).sort(byStartDesc);

const roles = load(
  import.meta.glob<MdModule>('/content/parcours/*.md', { eager: true }),
  (d) => RoleSchema.parse(d),
  'rôle',
).sort(byStartDesc);

const errors = validateContent(projects, roles);
if (errors.length > 0) {
  throw new Error(`Contenu invalide :\n- ${errors.join('\n- ')}`);
}

export const getProjects = (): ProjectEntry[] => projects;
export const getProject = (slug: string): ProjectEntry | undefined =>
  projects.find((p) => p.slug === slug);
export const getFeatured = (): ProjectEntry[] =>
  projects
    .filter((p) => p.featured)
    .sort((a, b) => (a.featuredOrder ?? 0) - (b.featuredOrder ?? 0));
export const getRoles = (): RoleEntry[] => roles;
export const getRole = (slug: string): RoleEntry | undefined => roles.find((r) => r.slug === slug);
export const getAwards = () => AWARDS;
