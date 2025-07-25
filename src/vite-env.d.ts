// src/vite-env.d.ts

/// <reference types="vite/client" />

// Environment variable types for Vite
interface ImportMetaEnv {
  readonly VITE_APP_TITLE:string;
  readonly VITE_API_URL?: string;
  readonly VITE_ENABLE_PWA?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Allow importing image assets
declare module '*.png' {
  const src: string;
  export default src;
}
declare module '*.jpg' {
  const src: string;
  export default src;
}
declare module '*.jpeg' {
  const src: string;
  export default src;
}
declare module '*.svg' {
  const src: string;
  export default src;
}
declare module '*.gif' {
  const src: string;
  export default src;
}
declare module '*.webp' {
  const src: string;
  export default src;
}
