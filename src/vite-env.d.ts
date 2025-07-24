/// <reference types="vite/client" />

// Extend the ImportMetaEnv interface for environment variables
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_API_URL?: string;
  readonly VITE_ENABLE_PWA?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Declare module for image imports
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
