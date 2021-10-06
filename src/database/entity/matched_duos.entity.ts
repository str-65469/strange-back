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

@Entity('matched_duos')
export class MatchedDuos {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ nullable: false })
  public is_favorite: boolean;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  public user_id: User;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'matched_user_id' })
  public matched_user_id: number;

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
