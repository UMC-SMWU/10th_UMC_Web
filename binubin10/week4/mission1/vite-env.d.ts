/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VIT_TMDB_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
