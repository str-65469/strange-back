import { LolLeague } from 'src/enum/lol_league.enum';
import { Column, Entity } from 'typeorm';
import { LolServer } from '../../enum/lol_server.enum';
import { GeneralEntity } from '../entity_inheritance/general';

@Entity('user_register_cache')
export class UserRegisterCache extends GeneralEntity {
  @Column() username: string;
  @Column() email: string;
  @Column() password: string;
  @Column({ nullable: true }) level?: number;
  @Column({ nullable: true }) secret_token?: string;
  @Column({ nullable: true }) league_number?: number;
  @Column({ nullable: true }) league_points?: number;
  @Column({ nullable: true }) summoner_name?: string;
  @Column({ nullable: true, type: 'float8' }) win_rate?: number;
  @Column({ nullable: true, type: 'enum', enum: LolServer }) server?: LolServer;
  @Column({ nullable: true, type: 'enum', enum: LolLeague }) league?: LolLeague;
  @Column({ type: 'timestamptz', nullable: true }) expiry_date?: Date;
}
