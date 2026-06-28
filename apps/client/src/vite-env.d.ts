/// <reference types="vite/client" />

declare global {
  const VITE_APP_VERSION: string;

  interface ImportMetaEnv {
    readonly VITE_API_URL?: string;
  }
}

export {};
