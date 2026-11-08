<script lang="ts">
  // M8 · Cote : trait 1,5 px, butées 2 px, libellé en mono. Sous le nom et sous les chiffres clés.
  let { label, tone = 'muted' }: { label: string; tone?: 'muted' | 'signal' } = $props();
</script>

<div class="dim" class:signal={tone === 'signal'}>
  <span class="stop"></span><span class="line"></span><span class="label t-mono">{label}</span><span
    class="line"
  ></span><span class="stop"></span>
</div>

<style>
  .dim {
    display: flex;
    align-items: center;
    color: var(--er-muted);
    width: 100%;
  }
  .stop {
    width: 2px;
    height: 14px;
    background: currentColor;
    flex: none;
  }
  .line {
    height: 1.5px;
    background: currentColor;
    flex: 1;
  }
  .label {
    font-size: 13px;
    padding-inline: 16px;
    color: var(--er-muted);
    white-space: nowrap;
  }
  .signal .label {
    color: var(--er-signal-text);
  }
</style>
