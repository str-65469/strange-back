import { DuoStatus } from './../../enum/duo_statuses.enum';
import User from './user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('duo_statuses')
export class UserDetails {
  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  public user_id: User;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'desired_user_id' })
  public desired_user_id: number;

  @Column({
    type: 'enum',
    enum: DuoStatus,
  })
  public status: DuoStatus;

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
