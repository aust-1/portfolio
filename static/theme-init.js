// Applique le thème mémorisé avant le premier rendu, pour éviter un flash clair → sombre.
// Fichier statique (et non script inline) pour rester compatible avec la CSP par empreintes.
try {
  var t = localStorage.getItem('er-theme');
  if (t === 'light' || t === 'dark') document.documentElement.dataset.theme = t;
} catch (e) {
  /* stockage indisponible : on suit le système */
}
