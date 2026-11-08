// ASCII art en tête du HTML (spec §10) : signature, invitation à chercher, indice vers l'en-tête
// X-Flag, et le flag d'échauffement juste en dessous.
export function asciiBanner(commentFlag: string): string {
  const art = String.raw`
  ███████╗██████╗
  ██╔════╝██╔══██╗
  █████╗  ██████╔╝
  ██╔══╝  ██╔══██╗
  ███████╗██║  ██║███████╗
  ╚══════╝╚═╝  ╚═╝╚══════╝

  Eliott Roussille @aust-1

  Tu lis le code source : bon réflexe.
  Cinq flags aust-1{...} sont cachés sur ce site.
  Celui-ci est offert. Pour le suivant, regarde ce que le serveur
  te dit avant même la première ligne de HTML.
  Valide-les dans le terminal : Ctrl+K, puis submit.
`;
  // « -- » est interdit dans un commentaire HTML : on le neutralise par précaution.
  const safe = (s: string) => s.replaceAll('--', '- -');
  return `<!--${safe(art)}-->\n<!-- ${safe(commentFlag)} -->`;
}
