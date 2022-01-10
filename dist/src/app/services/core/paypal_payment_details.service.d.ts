import { Repository } from 'typeorm';
import { PaypalPaymentDetails } from 'src/database/entity/paypal_payment_details.entity';
export declare class PaypalPaymentDetailsService {
    private readonly paypalPaymentDetailsRepo;
    constructor(paypalPaymentDetailsRepo: Repository<PaypalPaymentDetails>);
    save(userId: number, captureId: string, paymentJson: string): Promise<PaypalPaymentDetails>;
}
