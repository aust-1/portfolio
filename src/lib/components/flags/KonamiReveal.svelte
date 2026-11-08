<script lang="ts">
  import { revealFlag } from '#lib/flags/client.ts';
  import { konamiTracker } from '#lib/flags/konami.ts';
  import { openTerminal } from '#lib/terminal/state.svelte.ts';

  const push = konamiTracker();
  let flag = $state<string | null>(null);

  function key(e: KeyboardEvent) {
    const typing =
      e.target instanceof HTMLElement && e.target.closest('input, textarea, [contenteditable]');
    if (!typing && push(e.key)) flag = revealFlag('konami');
  }
</script>

<svelte:window onkeydown={key} />

{#if flag}
  <div class="reveal" role="status">
    <p class="t-label">↑ ↑ ↓ ↓ ← → ← → B A · code accepté</p>
    <p class="flag t-mono">{flag}</p>
    <div class="actions">
      <button class="cta" type="button" onclick={openTerminal}>Ouvrir le terminal</button>
      <button class="close t-ui" type="button" onclick={() => (flag = null)}>fermer</button>
    </div>
  </div>
{/if}

<style>
  .reveal {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 70;
    width: min(560px, calc(100vw - 32px));
    padding: 28px;
    background: var(--er-signal);
    color: var(--er-on-signal);
  }
  .reveal .t-label {
    color: inherit;
  }
  .flag {
    margin-top: 14px;
    font-size: 18px;
    font-weight: 800;
    overflow-wrap: anywhere;
    user-select: all;
  }
  .actions {
    display: flex;
    gap: 16px;
    align-items: center;
    margin-top: 20px;
  }
  .reveal .cta {
    background: var(--er-ink);
    color: var(--er-bg);
  }
  .close {
    background: none;
    border: 0;
    color: inherit;
    cursor: pointer;
    text-decoration: underline;
  }
</style>
