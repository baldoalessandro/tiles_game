/// <reference types="vite/client" />

// eslint-disable-next-line no-unused-vars
declare const __APP_VERSION__: string;

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_DESC: string;
  readonly VITE_APP_COLOR: string;
  // more env variables...
}

// eslint-disable-next-line no-unused-vars
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
