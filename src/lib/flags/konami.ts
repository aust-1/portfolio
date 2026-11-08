export const KONAMI = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
] as const;

/** Renvoie une fonction à appeler à chaque touche ; elle répond true quand la séquence est complète. */
export function konamiTracker(): (key: string) => boolean {
  let recent: string[] = [];
  return (key) => {
    recent = [...recent, key.length === 1 ? key.toLowerCase() : key].slice(-KONAMI.length);
    const done = recent.length === KONAMI.length && recent.every((k, i) => k === KONAMI[i]);
    if (done) recent = [];
    return done;
  };
}
