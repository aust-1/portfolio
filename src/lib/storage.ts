// Accès au localStorage qui ne lève jamais : navigation privée, quota plein ou stockage bloqué
// ne doivent rien casser. Le site fonctionne sans persistance.

export function safeGet(key: string): string | null {
  try {
    return globalThis.localStorage?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

export function safeSet(key: string, value: string): boolean {
  try {
    if (!globalThis.localStorage) return false;
    globalThis.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function safeRemove(key: string): void {
  try {
    globalThis.localStorage?.removeItem(key);
  } catch {
    /* stockage indisponible */
  }
}
