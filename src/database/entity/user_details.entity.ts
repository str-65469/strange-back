import { LolLeague } from '../../enum/lol_league.enum';
import { LolChampions } from '../../enum/lol_champions.enum';
import { LolMainLane } from '../../enum/lol_main_lane.enum';
import { LolServer } from '../../enum/lol_server.enum';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import User from './user.entity';

@Entity('user_details')
export class UserDetails {
  @PrimaryGeneratedColumn() id: number;
  @Column({ nullable: true }) summoner_name?: string;
  @Column({ nullable: true }) discord_name?: string;
  @Column({ nullable: true, type: 'enum', enum: LolServer }) server?: LolServer;
  @Column({ nullable: true, type: 'enum', enum: LolMainLane }) main_lane?: LolMainLane;
  @Column({ nullable: true, type: 'enum', enum: LolLeague }) league?: LolLeague;
  @Column({
    nullable: true,
    type: 'enum',
    enum: LolChampions,
    array: true,
  })
  main_champions?: Array<LolChampions>;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user_id: User;

  @Column({ nullable: true, type: 'timestamptz' }) last_update_details?: Date;
  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' }) created_at: Date;
}
