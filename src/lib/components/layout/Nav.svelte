<script lang="ts">
  import { page } from '$app/state';
  import { openTerminal } from '#lib/terminal/state.svelte.ts';
  import Monogram from './Monogram.svelte';
  import ThemeToggle from './ThemeToggle.svelte';

  const LINKS = [
    { href: '/projets', label: 'Projets' },
    { href: '/parcours', label: 'Parcours' },
    { href: '/competences', label: 'Compétences' },
    { href: '/a-propos', label: 'À propos' },
  ];

  let menuOpen = $state(false);
  const isActive = (href: string) =>
    page.url.pathname === href || page.url.pathname.startsWith(`${href}/`);
</script>

<header class="nav own-grain">
  <div class="container bar">
    <a class="home" href="/" aria-label="Accueil, Eliott Roussille"><Monogram /></a>

    <button
      class="burger t-ui"
      type="button"
      aria-expanded={menuOpen}
      aria-controls="nav-links"
      onclick={() => (menuOpen = !menuOpen)}
    >
      {menuOpen ? 'fermer' : 'menu'}
    </button>

    <nav id="nav-links" class="links" class:open={menuOpen} aria-label="Navigation principale">
      <ul>
        {#each LINKS as link (link.href)}
          <li>
            <a
              class="t-ui"
              href={link.href}
              aria-current={isActive(link.href) ? 'page' : undefined}
              onclick={() => (menuOpen = false)}>{link.label}</a
            >
          </li>
        {/each}
        <li><a class="t-ui" href="https://docs.eliott-roussille.fr">Docs</a></li>
        <li><ThemeToggle /></li>
        <li>
          <button
            class="term cta"
            type="button"
            onclick={() => {
              menuOpen = false;
              openTerminal();
            }}
            aria-label="Ouvrir le terminal (raccourci : touche ²  ou Ctrl+K)">&gt;_ terminal</button
          >
        </li>
      </ul>
    </nav>
  </div>
</header>

<style>
  /* Collante, au-dessus des images (.no-grain, z-index 51) qu'elle recouvre au défilement,
     sous le terminal (60). */
  .nav {
    border-bottom: 2px solid var(--er-ink);
    background: var(--er-bg);
    position: sticky;
    top: 0;
    z-index: 55;
  }
  .bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    min-height: 64px;
  }
  .home {
    text-decoration: none;
    padding: 8px 0;
  }
  ul {
    display: flex;
    align-items: center;
    gap: 28px;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .links a {
    color: var(--er-ink);
    text-decoration: none;
    font-size: 14px;
    padding: 8px 0;
  }
  .links a:hover,
  .links a[aria-current='page'] {
    color: var(--er-signal-text);
  }
  .links a[aria-current='page'] {
    text-decoration: underline;
    text-decoration-thickness: 2px;
    text-underline-offset: 6px;
  }
  .term {
    font-size: 14px;
    padding: 10px 14px;
  }
  .burger {
    display: none;
    background: none;
    border: 0;
    color: var(--er-ink);
    padding: 10px 0;
    cursor: pointer;
  }
  @media (max-width: 880px) {
    .burger {
      display: block;
    }
    .links {
      display: none;
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: var(--er-bg);
      border-bottom: 2px solid var(--er-ink);
      padding: 8px var(--margin) 24px;
    }
    .links.open {
      display: block;
    }
    ul {
      flex-direction: column;
      align-items: flex-start;
      gap: 6px;
    }
    .links a {
      font-size: 18px;
      display: block;
      padding: 10px 0;
    }
  }
</style>
