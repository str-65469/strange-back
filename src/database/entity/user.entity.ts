import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export default class User {
  @PrimaryGeneratedColumn() id: number;
  @Column() username: string;
  @Column() email: string;
  @Column() password: string;
  @Column() refresh_token: string;
  @Column() secret: string;
  @Column() is_online: boolean;
  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' }) created_at: Date;
}
