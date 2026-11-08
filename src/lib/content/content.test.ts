import { describe, expect, it } from 'vitest';
import { ProjectSchema, RoleSchema, type Project, type Role } from './schema.ts';
import { statusOf, validateContent } from './validate.ts';

const TODAY = new Date('2026-11-08');

function project(over: Partial<Project> = {}): Project {
  return ProjectSchema.parse({
    title: 'Projet',
    slug: over.slug ?? 'projet',
    summary: 'Résumé.',
    tags: ['web'],
    featured: false,
    period: { start: '2025-01' },
    role: 'Développeur',
    stack: ['TypeScript'],
    privateRepo: false,
    ...over,
  });
}

function role(over: Partial<Role> = {}): Role {
  return RoleSchema.parse({
    title: 'Rôle',
    slug: over.slug ?? 'role',
    organization: 'Org',
    kind: 'association',
    period: { start: '2025-01' },
    missions: [],
    achievements: [],
    skills: [],
    relatedProjects: [],
    ...over,
  });
}

function fourFeatured(): Project[] {
  return [1, 2, 3, 4].map((n) => project({ slug: `p${n}`, featured: true, featuredOrder: n }));
}

describe('schémas', () => {
  it('refuse une date qui ne suit pas AAAA-MM', () => {
    expect(() => project({ period: { start: '2025' } })).toThrow();
  });

  it('refuse un tag inconnu', () => {
    expect(() => project({ tags: ['cuisine' as never] })).toThrow();
  });

  it('refuse une apostrophe typographique dans le titre', () => {
    expect(() => project({ title: 'L’app' })).toThrow();
  });
});

describe('validateContent', () => {
  it('accepte un contenu cohérent', () => {
    const roles = [role({ relatedProjects: ['p1'] })];
    expect(validateContent(fourFeatured(), roles)).toEqual([]);
  });

  it('signale un projet lié inexistant', () => {
    const roles = [role({ relatedProjects: ['inexistant'] })];
    const errors = validateContent(fourFeatured(), roles);
    expect(errors.join('\n')).toContain('inexistant');
  });

  it('exige exactement quatre projets vedettes', () => {
    const errors = validateContent(fourFeatured().slice(0, 3), []);
    expect(errors.join('\n')).toContain('vedette');
  });

  it('signale une fin antérieure au début', () => {
    const projects = [
      ...fourFeatured(),
      project({ slug: 'x', period: { start: '2025-05', end: '2025-01' } }),
    ];
    expect(validateContent(projects, []).join('\n')).toContain('x');
  });

  it('signale un slug dupliqué', () => {
    const projects = [...fourFeatured(), project({ slug: 'p1' })];
    expect(validateContent(projects, []).join('\n')).toContain('p1');
  });
});

describe('statusOf', () => {
  it('déduit le statut des dates, sans saisie manuelle', () => {
    expect(statusOf({ start: '2027-04', end: '2027-09' }, TODAY)).toBe('a-venir');
    expect(statusOf({ start: '2024-01', end: '2025-01' }, TODAY)).toBe('termine');
    expect(statusOf({ start: '2026-02' }, TODAY)).toBe('en-cours');
    expect(statusOf({ start: '2024-09', end: '2026-11' }, TODAY)).toBe('en-cours');
  });

  it('bascule tout seul quand la date arrive (le build de nuit ne casse pas)', () => {
    expect(statusOf({ start: '2027-04', end: '2027-09' }, new Date('2027-05-02'))).toBe('en-cours');
  });
});
