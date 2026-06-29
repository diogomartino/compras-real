declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      CLIENT_URL: string;

      POSTGRES_USER: string;
      POSTGRES_PASSWORD: string;
      POSTGRES_HOST: string;
      POSTGRES_PORT: string;
      POSTGRES_DB: string;

      JWT_SECRET: string;

      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      RESEND_API_KEY?: string;
      EMAIL_FROM?: string;
    }
  }
}

export {};
