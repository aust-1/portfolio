// En dev et en preview, Vite sert les .txt en « text/plain » sans charset : le navigateur retombe
// alors sur Windows-1252 et les accents de security.txt s'affichent mal. Même règle que
// infra/Caddyfile.site, pour que le local se comporte comme la production.
import type { ServerResponse } from 'node:http';
import type { Connect, Plugin } from 'vite';

const TEXT_PATHS = new Set(['/.well-known/security.txt', '/pgp.asc']);
const CONTENT_TYPE = 'text/plain; charset=utf-8';

function forceCharset(res: ServerResponse) {
  const writeHead = res.writeHead.bind(res) as (...args: unknown[]) => ServerResponse;
  res.writeHead = ((...args: unknown[]) => {
    // Le serveur statique passe ses en-têtes à writeHead : ils écraseraient un simple setHeader.
    const headers = args.find((a) => a && typeof a === 'object' && !Array.isArray(a));
    if (headers) {
      for (const key of Object.keys(headers)) {
        if (key.toLowerCase() === 'content-type') delete (headers as Record<string, unknown>)[key];
      }
    }
    res.setHeader('Content-Type', CONTENT_TYPE);
    return writeHead(...args);
  }) as typeof res.writeHead;
}

const middleware: Connect.NextHandleFunction = (req, res, next) => {
  const path = new URL(req.url ?? '/', 'http://localhost').pathname;
  if (TEXT_PATHS.has(path)) forceCharset(res);
  next();
};

export function textCharsetPlugin(): Plugin {
  return {
    name: 'text-charset',
    configureServer: (server) => void server.middlewares.use(middleware),
    configurePreviewServer: (server) => void server.middlewares.use(middleware),
  };
}
