import { GeneralEntity } from '../entity_inheritance/general';
import User from './user.entity';
export declare class PaypalPaymentDetails extends GeneralEntity {
    captureId: string;
    paymentJson: string;
    userId: number;
    user: User;
}
