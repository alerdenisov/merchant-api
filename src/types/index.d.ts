declare module NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'production' | 'development' | 'staging';
    PORT: number;
    CURRENCIES: string[];
  }
}
