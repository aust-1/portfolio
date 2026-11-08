<script lang="ts">
  import '#lib/styles/base.css';
  import Footer from '#lib/components/layout/Footer.svelte';
  import Nav from '#lib/components/layout/Nav.svelte';
  import type { LayoutProps } from './$types';

  let { children }: LayoutProps = $props();
</script>

<a class="skip t-ui" href="#contenu">Aller au contenu</a>
<Nav />
<main id="contenu">
  {@render children()}
</main>
<Footer />

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
