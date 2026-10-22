/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string;
  readonly VITE_CONTACT_ENDPOINT?: string;
  readonly VITE_CONTACT_EMAIL?: string;
  readonly VITE_NOINDEX?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare const __BUILD_YEAR__: number;
