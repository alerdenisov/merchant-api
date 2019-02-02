declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'production' | 'development' | 'staging';
    PORT: number;
    CURRENCIES: string[];

    DATABASE_TYPE: string;
    DATABASE_USER?: string;
    DATABASE_PASSWORD?: string;
    DATABASE_DB: string;
    DATABASE_HOST: string;
    DATABASE_PORT: number;

    MICROSERVICES_RETRY_ATTEMPTS: number;
    MICROSERVICES_RETRY_DELAYS: number;

    REDIS_URL: string;
  }
}
