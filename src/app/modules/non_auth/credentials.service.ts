import { Injectable } from '@nestjs/common';
import { CredentialsResponse } from 'src/app/schemas/response/credentials/credentials.response';
import { FirebaseCredentialsResponse } from 'src/app/schemas/response/credentials/firebase_credentials.response';

@Injectable()
export class CredentialsService {
    credentials() {
        const credentials = new CredentialsResponse();
        credentials.firebase = this.firebaseCredentials();
        return credentials;
    }

    private firebaseCredentials(): FirebaseCredentialsResponse {
        return {
            apiKey: process.env.FIREBASE_API_KEY || null,
            authDomain: process.env.FIREBASE_AUTH_DOMAIN || null,
            projectId: process.env.FIREBASE_PROJECT_ID || null,
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET || null,
            messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || null,
            appId: process.env.FIREBASE_APP_ID || null,
            measurementId: process.env.FIREBASE_MEASUREMENT_ID || null,
        };
    }
}
