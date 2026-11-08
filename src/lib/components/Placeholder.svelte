<script lang="ts">
  // Emplacement d'un média pas encore fourni (liste : docs/a-remplacer.md). Sobre en production :
  // un aplat neutre, des points et une légende en mono, jamais une fausse image.
  let { label, ratio = '16 / 9' }: { label: string; ratio?: string } = $props();
</script>

<figure class="ph" style:aspect-ratio={ratio} role="img" aria-label="Image à venir : {label}">
  <figcaption class="t-mono">{label}<br /><span>image à venir_</span></figcaption>
</figure>

<style>
  .ph {
    display: grid;
    place-items: center;
    width: 100%;
    background-color: var(--er-surface);
    background-image: radial-gradient(circle, var(--er-dot) 0.7px, transparent 0.8px);
    background-size: 18px 18px;
    padding: 24px;
  }
  figcaption {
    font-size: 13px;
    line-height: 1.5;
    color: var(--er-muted);
    text-align: center;
    max-width: 32ch;
  }
  span {
    color: var(--er-signal-text);
  }
</style>
