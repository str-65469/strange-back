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

@Entity('matching_spams')
export class MatchingSpams {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    nullable: false,
    type: 'int',
    array: true,
  })
  public accept_list: Array<number>;

  @Column({
    nullable: false,
    type: 'int',
    array: true,
  })
  public decline_list: Array<number>;

  @Column({
    nullable: false,
    type: 'int',
    array: true,
  })
  public remove_list: Array<number>;

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
