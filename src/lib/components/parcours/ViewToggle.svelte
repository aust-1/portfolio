<script lang="ts">
  export type View = 'parallele' | 'liste';
  let { view, onchange }: { view: View; onchange: (v: View) => void } = $props();
  const VIEWS: { id: View; label: string }[] = [
    { id: 'parallele', label: 'parallèle' },
    { id: 'liste', label: 'liste' },
  ];
</script>

<div class="toggle t-mono" role="group" aria-label="Vue de la timeline">
  <span class="lbl">vue :</span>
  {#each VIEWS as v (v.id)}
    <button type="button" aria-pressed={view === v.id} onclick={() => onchange(v.id)}
      >{v.label}</button
    >
  {/each}
</div>

<style>
  .toggle {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
  }
  .lbl {
    color: var(--er-muted);
    margin-right: 4px;
  }
  button {
    border: 0;
    background: var(--er-surface);
    color: var(--er-ink);
    padding: 8px 12px;
    font: inherit;
    cursor: pointer;
  }
  button[aria-pressed='true'] {
    background: var(--er-ink);
    color: var(--er-bg);
  }
</style>
