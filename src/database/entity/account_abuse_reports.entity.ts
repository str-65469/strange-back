import { LolServer } from 'src/enum/lol_server.enum';
import { Column, Entity } from 'typeorm';
import { GeneralEntity } from '../entity_inheritance/general';

@Entity('report_account_abuse')
export class AccountAbuseReport extends GeneralEntity {
  @Column()
  public summoner_name: string;

  @Column({ type: 'enum', enum: LolServer })
  public server: LolServer;

  @Column({ nullable: true })
  public image: string;
}
