import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import User from './user.entity';

@Entity('matching_spams')
export class MatchingSpams {
  @PrimaryGeneratedColumn() id: number;
  @Column({ type: 'int', array: true }) accept_list: Array<number>;
  @Column({ type: 'int', array: true }) decline_list: Array<number>;
  @Column({ type: 'int', array: true }) remove_list: Array<number>;
  //   @Column('int', { array: true }) remove_list: Array<number>;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user_id: User;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' }) created_at: Date;
}
