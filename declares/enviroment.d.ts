import { AppDebugMode } from './enviroment-types';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: AppDebugMode;
      POSTGRES_HOST: string;
      POSTGRES_DATABASE: string;
      POSTGRES_PORT: string;
      POSTGRES_USERNAME: string;
      POSTGRES_PASSWORD: string;
      JWT_SECRET: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
