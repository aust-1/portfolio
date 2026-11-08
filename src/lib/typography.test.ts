import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// Spec §3 : apostrophe droite exclusivement, jamais l'apostrophe typographique U+2019.
function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? files(path) : [path];
  });
}

describe('typographie', () => {
  it("n'utilise jamais l'apostrophe typographique dans le site", () => {
    const offenders = [
      ...files('src'),
      ...files('content'),
      ...files('tests'),
      ...files('scripts'),
    ].filter((f) => !f.endsWith('typography.test.ts') && readFileSync(f, 'utf8').includes('’'));
    expect(offenders).toEqual([]);
  });
});
