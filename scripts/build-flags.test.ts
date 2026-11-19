import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { checkBuiltFlags, variants } from './build-flags.ts';

const FLAGS = ['aust-1{un}', 'aust-1{deux}', 'aust-1{trois}'];
const HASHES = FLAGS.map((f) => createHash('sha256').update(f).digest('hex'));
const bundle = { path: '_app/immutable/x.js', content: `const H=${JSON.stringify(HASHES)};` };

describe('flags dans le build', () => {
  it('accepte un build propre : flag 1 en commentaire HTML, empreintes dans le JS', () => {
    const page = { path: 'index.html', content: '<!-- aust-1{un} --><html></html>' };
    expect(checkBuiltFlags([page, bundle], FLAGS, HASHES)).toEqual([]);
  });

  it('refuse le flag 1 hors commentaire, ou dans un autre fichier', () => {
    const page = { path: 'index.html', content: '<p>aust-1{un}</p>' };
    const js = { path: 'a.js', content: '"aust-1{un}"' };
    expect(checkBuiltFlags([page, js, bundle], FLAGS, HASHES)).toEqual([
      'flag 1 lisible dans index.html',
      'flag 1 lisible dans a.js',
    ]);
  });

  it.each(variants('aust-1{deux}'))('repère un flag sous la forme %s', (form) => {
    const js = { path: 'b.js', content: `x="${form}"` };
    expect(checkBuiltFlags([js, bundle], FLAGS, HASHES)).toContain('flag 2 lisible dans b.js');
  });

  it('exige les empreintes dans le JS livré', () => {
    expect(checkBuiltFlags([], FLAGS, HASHES)).toHaveLength(3);
  });
});
