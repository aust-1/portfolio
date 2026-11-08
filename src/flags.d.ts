// Modules virtuels fournis par scripts/flags.ts au build.
declare module 'virtual:flags' {
  export const HASHES: string[];
  export const SEED: number;
  export const PAYLOADS: { admin: number[]; konami: number[]; backdoor: number[] };
}

declare module 'virtual:flags-server' {
  /** Flag 1 : uniquement dans le commentaire HTML, jamais dans le bundle client. */
  export const COMMENT_FLAG: string;
}
