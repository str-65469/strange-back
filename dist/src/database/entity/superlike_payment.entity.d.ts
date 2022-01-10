import { PaymentType } from 'src/app/common/enum/payment_type.enum';
import { GeneralEntity } from '../entity_inheritance/general';
import User from './user.entity';
import { SuperLikeServiceType } from 'src/app/common/enum/superlike_services';
export declare class SuperLikePayment extends GeneralEntity {
    amount: number;
    like_service_type: SuperLikeServiceType;
    payment_type: PaymentType;
    userId: number;
    user: User;
}
