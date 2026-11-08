// Flags au build : les valeurs viennent de l'environnement (.env du VPS, arguments Docker), jamais
// du dépôt. Le dépôt ne contient que leurs empreintes (src/lib/flags/hashes.ts).
import { createHash } from 'node:crypto';
import { loadEnv, type Plugin } from 'vite';
import { obfuscate } from '../src/lib/flags/obfuscate.ts';
import { PROD_HASHES } from '../src/lib/flags/hashes.ts';

const COUNT = 5;
const sha = (s: string) => createHash('sha256').update(s).digest('hex');

export type ResolvedFlags = { mode: 'prod' | 'dev'; flags: string[]; hashes: string[] };

export function resolveFlags(
  env: Record<string, string | undefined>,
  prodHashes: readonly string[],
): ResolvedFlags {
  const values = Array.from({ length: COUNT }, (_, i) => env[`FLAG_${i + 1}`]?.trim() || undefined);

  if (values.every((v) => v === undefined)) {
    // Dev et CI : flags factices, cohérents entre eux, jamais ceux de production.
    const flags = values.map((_, i) => `aust-1{dev_flag_${i + 1}}`);
    return { mode: 'dev', flags, hashes: flags.map(sha) };
  }

  values.forEach((v, i) => {
    if (v === undefined) throw new Error(`FLAG_${i + 1} manquant : les 5 flags vont ensemble.`);
    if (sha(v) !== prodHashes[i]) {
      throw new Error(
        `FLAG_${i + 1} ne correspond pas à son empreinte dans src/lib/flags/hashes.ts.`,
      );
    }
  });
  const flags = values as string[];
  return { mode: 'prod', flags, hashes: [...prodHashes] };
}

/** Graine d'obfuscation : change à chaque build, sans importance pour la sécurité. */
const SEED = Math.floor(Math.random() * 1000) + 1;

const CLIENT_ID = 'virtual:flags';
const SERVER_ID = 'virtual:flags-server';

export function flagsPlugin(): Plugin {
  let resolved: ResolvedFlags;
  return {
    name: 'portfolio-flags',
    configResolved(config) {
      const env = { ...loadEnv(config.mode, config.root, 'FLAG_'), ...process.env };
      resolved = resolveFlags(env, PROD_HASHES);
      if (config.command === 'build') {
        config.logger.info(`flags : ${resolved.mode === 'prod' ? 'production' : 'factices (dev)'}`);
      }
    },
    resolveId(id) {
      if (id === CLIENT_ID || id === SERVER_ID) return `\0${id}`;
    },
    load(id) {
      const [, , admin, konami, backdoor] = resolved.flags;
      if (id === `\0${CLIENT_ID}`) {
        // Côté navigateur : empreintes + trois flags obfusqués, révélés à la demande.
        return [
          `export const HASHES = ${JSON.stringify(resolved.hashes)};`,
          `export const SEED = ${SEED};`,
          `export const PAYLOADS = ${JSON.stringify({
            admin: obfuscate(admin!, SEED),
            konami: obfuscate(konami!, SEED),
            backdoor: obfuscate(backdoor!, SEED),
          })};`,
        ].join('\n');
      }
      if (id === `\0${SERVER_ID}`) {
        // Côté prérendu uniquement : le flag du commentaire HTML.
        return `export const COMMENT_FLAG = ${JSON.stringify(resolved.flags[0])};`;
      }
    },
  };
}
