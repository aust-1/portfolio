import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { resolveFlags } from './flags.ts';

const sha = (s: string) => createHash('sha256').update(s).digest('hex');
const REAL = ['aust-1{a}', 'aust-1{b}', 'aust-1{c}', 'aust-1{d}', 'aust-1{e}'];
const HASHES = REAL.map(sha);
const env = (values: string[]) => Object.fromEntries(values.map((v, i) => [`FLAG_${i + 1}`, v]));

describe('resolveFlags', () => {
  it('utilise les vrais flags quand ils correspondent aux empreintes', () => {
    const r = resolveFlags(env(REAL), HASHES);
    expect(r.mode).toBe('prod');
    expect(r.flags).toEqual(REAL);
    expect(r.hashes).toEqual(HASHES);
  });

  it('bascule sur des flags factices sans variables (dev, CI)', () => {
    const r = resolveFlags({}, HASHES);
    expect(r.mode).toBe('dev');
    expect(r.flags.every((f) => f.startsWith('aust-1{dev'))).toBe(true);
    expect(r.hashes).toEqual(r.flags.map(sha));
  });

  it('refuse un flag qui ne correspond pas à son empreinte', () => {
    const wrong = [...REAL];
    wrong[2] = 'aust-1{faux}';
    expect(() => resolveFlags(env(wrong), HASHES)).toThrow(/FLAG_3/);
  });

  it('refuse un jeu de variables incomplet', () => {
    expect(() => resolveFlags(env(REAL.slice(0, 2)), HASHES)).toThrow(/FLAG_3/);
  });
});
