import { HASHES, PAYLOADS, SEED } from 'virtual:flags';
import { safeGet, safeSet } from '#lib/storage.ts';
import { reveal } from './obfuscate.ts';
import { createVerifier } from './verify.ts';

export const submitFlag = createVerifier(HASHES, { get: safeGet, set: safeSet });

/** Révèle un flag au moment où il est trouvé (jamais stocké en clair dans le bundle). */
export function revealFlag(which: keyof typeof PAYLOADS): string {
  return reveal(PAYLOADS[which], SEED);
}

export const backdoor = () => revealFlag('backdoor');
