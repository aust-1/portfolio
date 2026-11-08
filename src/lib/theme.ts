import { safeGet, safeRemove, safeSet } from './storage.ts';

export type Theme = 'light' | 'dark' | 'system';

/** Même clé que static/theme-init.js, qui applique le thème avant le premier rendu. */
export const THEME_KEY = 'er-theme';

type Root = { dataset: Record<string, string | undefined> };

export function readTheme(): Theme {
  const t = safeGet(THEME_KEY);
  return t === 'light' || t === 'dark' ? t : 'system';
}

export function applyTheme(theme: Theme, root: Root = document.documentElement): void {
  if (theme === 'system') {
    delete root.dataset.theme;
    safeRemove(THEME_KEY);
  } else {
    root.dataset.theme = theme;
    safeSet(THEME_KEY, theme);
  }
}
