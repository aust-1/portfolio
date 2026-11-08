<script lang="ts">
  import { revealFlag } from '#lib/flags/client.ts';

  // Fausse mire de connexion (piège signalé dans robots.txt). Rien n'est envoyé ni conservé :
  // pas d'action de formulaire, pas de requête, les champs sont vidés à la soumission.
  let user = $state('');
  let pass = $state('');
  let log = $state<string[]>([]);
  let flag = $state<string | null>(null);

  function login(e: SubmitEvent) {
    e.preventDefault();
    const shown = user.trim().slice(0, 32) || 'anonyme';
    user = '';
    pass = '';
    log = [
      `[auth] tentative de connexion : ${shown}`,
      '[auth] vérification du mot de passe... ok',
      "[auth] vérification de l'adresse IP... localisée (non, on plaisante, rien n'est enregistré)",
      "[auth] accès accordé au panneau... qui n'existe pas.",
    ];
    flag = revealFlag('admin');
  }
</script>

<svelte:head>
  <title>Administration · Eliott Roussille</title>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="container page">
  <div class="box">
    <p class="t-label">zone réservée</p>
    <h1 class="t-title">Connexion administrateur</h1>
    <form onsubmit={login} autocomplete="off">
      <label class="t-ui" for="u">identifiant</label>
      <input id="u" bind:value={user} maxlength="64" autocomplete="off" spellcheck="false" />
      <label class="t-ui" for="p">mot de passe</label>
      <input id="p" type="password" bind:value={pass} maxlength="64" autocomplete="off" />
      <button class="cta" type="submit">Se connecter</button>
    </form>

    {#if log.length}
      <div class="log t-mono" role="status">
        {#each log as line (line)}<p>{line}</p>{/each}
        {#if flag}<p class="flag">{flag}</p>
          <p class="muted">Bien joué : robots.txt n'est pas un contrôle d'accès. → submit</p>{/if}
      </div>
    {/if}
  </div>
</div>

<style>
  .page {
    padding-top: 72px;
  }
  .box {
    max-width: 520px;
  }
  h1 {
    margin-top: 10px;
  }
  form {
    display: grid;
    gap: 8px;
    margin-top: 28px;
  }
  label {
    font-size: 13px;
    margin-top: 10px;
  }
  input {
    font: 500 16px / 1.2 var(--font-mono);
    padding: 12px 14px;
    border: 0;
    background: var(--er-surface);
    color: var(--er-ink);
  }
  .cta {
    justify-self: start;
    margin-top: 18px;
  }
  .log {
    margin-top: 32px;
    padding: 20px;
    background: var(--er-ink);
    color: var(--er-bg);
    font-size: 13px;
    line-height: 1.7;
    overflow-wrap: anywhere;
  }
  .flag {
    color: var(--er-signal);
    font-weight: 800;
    margin-top: 10px;
    user-select: all;
  }
  .muted {
    color: color-mix(in srgb, var(--er-bg) 65%, var(--er-ink));
  }
</style>
