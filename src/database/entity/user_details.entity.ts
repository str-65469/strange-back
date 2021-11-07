import { LolLeague } from '../../enum/lol_league.enum';
import { LolChampions } from '../../enum/lol_champions.enum';
import { LolMainLane } from '../../enum/lol_main_lane.enum';
import { LolServer } from '../../enum/lol_server.enum';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Exclude } from 'class-transformer';
import { GeneralEntity } from '../entity_inheritance/general';
import User from './user.entity';

@Entity()
export default class UserDetails extends GeneralEntity {
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

  @Exclude({ toPlainOnly: true })
  @OneToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user_id: User;

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: true, type: 'timestamptz' })
  last_update_details?: Date;
}
