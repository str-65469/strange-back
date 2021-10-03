import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { LolServer } from '../../enum/lol_server.enum';

interface RegisterCacheConstrParams {
  username: string;
  email: string;
  password: string;
  server: LolServer;
  summoner_name: string;

  secret_token?: string;
  expiry_date?: Date;
}

@Entity('user_register_cache')
export class UserRegisterCache extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column() username: string;
  @Column() email: string;
  @Column() password: string;
  @Column({ nullable: true, type: 'enum', enum: LolServer }) server?: LolServer;
  @Column({ nullable: true }) summoner_name?: string;

  // for timer
  @Column({ nullable: true }) secret_token?: string;
  @Column({ type: 'timestamptz', nullable: true }) expiry_date?: Date;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' }) created_at: Date;

  constructor(params?: RegisterCacheConstrParams) {
    super();
    if (params) {
      const { username, email, password, server, summoner_name } = params;

      this.username = username;
      this.email = email;
      this.password = password;
      this.server = server;
      this.summoner_name = summoner_name;

      if (params.secret_token) {
        this.secret_token = params.secret_token;
      }

      if (params.expiry_date) {
        this.expiry_date = params.expiry_date;
      }
    }
  }
}
