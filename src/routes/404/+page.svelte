<script lang="ts">
  // Prérendue en build/404.html : Caddy la sert (statut 404) pour toute URL inconnue. Le HTML
  // contient déjà le terminal, le titre et noindex, sans attendre le JavaScript.
  import { setContext } from 'svelte';
  import ErrorPage from '../+error.svelte';

  // Le statut de cette page est 200 : la page d'erreur affiche 404 quand elle est rendue ici.
  setContext('page-404', true);
</script>

<ErrorPage />
