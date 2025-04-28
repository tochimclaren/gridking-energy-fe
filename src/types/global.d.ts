interface ImportMetaEnv {
    readonly VITE_BASE_URL: string;
    // You can add more variables here
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }