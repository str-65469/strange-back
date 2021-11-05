import { LolLeague } from 'src/enum/lol_league.enum';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { LolServer } from '../../enum/lol_server.enum';

interface RegisterCacheConstrParams {
  username: string;
  email: string;
  password: string;
  server: LolServer;
  summoner_name: string;

  secret_token?: string;
  expiry_date?: Date;

  level?: number;
  league?: LolLeague;
  league_number?: number;
  league_points?: number;
  win_rate?: number;
}

@Entity('user_register_cache')
export class UserRegisterCache extends BaseEntity {
  @PrimaryGeneratedColumn() public id: number;
  @Column() public username: string;
  @Column() public email: string;
  @Column() public password: string;
  @Column({ nullable: true }) public level?: number;
  @Column({ nullable: true }) public secret_token?: string;
  @Column({ nullable: true }) public league_number?: number;
  @Column({ nullable: true }) public league_points?: number;
  @Column({ nullable: true }) public summoner_name?: string;
  @Column({ nullable: true, type: 'float8' }) public win_rate?: number;
  @Column({ nullable: true, type: 'enum', enum: LolServer }) public server?: LolServer;
  @Column({ nullable: true, type: 'enum', enum: LolLeague }) public league?: LolLeague;
  @Column({ type: 'timestamptz', nullable: true }) public expiry_date?: Date;

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

      if (params.level) {
        this.level = params.level;
      }
      if (params.league) {
        this.league = params.league;
      }
      if (params.league_number) {
        this.league_number = params.league_number;
      }
      if (params.league_points) {
        this.league_points = params.league_points;
      }
      if (params.win_rate) {
        this.win_rate = params.win_rate;
      }
    }
  }
}
