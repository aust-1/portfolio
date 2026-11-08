import { describe, expect, it } from 'vitest';
import { obfuscate, reveal } from './obfuscate.ts';
import { createVerifier, sha256Hex } from './verify.ts';

const FLAGS = ['aust-1{un}', 'aust-1{deux}', 'aust-1{trois}'];

function memoryStore() {
  const map = new Map<string, string>();
  return {
    get: (k: string) => map.get(k) ?? null,
    set: (k: string, v: string) => void map.set(k, v),
  };
}

describe('obfuscation', () => {
  it('restitue le flag à la révélation', () => {
    for (const f of FLAGS) expect(reveal(obfuscate(f, 7), 7)).toBe(f);
  });

  it('ne laisse jamais le flag en clair dans les données', () => {
    const data = JSON.stringify(obfuscate('aust-1{secret}', 3));
    expect(data).not.toContain('aust-1');
    expect(data).not.toContain('secret');
  });
});

describe('validation des flags', () => {
  it('calcule un SHA-256 hexadécimal', async () => {
    expect(await sha256Hex('abc')).toBe(
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    );
  });

  it('accepte un bon flag et compte la progression', async () => {
    const hashes = await Promise.all(FLAGS.map(sha256Hex));
    const submit = createVerifier(hashes, memoryStore());
    expect(await submit('aust-1{deux}')).toEqual({ ok: true, already: false, found: 1, total: 3 });
    expect(await submit('  aust-1{un}  ')).toEqual({
      ok: true,
      already: false,
      found: 2,
      total: 3,
    });
  });

  it('signale un flag déjà trouvé', async () => {
    const hashes = await Promise.all(FLAGS.map(sha256Hex));
    const submit = createVerifier(hashes, memoryStore());
    await submit('aust-1{un}');
    expect(await submit('aust-1{un}')).toEqual({ ok: true, already: true, found: 1, total: 3 });
  });

  it('refuse un mauvais flag', async () => {
    const hashes = await Promise.all(FLAGS.map(sha256Hex));
    const submit = createVerifier(hashes, memoryStore());
    expect((await submit('aust-1{faux}')).ok).toBe(false);
  });

  it('fonctionne sans stockage (navigation privée)', async () => {
    const hashes = await Promise.all(FLAGS.map(sha256Hex));
    const broken = {
      get: () => {
        throw new Error('x');
      },
      set: () => {
        throw new Error('x');
      },
    };
    const submit = createVerifier(hashes, broken);
    expect((await submit('aust-1{un}')).ok).toBe(true);
  });

  it('ignore une progression stockée corrompue', async () => {
    const hashes = await Promise.all(FLAGS.map(sha256Hex));
    const store = memoryStore();
    store.set('er-flags', '{pas du json');
    const submit = createVerifier(hashes, store);
    expect((await submit('aust-1{un}')).found).toBe(1);
  });
});
