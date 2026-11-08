<script lang="ts">
  // M13 · Sommaire : points de conduite en mono, section active en orange. Pages longues.
  let { items, active }: { items: { id: string; label: string; n: number }[]; active?: string } =
    $props();
</script>

<nav class="toc" aria-label="Sommaire">
  <ol>
    {#each items as item (item.id)}
      <li class:active={item.id === active}>
        <a href="#{item.id}">
          <span class="num">§ {item.n}</span>
          <span class="label">{item.label}</span>
          <span class="leader" aria-hidden="true"></span>
        </a>
      </li>
    {/each}
  </ol>
</nav>

<style>
  ol {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 10px;
    font: 500 14px / 1.3 var(--font-mono);
  }
  a {
    display: flex;
    align-items: baseline;
    gap: 8px;
    color: var(--er-ink);
    text-decoration: none;
  }
  .num {
    font-weight: 800;
    flex: none;
  }
  .leader {
    flex: 1;
    border-bottom: 2px dotted var(--er-dot);
    transform: translateY(-4px);
    min-width: 16px;
  }
  .active a,
  a:hover {
    color: var(--er-signal-text);
  }
</style>
