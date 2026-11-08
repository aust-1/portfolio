<script lang="ts">
  // M4 · Points : pas de 18 px, point de 1,4 px. Derrière le nom et les couvertures, jamais sous du
  // texte courant. Une zone par écran.
  import type { Snippet } from 'svelte';
  let { children, class: klass = '' }: { children?: Snippet; class?: string } = $props();
</script>

<div class="dots {klass}">{@render children?.()}</div>

<style>
  .dots {
    background-image: radial-gradient(circle, var(--er-dot) 0.7px, transparent 0.8px);
    background-size: 18px 18px;
    background-position: 9px 9px;
  }
</style>
