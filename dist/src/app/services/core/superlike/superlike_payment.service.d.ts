import { Repository } from 'typeorm';
import { SuperLikePayment } from 'src/database/entity/superlike_payment.entity';
import { PaymentType } from 'src/app/common/enum/payment_type.enum';
import { SuperLikeServiceType } from 'src/app/common/enum/superlike_services';
export declare class SuperlikePaymentService {
    private readonly superlikePaymentRepo;
    constructor(superlikePaymentRepo: Repository<SuperLikePayment>);
    create(amount: number, like_service_type: SuperLikeServiceType, payment_type: PaymentType, userId: number): Promise<SuperLikePayment>;
}
