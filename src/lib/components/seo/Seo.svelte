<script lang="ts">
  import { page } from '$app/state';
  import { canonicalUrl, OG_IMAGE } from '#lib/seo.ts';
  import { SITE } from '#lib/site.ts';

  // Titre, description, URL canonique, Open Graph et carte Twitter/X d'une page : un lien partagé
  // (LinkedIn, Discord…) s'affiche avec son titre, son résumé et une image.
  let {
    title,
    description,
    image,
    imageAlt,
    type = 'website',
  }: {
    title: string;
    description: string;
    /** Chemin absolu d'une image du site (couverture d'un projet) ; image par défaut sinon. */
    image?: string;
    imageAlt?: string;
    type?: 'website' | 'profile' | 'article';
  } = $props();

  const url = $derived(canonicalUrl(page.url.pathname));
  const img = $derived(
    image ? new URL(image, SITE.url).href : new URL(OG_IMAGE.src, SITE.url).href,
  );
  const alt = $derived(image ? (imageAlt ?? title) : OG_IMAGE.alt);
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={url} />
  <meta property="og:type" content={type} />
  <meta property="og:site_name" content={SITE.name} />
  <meta property="og:locale" content="fr_FR" />
  <meta property="og:url" content={url} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={img} />
  <meta property="og:image:alt" content={alt} />
  {#if !image}
    <meta property="og:image:width" content={String(OG_IMAGE.width)} />
    <meta property="og:image:height" content={String(OG_IMAGE.height)} />
  {/if}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={img} />
  <meta name="twitter:image:alt" content={alt} />
</svelte:head>
