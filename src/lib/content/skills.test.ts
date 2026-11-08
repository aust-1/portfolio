import { describe, expect, it } from 'vitest';
import { deriveSkills } from './skills.ts';

type P = { slug: string; stack: string[]; tags: string[] };
const p = (slug: string, stack: string[], tags: string[] = []): P => ({ slug, stack, tags });

describe('deriveSkills', () => {
  it('compte les projets qui prouvent chaque compétence', () => {
    const skills = deriveSkills([p('a', ['Python', 'Docker']), p('b', ['Python'])]);
    const python = skills.find((s) => s.name === 'Python');
    expect(python?.weight).toBe(2);
    expect(python?.projects).toEqual(['a', 'b']);
  });

  it('fusionne les variantes de casse et les alias', () => {
    const skills = deriveSkills([p('a', ['TypeScript']), p('b', ['Typescript']), p('c', ['k8s'])]);
    expect(skills.filter((s) => s.slug === 'typescript')).toHaveLength(1);
    expect(skills.find((s) => s.slug === 'typescript')?.weight).toBe(2);
    expect(skills.find((s) => s.slug === 'kubernetes')?.name).toBe('Kubernetes');
  });

  it('inclut les tags comme domaines', () => {
    const skills = deriveSkills([p('a', ['Ghidra'], ['cyber'])]);
    expect(skills.find((s) => s.slug === 'cyber')?.family).toBe('domaine');
  });

  it('classe les langages à part des outils', () => {
    const skills = deriveSkills([p('a', ['C++', 'Docker'])]);
    expect(skills.find((s) => s.name === 'C++')?.family).toBe('langage');
    expect(skills.find((s) => s.name === 'Docker')?.family).toBe('outil');
  });

  it("n'invente aucune compétence sans projet", () => {
    expect(deriveSkills([])).toEqual([]);
  });

  it('trie par nombre de projets puis par nom', () => {
    const skills = deriveSkills([p('a', ['Zig', 'Bash']), p('b', ['Zig'])]);
    expect(skills.map((s) => s.name)).toEqual(['Zig', 'Bash']);
  });

  it('donne un slug stable et sans caractère spécial', () => {
    const skills = deriveSkills([p('a', ['C#', 'C++', '.NET'])]);
    expect(skills.map((s) => s.slug).sort()).toEqual(['c-plus-plus', 'c-sharp', 'dotnet']);
  });
});
