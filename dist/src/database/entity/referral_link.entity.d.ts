import { GeneralEntity } from 'src/database/entity_inheritance/general';
export declare class ReferralLink extends GeneralEntity {
    name: string;
    urlLink: string;
    token: string;
    secret: string;
    enteredCount: number;
    registeredCount: number;
}
