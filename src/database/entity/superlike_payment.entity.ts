import { SuperLikeServiceType } from './../../enum/superlike_servie_type.enum';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import User from './user.entity';
import { PaymentType } from 'src/enum/payment_type.enum';
import { GeneralEntity } from '../entity_inheritance/general';

@Entity('superlike_payment')
export class SuperLikePayment extends GeneralEntity {
  @Column({ type: 'float' }) public amount: number;
  @Column({ type: 'enum', enum: SuperLikeServiceType }) public like_service_type: SuperLikeServiceType;
  @Column({ type: 'enum', enum: PaymentType }) public payment_type: PaymentType;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  public user_id: User;
}
