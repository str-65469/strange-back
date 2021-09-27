import { DuoStatus } from './../../enum/duo_statuses.enum';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import User from './user.entity';

@Entity('duo_statuses')
export class UserDetails {
  @PrimaryGeneratedColumn() id: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user_id: User;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'desired_user_id' })
  desired_user_id: number;

  @Column({ type: 'enum', enum: DuoStatus }) status: DuoStatus;
  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' }) created_at: Date;
}
