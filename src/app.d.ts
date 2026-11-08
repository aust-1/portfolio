// Voir https://svelte.dev/docs/kit/types#app.d.ts
declare global {
  namespace App {
    interface PageState {
      /** Slug du rôle ouvert en modale depuis la timeline (shallow routing). */
      role?: string;
    }
  }
}

export {};
