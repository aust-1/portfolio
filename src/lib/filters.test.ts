import { describe, expect, it } from 'vitest';
import { matches, readTags, toggle } from './filters.ts';

describe('filtres de projets', () => {
  it("lit plusieurs tags depuis l'URL et ignore les inconnus", () => {
    const params = new URLSearchParams('tag=cyber&tag=web&tag=<script>');
    expect(readTags(params, ['cyber', 'web', 'infra'] as const)).toEqual(['cyber', 'web']);
  });

  it('montre tout quand aucun tag est actif', () => {
    expect(matches(['web'], [])).toBe(true);
  });

  it('garde un projet qui porte au moins un tag actif', () => {
    expect(matches(['web', 'cyber'], ['cyber'])).toBe(true);
    expect(matches(['robotique'], ['cyber', 'web'])).toBe(false);
  });

  it('ajoute puis retire un tag', () => {
    expect(toggle(['a'], 'b')).toEqual(['a', 'b']);
    expect(toggle(['a', 'b'], 'a')).toEqual(['b']);
  });
});
