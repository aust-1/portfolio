import { readdirSync, readFileSync } from 'node:fs';
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
    expect(() => project({ title: `L${String.fromCharCode(0x2019)}app` })).toThrow();
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

// Le corps des fichiers Markdown n'est pas validé par zod : un texte d'attente ou un titre sans
// contenu partirait en ligne. Les commentaires <!-- … --> sont retirés au rendu, donc tolérés.
function parseMarkdown(raw: string) {
  const [, front = '', body = ''] = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(raw) ?? [];
  return {
    draft: /^draft:\s*true\s*$/m.test(front),
    visible: body.replace(/<!--[\s\S]*?-->/g, ''),
  };
}

/** Titres suivis de rien d'affiché avant le titre suivant (un sous-titre compte comme contenu). */
function emptyHeadings(visible: string): string[] {
  const sections = visible.split(/^(?=#{1,6} )/m).filter((s) => /^#{1,6} /.test(s));
  const level = (s: string) => /^#+/.exec(s)?.[0].length ?? 0;
  return sections
    .filter((s, i) => {
      const next = sections[i + 1];
      const isEmpty = s.split('\n').slice(1).join('\n').trim() === '';
      return isEmpty && !(next && level(next) > level(s));
    })
    .map((s) => s.split('\n')[0]!);
}

describe('corps des contenus publiés', () => {
  it("repère le texte d'attente et les titres vides, pas les commentaires", () => {
    const { visible } = parseMarkdown(
      '---\ntitle: x\n---\n## Rôle\n\nÀ compléter.\n\n## Organisation\n\n<!-- À COMPLÉTER -->\n\n## Bilan\n\n### 2025\n\nTexte.\n',
    );
    expect(visible.match(/à compléter/gi)).toHaveLength(1);
    expect(emptyHeadings(visible)).toEqual(['## Organisation']);
    expect(parseMarkdown('---\ndraft: true\n---\n').draft).toBe(true);
  });

  const published = ['content/projets', 'content/parcours']
    .flatMap((dir) =>
      readdirSync(dir)
        .filter((f) => f.endsWith('.md'))
        .map((f) => ({
          path: `${dir}/${f}`,
          ...parseMarkdown(readFileSync(`${dir}/${f}`, 'utf8')),
        })),
    )
    .filter((f) => !f.draft);

  it('trouve les fichiers de contenu', () => {
    expect(published.length).toBeGreaterThan(10);
  });

  it.each(published.map((f) => [f.path, f.visible] as const))(
    '%s ne contient aucun « À compléter » affiché ni titre vide',
    (_, visible) => {
      expect(visible).not.toMatch(/à compléter/i);
      expect(emptyHeadings(visible)).toEqual([]);
    },
  );
});
