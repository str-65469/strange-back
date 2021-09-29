import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_register_cache')
export class UserRegisterCache {
  @PrimaryGeneratedColumn() id: number;
  @Column() username: string;
  @Column() email: string;
  @Column() password: string;
  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' }) created_at: Date;
}
