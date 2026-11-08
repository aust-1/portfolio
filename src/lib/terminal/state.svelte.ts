// État partagé du terminal : ouvert depuis la nav, le raccourci clavier ou la page d'accueil.
export const terminal = $state({ open: false });

export function openTerminal(): void {
  terminal.open = true;
}

export function closeTerminal(): void {
  terminal.open = false;
}
