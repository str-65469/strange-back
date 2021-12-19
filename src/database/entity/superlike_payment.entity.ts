import { Column, Entity, ManyToOne } from 'typeorm';
import { PaymentType } from 'src/app/common/enum/payment_type.enum';
import { GeneralEntity } from '../entity_inheritance/general';
import User from './user.entity';
import { SuperLikeServiceType } from 'src/app/common/enum/superlike_services';

@Entity('superlike_payment')
export class SuperLikePayment extends GeneralEntity {
  @Column({ type: 'float' }) amount: number;
  @Column({ type: 'enum', enum: SuperLikeServiceType }) like_service_type: SuperLikeServiceType;
  @Column({ type: 'enum', enum: PaymentType }) payment_type: PaymentType;

  @Column({ type: 'int', nullable: true }) userId: number;
  @ManyToOne(() => User, (user) => user.superLikePayments) user: User;
}
