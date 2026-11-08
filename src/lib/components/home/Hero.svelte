<script lang="ts">
  import CropMarks from '#lib/components/motifs/CropMarks.svelte';
  import Dimension from '#lib/components/motifs/Dimension.svelte';
  import { SITE } from '#lib/site.ts';
  import { openTerminal } from '#lib/terminal/state.svelte.ts';

  let { nextStep }: { nextStep?: { label: string; href: string } } = $props();
</script>

<section class="hero" aria-labelledby="hero-name">
  <CropMarks inset={16} />
  <div class="container">
    <div class="frame">
      <div class="top">
        <div class="name-zone">
          <p class="t-label sub">{SITE.subtitle}</p>
          <h1 id="hero-name" class="t-display name">
            <span>Eliott</span>
            <span>Roussille<span class="bar" aria-hidden="true"></span></span>
          </h1>
          <div class="dim"><Dimension label="@aust-1" tone="signal" /></div>
        </div>

        <picture class="photo no-grain">
          <source srcset="/media/eliott-roussille.avif" type="image/avif" />
          <source srcset="/media/eliott-roussille.webp" type="image/webp" />
          <img
            src="/media/eliott-roussille.jpg"
            alt="Eliott Roussille, bras croisés, dans une passerelle vitrée"
            width="800"
            height="800"
            fetchpriority="high"
          />
        </picture>
      </div>

      <div class="blocks">
        <div class="ink">
          <p class="t-hook hook">{SITE.hook}</p>
          <p class="t-lead lead">
            Je développe des applications full-stack, j'administre l'infrastructure d'une
            association et je conçois des défis de CTF. En parallèle, je pilote l'équipe Coupe de
            France de Robotique de DaVinciBot.
          </p>
          <div class="actions">
            <a class="cta" href="/cv.pdf" download="CV-Eliott-Roussille.pdf">Télécharger mon CV</a>
            <a class="link-mono gh" href={SITE.github}>GitHub</a>
            <button class="invite t-mono" type="button" onclick={openTerminal}>
              <span aria-hidden="true">&gt;</span> tape <kbd>help</kbd>
            </button>
          </div>
        </div>

        <div class="blue">
          {#if nextStep}
            <a class="next t-ui" href={nextStep.href}>{nextStep.label}</a>
          {/if}
          <dl>
            <div>
              <dt class="t-label">formation</dt>
              <dd>ESILV × EMLV</dd>
            </div>
            <div>
              <dt class="t-label">domaines</dt>
              <dd>cyber offensive et défensive, gestion de projet</dd>
            </div>
            <div>
              <dt class="t-label">langages</dt>
              <dd>TypeScript, Python, C++, C#</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .hero {
    position: relative;
    padding-block: 72px 56px;
  }
  .frame {
    position: relative;
  }
  .top {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: var(--gutter);
    align-items: end;
  }
  .name-zone {
    grid-column: 1 / span 8;
    background-image: radial-gradient(circle, var(--er-dot) 0.7px, transparent 0.8px);
    background-size: 18px 18px;
    padding: 0 0 8px;
  }
  .sub {
    margin-bottom: 20px;
  }
  .name span {
    display: block;
  }
  .bar {
    display: inline-block !important;
    width: 0.5em;
    height: 0.09em;
    margin-left: 0.04em;
    background: var(--er-signal);
    vertical-align: baseline;
    animation: blink 1.1s steps(1) infinite;
  }
  @keyframes blink {
    50% {
      opacity: 0;
    }
  }
  .dim {
    margin-top: 18px;
    max-width: 640px;
  }
  .photo {
    grid-column: 9 / span 4;
  }
  .photo img {
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
    filter: grayscale(0.15) contrast(1.02);
  }

  .blocks {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    margin-top: 40px;
  }
  .ink {
    grid-column: 1 / span 7;
    background: var(--er-ink);
    color: var(--er-bg);
    padding: clamp(24px, 4vw, 40px);
  }
  .hook {
    color: var(--er-bg);
    max-width: 22ch;
  }
  .lead {
    color: color-mix(in srgb, var(--er-bg) 78%, var(--er-ink));
    margin-top: 18px;
    max-width: 52ch;
    font-size: 18px;
  }
  .actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 14px 24px;
    margin-top: 28px;
  }
  .gh {
    color: var(--er-bg);
  }
  .gh:hover {
    color: var(--er-signal);
  }
  .invite {
    background: none;
    border: 0;
    padding: 6px 0;
    color: color-mix(in srgb, var(--er-bg) 70%, var(--er-ink));
    font-size: 14px;
    cursor: pointer;
  }
  .invite:hover {
    color: var(--er-signal);
  }
  kbd {
    font-family: var(--font-mono);
    color: var(--er-signal);
  }

  .blue {
    grid-column: 8 / span 5;
    position: relative;
    background: var(--er-blue);
    color: var(--er-on-blue);
    padding: clamp(24px, 4vw, 40px);
    padding-top: 56px;
  }
  .next {
    position: absolute;
    top: 0;
    left: 0;
    transform: translateY(-50%);
    background: var(--er-signal);
    color: var(--er-on-signal);
    padding: 10px 14px;
    text-decoration: none;
    font-size: 13px;
  }
  dl {
    display: grid;
    gap: 18px;
    margin: 0;
  }
  dt {
    color: color-mix(in srgb, var(--er-on-blue) 75%, var(--er-blue));
    margin-bottom: 4px;
  }
  dd {
    margin: 0;
    font: 700 clamp(19px, 1.9vw, 24px) / 1.2 var(--font-display);
    letter-spacing: -0.02em;
  }

  @media (max-width: 880px) {
    .hero {
      padding-top: 40px;
    }
    .name-zone,
    .photo,
    .ink,
    .blue {
      grid-column: 1 / -1;
    }
    .photo {
      max-width: 280px;
      order: -1;
    }
    .blue {
      margin-top: 28px;
    }
  }
</style>
