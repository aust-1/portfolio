<script lang="ts">
  import { onMount } from 'svelte';
  import { applyTheme, readTheme, type Theme } from '#lib/theme.ts';

  const ORDER: Theme[] = ['system', 'light', 'dark'];
  const LABEL: Record<Theme, string> = { system: 'auto', light: 'clair', dark: 'sombre' };

  let theme = $state<Theme>('system');
  onMount(() => (theme = readTheme()));

  function cycle() {
    theme = ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length] ?? 'system';
    applyTheme(theme);
  }
</script>

<button
  class="toggle t-ui"
  type="button"
  onclick={cycle}
  aria-label="Changer de thème (actuel : {LABEL[theme]})"
>
  thème : {LABEL[theme]}
</button>

<style>
  .toggle {
    background: none;
    border: 0;
    padding: 8px 0;
    color: var(--er-muted);
    cursor: pointer;
    font-size: 13px;
  }
  .toggle:hover {
    color: var(--er-ink);
  }
</style>
