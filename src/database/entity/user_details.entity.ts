import { LolLeague } from '../../enum/lol_league.enum';
import { LolChampions } from '../../enum/lol_champions.enum';
import { LolMainLane } from '../../enum/lol_main_lane.enum';
import { LolServer } from '../../enum/lol_server.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import User from './user.entity';

@Entity()
export default class UserDetails {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ nullable: true })
  public summoner_name?: string;

  @Column({ nullable: true })
  public discord_name?: string;

  @Column({
    nullable: true,
    type: 'enum',
    enum: LolServer,
  })
  public server?: LolServer;

  @Column({
    nullable: true,
    type: 'enum',
    enum: LolMainLane,
  })
  public main_lane?: LolMainLane;

  @Column({
    nullable: true,
    type: 'enum',
    enum: LolLeague,
  })
  public league?: LolLeague;

  @Column({
    nullable: true,
    type: 'enum',
    enum: LolChampions,
    array: true,
  })
  public main_champions?: Array<LolChampions>;

  @Column({
    nullable: true,
    type: 'timestamptz',
  })
  public last_update_details?: Date;

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

  //! relations

  @OneToOne(() => User, (user) => user.userDetails)
  public user: User;
}
