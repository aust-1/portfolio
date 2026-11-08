import type { SubmitResult } from '#lib/terminal/interpreter.ts';

export const PROGRESS_KEY = 'er-flags';

export async function sha256Hex(text: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

type Store = { get: (k: string) => string | null; set: (k: string, v: string) => void };

function readFound(store: Store, total: number): Set<number> {
  try {
    const raw = JSON.parse(store.get(PROGRESS_KEY) ?? '[]');
    return new Set(
      Array.isArray(raw)
        ? raw.filter((n): n is number => Number.isInteger(n) && n >= 0 && n < total)
        : [],
    );
  } catch {
    return new Set();
  }
}

/**
 * Valide un flag en comparant son SHA-256 aux empreintes embarquées. La progression est gardée en
 * mémoire et, si possible, dans le stockage local (jamais indispensable).
 */
export function createVerifier(hashes: readonly string[], store: Store) {
  let found = readFound(store, hashes.length);
  return async function submit(candidate: string): Promise<SubmitResult> {
    const index = hashes.indexOf(await sha256Hex(candidate.trim()));
    const total = hashes.length;
    if (index === -1) return { ok: false, already: false, found: found.size, total };
    if (found.has(index)) return { ok: true, already: true, found: found.size, total };
    found = new Set([...found, index]);
    try {
      store.set(PROGRESS_KEY, JSON.stringify([...found]));
    } catch {
      /* stockage indisponible : la progression vit le temps de la page */
    }
    return { ok: true, already: false, found: found.size, total };
  };
}
