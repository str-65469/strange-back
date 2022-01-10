import { SuperLikeServiceType } from 'src/app/common/enum/superlike_services';
import { GeneralEntity } from '../entity_inheritance/general';
export declare class SuperLikeServices extends GeneralEntity {
    type: SuperLikeServiceType;
    full_price: number;
    price: number;
    percent: number | null;
    amount: number;
}
