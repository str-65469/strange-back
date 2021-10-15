import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import User from './user.entity';

@Entity('matching_lobby')
export class MatchingLobby {
  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  public user_id: User;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'matched_user_id' })
  public liked_user_id: number;

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
