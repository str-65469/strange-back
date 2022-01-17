import { AppDebugMode } from './enviroment-types';

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: AppDebugMode;

            APP_TITLE: string;
            APP_URL: string;
            DASHBOARD_URL: string;
            MARKUP_URL: string;
            LOL_API_URL: string;

            COOKIE_DOMAIN: string;

            POSTGRES_HOST: string;
            POSTGRES_DATABASE: string;
            POSTGRES_PORT: string;
            POSTGRES_USERNAME: string;
            POSTGRES_PASSWORD: string;

            MAIL_HOST: string;
            MAIL_USE_TLS: string;
            MAIL_PORT: string;
            MAIL_USER: string;
            MAIL_PASS: string;
            MAIL_LOG: string;
            MAIL_POOL: string;

            JWT_SECRET: string;
            JWT_REGISTER_CACHE_SECRET: string;

            PAYPAL_CLIENT_ID: string;
            PAYPAL_SECRET_ID: string;

            FIREBASE_API_KEY: string;
            FIREBASE_AUTH_DOMAIN: string;
            FIREBASE_PROJECT_ID: string;
            FIREBASE_STORAGE_BUCKET: string;
            FIREBASE_MESSAGING_SENDER_ID: string;
            FIREBASE_APP_ID: string;
            FIREBASE_MEASUREMENT_ID: string;
        }
    }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
