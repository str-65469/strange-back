import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity('users')
export default class User {
  @PrimaryGeneratedColumn() id: number;
  @Column() username: string;
  @Column() email: string;
  @Column() password: string;
  @Column({ nullable: true }) refresh_token?: string;
  @Column({ nullable: true }) secret?: string;
  @Column({ nullable: true }) is_online?: boolean;
  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' }) created_at: Date;

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    const salt = await bcrypt.genSalt(16);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
  }
}
