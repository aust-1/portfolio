import { afterEach, describe, expect, it, vi } from 'vitest';
import { safeGet, safeSet } from './storage.ts';

function throwingStorage(): Storage {
  const boom = () => {
    throw new DOMException('quota', 'QuotaExceededError');
  };
  return {
    getItem: boom,
    setItem: boom,
    removeItem: boom,
    clear: boom,
    key: boom,
    length: 0,
  } as unknown as Storage;
}

describe('storage', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('lit et écrit quand le stockage fonctionne', () => {
    const map = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      getItem: (k: string) => map.get(k) ?? null,
      setItem: (k: string, v: string) => void map.set(k, v),
    });
    expect(safeSet('k', 'v')).toBe(true);
    expect(safeGet('k')).toBe('v');
  });

  it("n'échoue pas quand localStorage lève", () => {
    vi.stubGlobal('localStorage', throwingStorage());
    expect(() => safeSet('k', 'v')).not.toThrow();
    expect(safeSet('k', 'v')).toBe(false);
    expect(safeGet('k')).toBeNull();
  });

  it("n'échoue pas quand localStorage n'existe pas", () => {
    vi.stubGlobal('localStorage', undefined);
    expect(safeGet('k')).toBeNull();
    expect(safeSet('k', 'v')).toBe(false);
  });
});
