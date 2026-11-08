<script lang="ts">
  // Monogramme « ER_ » : JetBrains Mono 800, tiret bas orange (charte p. 04).
  let { size = 22 }: { size?: number } = $props();
</script>

<span class="mono" style:font-size="{size}px" aria-hidden="true">ER<span class="u">_</span></span>

<style>
  .mono {
    font-family: var(--font-mono);
    font-weight: 800;
    color: var(--er-ink);
    letter-spacing: 0;
    line-height: 1;
  }
  .u {
    color: var(--er-signal);
  }
</style>
