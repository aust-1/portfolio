// Empreintes SHA-256 des 5 flags de production (valeurs dans le .env du VPS, jamais versionnées).
// Ordre : 1 commentaire HTML, 2 en-tête X-Flag, 3 /admin, 4 Konami, 5 commande cachée du terminal.
export const PROD_HASHES = [
  '3742e722075e909b665298ff3b25f27e5da3718afd56bc61eddc18ec6402ced7',
  'f206348dfaed64de358da4ccd563bd71811f206c08ecc8168cb69f63828774c0',
  'b2dd60de511515bc21e0aaca4e0c0a855aabdfe0174d5ed198eda13bf15ea06e',
  'eceb146e8848e7aeb774d1ed538e5aa56a5b28d905fc6c5127326d1b8baea5d3',
  '98dae0227a56ebb39f36b8f4c26be1750f453765f8cab73f3e18ac12abacc837',
] as const;
