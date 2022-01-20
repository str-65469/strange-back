import { Column, Entity, ManyToOne } from 'typeorm';
import { GeneralEntity } from '../entity_inheritance/general';
import { User } from './user.entity';

@Entity('paypal_payment_details')
export class PaypalPaymentDetails extends GeneralEntity {
    @Column() captureId: string;
    @Column({ type: 'json' }) paymentJson: string;
    @Column({ type: 'int', nullable: true }) userId: number;
    @ManyToOne(() => User, (user) => user.superLikePayments) user: User;
}
