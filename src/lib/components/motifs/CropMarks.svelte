<script lang="ts">
  // M12 · Repères : croix de 24 px, trait 2 px, aux coins du hero ou d'une couverture. Un jeu par écran.
  let { inset = 16 }: { inset?: number } = $props();
</script>

<div class="marks" style:--inset="{inset}px" aria-hidden="true">
  <span class="tl"></span><span class="tr"></span><span class="bl"></span><span class="br"></span>
</div>

<style>
  .marks {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  span {
    position: absolute;
    width: 24px;
    height: 24px;
    color: var(--er-ink);
  }
  span::before,
  span::after {
    content: '';
    position: absolute;
    background: currentColor;
  }
  span::before {
    left: 11px;
    top: 0;
    width: 2px;
    height: 24px;
  }
  span::after {
    top: 11px;
    left: 0;
    height: 2px;
    width: 24px;
  }
  .tl {
    top: var(--inset);
    left: var(--inset);
  }
  .tr {
    top: var(--inset);
    right: var(--inset);
  }
  .bl {
    bottom: var(--inset);
    left: var(--inset);
  }
  .br {
    bottom: var(--inset);
    right: var(--inset);
  }
</style>
