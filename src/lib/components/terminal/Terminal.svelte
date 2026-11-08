<script lang="ts">
  import { tick } from 'svelte';
  import { goto } from '$app/navigation';
  import { closeTerminal, openTerminal, terminal } from '#lib/terminal/state.svelte.ts';
  import { complete, run, type Line, type TermContext } from '#lib/terminal/interpreter.ts';

  let { context }: { context: Omit<TermContext, 'cwd'> } = $props();

  const WELCOME: Line[] = [
    { text: 'ER_ terminal · eliott-roussille.fr', tone: 'signal' },
    { text: 'Tapez help pour la liste des commandes. Échap pour fermer.', tone: 'muted' },
  ];

  let entries = $state<{ prompt?: string; lines: Line[] }[]>([{ lines: WELCOME }]);
  let input = $state('');
  let cwd = $state('~');
  let history: string[] = [];
  let cursor = -1;
  let busy = $state(false);
  let field: HTMLInputElement | undefined = $state();
  let screen: HTMLElement | undefined = $state();
  let opener: Element | null = null;

  $effect(() => {
    if (terminal.open) {
      opener = document.activeElement;
      tick().then(() => field?.focus());
    }
  });

  function close() {
    closeTerminal();
    if (opener instanceof HTMLElement) opener.focus();
  }

  async function submit(e: SubmitEvent) {
    e.preventDefault();
    if (busy) return;
    const raw = input;
    input = '';
    if (raw.trim()) history = [raw, ...history].slice(0, 50);
    cursor = -1;
    busy = true;
    const out = await run(raw, { ...context, cwd });
    busy = false;
    const prompt = `${cwd}$ ${raw.slice(0, 200)}`;
    if (out.clear) entries = [];
    else entries = [...entries, { prompt, lines: out.lines }];
    if (out.cwd) cwd = out.cwd;
    await tick();
    screen?.scrollTo({ top: screen.scrollHeight });
    if (out.close) close();
    if (out.external) window.open(out.external, '_blank', 'noopener');
    if (out.navigate) await goto(out.navigate);
  }

  function keydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      input = complete(input, { ...context, cwd });
    } else if (e.key === 'ArrowUp' && history.length) {
      e.preventDefault();
      cursor = Math.min(cursor + 1, history.length - 1);
      input = history[cursor] ?? '';
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      cursor = Math.max(cursor - 1, -1);
      input = cursor === -1 ? '' : (history[cursor] ?? '');
    }
  }

  // Raccourcis globaux : ² (AZERTY) ou ` (QWERTY) et Ctrl/Cmd+K, hors champs de saisie.
  function globalKey(e: KeyboardEvent) {
    const typing =
      e.target instanceof HTMLElement && e.target.closest('input, textarea, [contenteditable]');
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (terminal.open) close();
      else openTerminal();
    } else if (!typing && (e.key === '²' || e.key === '`') && !terminal.open) {
      e.preventDefault();
      openTerminal();
    }
  }
</script>

<svelte:window onkeydown={globalKey} />

{#if terminal.open}
  <div class="term" role="dialog" aria-modal="false" aria-label="Terminal">
    <div class="bar t-mono">
      <span><span class="u">ER_</span> terminal</span>
      <button type="button" onclick={close} aria-label="Fermer le terminal">fermer · échap</button>
    </div>
    <div class="screen t-mono" bind:this={screen} aria-live="polite">
      {#each entries as entry, i (i)}
        {#if entry.prompt}<p class="prompt">{entry.prompt}</p>{/if}
        {#each entry.lines as line, j (j)}
          <p class={line.tone}>
            {#if line.href}<a href={line.href} target="_blank" rel="noopener">{line.text}</a
              >{:else}<span class="txt">{line.text}</span>{/if}
          </p>
        {/each}
      {/each}
    </div>
    <form class="input t-mono" onsubmit={submit}>
      <label for="term-input" class="prompt">{cwd}$</label>
      <input
        id="term-input"
        bind:this={field}
        bind:value={input}
        onkeydown={keydown}
        autocomplete="off"
        autocapitalize="off"
        spellcheck="false"
        maxlength="200"
        disabled={busy}
      />
    </form>
  </div>
{/if}

<style>
  .term {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 60;
    height: min(56vh, 520px);
    display: flex;
    flex-direction: column;
    background: var(--er-ink);
    color: var(--er-bg);
    border-top: 6px solid var(--er-signal);
  }
  .bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px var(--margin);
    font-size: 12px;
    color: color-mix(in srgb, var(--er-bg) 70%, var(--er-ink));
  }
  .u {
    color: var(--er-signal);
    font-weight: 800;
  }
  .bar button {
    background: none;
    border: 0;
    color: inherit;
    font: inherit;
    cursor: pointer;
    padding: 6px 0;
  }
  .bar button:hover {
    color: var(--er-signal);
  }
  .screen {
    flex: 1;
    overflow-y: auto;
    padding: 8px var(--margin);
    font-size: 14px;
    line-height: 1.6;
    overflow-wrap: anywhere;
  }
  /* Espaces conservés (alignement de help), mais seulement dans le texte des lignes. */
  .txt,
  .screen a,
  .prompt {
    white-space: pre-wrap;
  }
  .screen p {
    margin: 0;
  }
  .prompt {
    color: var(--er-signal);
  }
  .muted {
    color: color-mix(in srgb, var(--er-bg) 60%, var(--er-ink));
  }
  .signal {
    color: var(--er-signal);
  }
  .error {
    color: color-mix(in srgb, var(--er-signal) 75%, var(--er-bg));
  }
  .ok {
    color: var(--er-bg);
    font-weight: 800;
  }
  .screen a {
    color: var(--er-signal);
  }
  .input {
    display: flex;
    gap: 10px;
    align-items: center;
    padding: 12px var(--margin) 16px;
    font-size: 14px;
  }
  input {
    flex: 1;
    min-width: 0;
    background: transparent;
    border: 0;
    color: var(--er-bg);
    font: inherit;
    caret-color: var(--er-signal);
    outline: none;
  }
</style>
