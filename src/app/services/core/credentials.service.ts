import { Injectable } from '@nestjs/common';
import { CredentialsResponse } from 'src/app/common/response/credentials/credentials.response';
import { FirebaseCredentialsResponse } from 'src/app/common/response/credentials/firebase_credentials.response';

@Injectable()
export class CredentialsService {
  credentials() {
    const credentials = new CredentialsResponse();
    credentials.firebase = this.firebaseCredentials();
    return credentials;
  }

  private firebaseCredentials(): FirebaseCredentialsResponse {
    return {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
      measurementId: process.env.FIREBASE_MEASUREMENT_ID,
    };
  }
}
