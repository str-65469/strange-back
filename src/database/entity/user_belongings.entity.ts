import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import User from './user.entity';

@Entity('user_belongings')
export default class UserBelongings {
  @PrimaryGeneratedColumn() id: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user_id: User;

  @Column({ nullable: true }) super_like?: number;
  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' }) created_at: Date;
}
