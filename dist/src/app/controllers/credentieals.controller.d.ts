import { CredentialsResponse } from '../common/response/credentials/credentials.response';
import { CredentialsService } from '../services/core/credentials.service';
export declare class CredentialsController {
    private readonly credentialsService;
    constructor(credentialsService: CredentialsService);
    credentials(): CredentialsResponse;
}
