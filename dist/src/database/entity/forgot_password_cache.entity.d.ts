import { GeneralEntity } from '../entity_inheritance/general';
export declare class ForgotPasswordCache extends GeneralEntity {
    user_id: number;
    email: string;
    summoner_name?: string;
    uuid: string;
    secret_token?: string;
    secret?: string;
}
