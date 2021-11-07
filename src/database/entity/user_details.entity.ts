import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { GeneralEntity } from '../entity_inheritance/general';
import { LolLeague } from '../../app/enum/lol_league.enum';
import { LolChampions } from '../../app/enum/lol_champions.enum';
import { LolMainLane } from '../../app/enum/lol_main_lane.enum';
import { LolServer } from '../../app/enum/lol_server.enum';
import User from './user.entity';

@Entity()
export class UserDetails extends GeneralEntity {
  @Column({ nullable: true }) summoner_name?: string;
  @Column({ nullable: true }) discord_name?: string;
  @Column({ nullable: true }) level?: number;
  @Column({ nullable: true }) league_points?: number;
  @Column({ nullable: true }) league_number?: number;
  @Column({ nullable: true, type: 'float' }) win_rate?: number;
  @Column({ nullable: true, type: 'enum', enum: LolServer }) server?: LolServer;
  @Column({ nullable: true, type: 'enum', enum: LolMainLane }) main_lane?: LolMainLane;
  @Column({ nullable: true, type: 'enum', enum: LolLeague }) league?: LolLeague;
  @Column({ nullable: true, type: 'enum', enum: LolChampions, array: true })
  main_champions?: Array<LolChampions>;

  @Column({ nullable: true, type: 'timestamptz' })
  last_update_details?: Date;

  @OneToOne(() => User, (user) => user.details)
  @JoinColumn()
  user: User;
}
