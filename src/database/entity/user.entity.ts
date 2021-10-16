import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import UserDetails from './user_details.entity';
import { Exclude } from 'class-transformer';

@Entity('users')
export default class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public username: string;

  @Column()
  public email: string;

  @Exclude({ toPlainOnly: true })
  @Column()
  public password: string;

  @Exclude({ toPlainOnly: true })
  @Column()
  public socket_id: string;

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: true })
  public secret?: string;

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: true })
  public ip?: string;

  @Column({ nullable: true })
  public img_path?: string;

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: true })
  public is_online?: boolean;

  @Exclude({ toPlainOnly: true })
  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  public created_at: Date;

  @Exclude({ toPlainOnly: true })
  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  public updated_at: Date;

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
  }
}
