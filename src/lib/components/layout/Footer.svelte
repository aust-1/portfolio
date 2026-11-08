<script lang="ts">
  import { PGP_FINGERPRINT, SITE } from '#lib/site.ts';
  import Monogram from './Monogram.svelte';
</script>

<footer class="footer">
  <div class="container grid">
    <div class="sign">
      <Monogram size={28} />
      <p class="t-ui">Eliott Roussille <span class="handle">@aust-1</span></p>
    </div>

    <nav aria-label="Liens de pied de page">
      <ul class="t-ui">
        <li><a href={SITE.docs}>Documentation</a></li>
        <li><a href="/ce-site">Comment ce site est fait</a></li>
        <li><a href="/liens">Ressources recommandées</a></li>
        <li><a href="/cv">CV</a></li>
        <li><a href="/.well-known/security.txt" data-sveltekit-reload>security.txt</a></li>
        <li><a href="/pgp.asc" data-sveltekit-reload>Clé PGP</a></li>
      </ul>
    </nav>

    <div class="meta">
      <p class="t-label">Empreinte PGP</p>
      <p class="fp t-mono">{PGP_FINGERPRINT}</p>
      <p class="hint t-mono">cinq choses sont cachées ici. <kbd>ls -a</kbd> est un bon début_</p>
    </div>
  </div>
</footer>

<style>
  .footer {
    margin-top: 120px;
    border-top: 2px solid var(--er-ink);
    padding-block: 40px 56px;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 32px var(--gutter);
  }
  .sign {
    grid-column: span 3;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .handle {
    color: var(--er-signal-text);
  }
  nav {
    grid-column: span 4;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 10px;
    font-size: 14px;
  }
  ul a {
    color: var(--er-ink);
    text-decoration: none;
  }
  ul a:hover {
    color: var(--er-signal-text);
    text-decoration: underline;
  }
  .meta {
    grid-column: span 5;
    display: grid;
    gap: 8px;
    align-content: start;
  }
  .fp {
    font-size: 13px;
    color: var(--er-text);
    overflow-wrap: anywhere;
  }
  .hint {
    margin-top: 16px;
    font-size: 13px;
    color: var(--er-muted);
  }
  kbd {
    font-family: var(--font-mono);
    background: var(--er-surface);
    padding: 1px 6px;
    color: var(--er-ink);
  }
  @media (max-width: 880px) {
    .sign,
    nav,
    .meta {
      grid-column: 1 / -1;
    }
  }
</style>
