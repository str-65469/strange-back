import { LolLeague } from 'src/enum/lol_league.enum';
import { Column, Entity } from 'typeorm';
import { LolServer } from '../../enum/lol_server.enum';
import { GeneralEntity } from '../entity_inheritance/general';

@Entity('user_register_cache')
export class UserRegisterCache extends GeneralEntity {
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
}
