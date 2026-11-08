<script lang="ts">
  import type { Snippet } from 'svelte';

  // Modale native <dialog> : focus piégé et Échap gérés par le navigateur.
  let { open, onclose, children }: { open: boolean; onclose: () => void; children: Snippet } =
    $props();
  let dialog: HTMLDialogElement | undefined = $state();

  $effect(() => {
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  });
</script>

<dialog
  bind:this={dialog}
  aria-labelledby="modal-role-title"
  {onclose}
  onclick={(e) => {
    if (e.target === dialog) onclose();
  }}
>
  <div class="inner">
    <button class="close t-ui" type="button" onclick={onclose}>fermer <kbd>échap</kbd></button>
    {@render children()}
  </div>
</dialog>

<style>
  dialog {
    width: min(960px, calc(100vw - 32px));
    max-height: calc(100vh - 48px);
    padding: 0;
    border: 0;
    background: var(--er-bg);
    color: var(--er-text);
    overflow: auto;
  }
  dialog::backdrop {
    background: color-mix(in srgb, var(--er-ink) 60%, transparent);
  }
  .inner {
    padding: clamp(24px, 4vw, 48px);
    border-top: 8px solid var(--er-signal);
  }
  .close {
    float: right;
    background: var(--er-surface);
    border: 0;
    color: var(--er-ink);
    padding: 8px 12px;
    cursor: pointer;
    font-size: 13px;
    margin: -8px -8px 0 16px;
  }
  .close:hover {
    background: var(--er-ink);
    color: var(--er-bg);
  }
  kbd {
    font-family: var(--font-mono);
    color: var(--er-muted);
    margin-left: 6px;
  }
</style>
