import { afterEach, describe, expect, it, vi } from 'vitest';
import { applyTheme, readTheme, THEME_KEY } from './theme.ts';

function fakeRoot() {
  return { dataset: {} as Record<string, string | undefined> };
}

describe('theme', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('applique le thème sombre et le mémorise', () => {
    const map = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      getItem: (k: string) => map.get(k) ?? null,
      setItem: (k: string, v: string) => void map.set(k, v),
      removeItem: (k: string) => void map.delete(k),
    });
    const root = fakeRoot();
    applyTheme('dark', root);
    expect(root.dataset.theme).toBe('dark');
    expect(map.get(THEME_KEY)).toBe('dark');
    expect(readTheme()).toBe('dark');
  });

  it('revient au système en retirant data-theme', () => {
    const root = fakeRoot();
    root.dataset.theme = 'dark';
    vi.stubGlobal('localStorage', undefined);
    applyTheme('system', root);
    expect(root.dataset.theme).toBeUndefined();
  });

  it('applique le thème même si le stockage lève', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new Error('x');
      },
      setItem: () => {
        throw new Error('x');
      },
      removeItem: () => {
        throw new Error('x');
      },
    });
    const root = fakeRoot();
    expect(() => applyTheme('light', root)).not.toThrow();
    expect(root.dataset.theme).toBe('light');
    expect(readTheme()).toBe('system');
  });
});
