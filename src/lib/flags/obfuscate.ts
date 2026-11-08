// Obfuscation (pas du chiffrement) des flags révélés côté client : le bundle ne contient jamais la
// chaîne « aust-1{...} » lisible par `strings` ou une recherche. La validation, elle, ne repose que
// sur les empreintes SHA-256.

function keyByte(seed: number, i: number): number {
  return (seed * 131 + i * 197 + 89) & 0xff;
}

export function obfuscate(flag: string, seed: number): number[] {
  return [...new TextEncoder().encode(flag)].map((b, i) => b ^ keyByte(seed, i));
}

export function reveal(data: readonly number[], seed: number): string {
  return new TextDecoder().decode(Uint8Array.from(data, (b, i) => b ^ keyByte(seed, i)));
}
