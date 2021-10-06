import { SuperLikeServiceType } from './../../enum/superlike_servie_type.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import User from './user.entity';
import { PaymentType } from 'src/enum/payment_type.enum';

@Entity('superlike_payment')
export class SuperLikePayment {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'float' })
  public amount: number;

  @Column({
    type: 'enum',
    enum: SuperLikeServiceType,
  })
  public like_service_type: SuperLikeServiceType;

  @Column({
    type: 'enum',
    enum: PaymentType,
  })
  public payment_type: PaymentType;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  public user_id: User;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  public created_at: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  public updated_at: Date;
}
