import { ContactUseMessageTypes } from './../../enum/contact_us_message_type.enum';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import User from './user.entity';

@Entity('contact_us')
export class ContactUs {
  @PrimaryGeneratedColumn() id: number;
  @Column() name: string;
  @Column() email: string;
  @Column({ type: 'text', nullable: true }) message?: string;
  @Column({ type: 'enum', enum: ContactUseMessageTypes }) message_type: ContactUseMessageTypes;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user_id: User;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' }) created_at: Date;
}
