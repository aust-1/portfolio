import { describe, expect, it } from 'vitest';
import { readHash } from './hash.ts';

describe('readHash', () => {
  it('décode un fragment valide', () => {
    expect(readHash('#c-plus-plus')).toBe('c-plus-plus');
    expect(readHash('#th%C3%A9orie')).toBe('théorie');
  });

  it('ne lève jamais sur un fragment mal encodé (URL forgée)', () => {
    expect(() => readHash('#%E0%A4%A')).not.toThrow();
    expect(readHash('#%E0%A4%A')).toBe('');
    expect(readHash('#%')).toBe('');
  });

  it('renvoie une chaîne vide sans fragment', () => {
    expect(readHash('')).toBe('');
  });
});
