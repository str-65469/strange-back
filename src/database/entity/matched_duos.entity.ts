import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import User from './user.entity';

@Entity('matched_duos')
export class MatchedDuos {
  @PrimaryGeneratedColumn() id: number;
  @Column({ nullable: false }) is_favorite: boolean;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user_id: User;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'matched_user_id' })
  matched_user_id: number;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', nullable: false }) updated_at: Date;
  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' }) created_at: Date;
}
