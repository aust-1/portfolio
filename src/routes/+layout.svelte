<script lang="ts">
  import '#lib/styles/base.css';
  import Footer from '#lib/components/layout/Footer.svelte';
  import Nav from '#lib/components/layout/Nav.svelte';
  import KonamiReveal from '#lib/components/flags/KonamiReveal.svelte';
  import Terminal from '#lib/components/terminal/Terminal.svelte';
  import { backdoor, submitFlag } from '#lib/flags/client.ts';
  import type { LayoutProps } from './$types';
  // Polices visibles dès le premier écran de chaque page (titres Inter Tight 900, texte Inter 400,
  // navigation JetBrains Mono 500) : préchargées pour ne pas attendre HTML → CSS → police. Vite
  // versionne ces URL comme celles des @font-face de base.css (même fichier, même empreinte).
  import interTight900 from '@fontsource/inter-tight/files/inter-tight-latin-900-normal.woff2?url';
  import inter400 from '@fontsource/inter/files/inter-latin-400-normal.woff2?url';
  import mono500 from '@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff2?url';

  const PRELOADED_FONTS = [interTight900, inter400, mono500];

  let { children, data }: LayoutProps = $props();
</script>

<svelte:head>
  {#each PRELOADED_FONTS as href (href)}
    <link rel="preload" as="font" type="font/woff2" {href} crossorigin="anonymous" />
  {/each}
</svelte:head>

<a class="skip t-ui" href="#contenu">Aller au contenu</a>
<Nav />
<main id="contenu">
  {@render children()}
</main>
<Footer />
<Terminal context={{ ...data.terminal, submit: submitFlag, backdoor }} />
<KonamiReveal />

<style>
  .skip {
    position: absolute;
    left: 16px;
    top: -60px;
    z-index: 100;
    background: var(--er-signal);
    color: var(--er-on-signal);
    padding: 10px 14px;
  }
  .skip:focus {
    top: 12px;
  }
</style>
