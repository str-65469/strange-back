import { LolLeague } from 'src/app/common/enum/lol_league.enum';
import { Column, Entity } from 'typeorm';
import { LolServer } from '../../app/common/enum/lol_server.enum';
import { GeneralEntity } from '../entity_inheritance/general';

@Entity('user_register_cache')
export class UserRegisterCache extends GeneralEntity {
  @Column({ unique: true }) username: string;
  @Column({ unique: true }) email: string;

  @Column() password: string;
  @Column({ type: 'enum', enum: LolServer }) server?: LolServer;
  @Column() secret_token?: string;
  @Column({ type: 'timestamptz' }) expiry_date?: Date;

  @Column({ nullable: true }) level?: number;
  @Column({ nullable: true }) league_number?: number;
  @Column({ nullable: true }) league_points?: number;
  @Column({ nullable: true }) summoner_name?: string;
  @Column({ nullable: true, type: 'float8' }) win_rate?: number;
  @Column({ nullable: true, type: 'enum', enum: LolLeague }) league?: LolLeague;
}
