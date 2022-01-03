import { Type } from 'class-transformer';
import { FirebaseCredentialsResponse } from './firebase_credentials.response';

/**
 * other will be added in future
 */
export class CredentialsResponse {
  @Type(() => FirebaseCredentialsResponse)
  firebase: FirebaseCredentialsResponse;
}
