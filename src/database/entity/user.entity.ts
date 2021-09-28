import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export default class User {
  @PrimaryGeneratedColumn() id: number;
  @Column() username: string;
  @Column() email: string;
  @Column() password: string;
  @Column({ nullable: true }) refresh_token?: string;
  @Column({ nullable: true }) secret?: string;
  @Column({ nullable: true }) is_online?: boolean;
  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' }) created_at: Date;

  constructor(
    username: string,
    email: string,
    password: string,
    refresh_token?: string,
    secret?: string,
    is_online?: boolean,
  ) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.refresh_token = refresh_token;
    this.secret = secret;
    this.is_online = is_online;
  }
}
