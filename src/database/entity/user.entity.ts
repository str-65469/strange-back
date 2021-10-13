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

@Entity('users')
export default class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public username: string;

  @Column()
  public email: string;

  @Column()
  public password: string;

  @Column({ nullable: true })
  public secret?: string;

  @Column({ nullable: true })
  public ip?: string;

  @Column({ nullable: true })
  public socket_id?: string;

  @Column({ nullable: true })
  public img_path?: string;

  @Column({ nullable: true })
  public is_online?: boolean;

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

  //! relations

  @OneToOne(() => UserDetails, (userDetails) => userDetails.user)
  @JoinColumn()
  public userDetails: UserDetails;

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
  }
}
