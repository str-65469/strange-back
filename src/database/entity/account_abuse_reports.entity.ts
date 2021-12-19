import { LolServer } from 'src/app/common/enum/lol_server.enum';
import { Column, Entity } from 'typeorm';
import { GeneralEntity } from '../entity_inheritance/general';

@Entity('report_account_abuse')
export class AccountAbuseReport extends GeneralEntity {
  @Column() summoner_name: string;
  @Column({ type: 'enum', enum: LolServer }) server: LolServer;

  //   @Column({ nullable: true }) imageId: number;

  @Column({ nullable: false }) email: string;
  @Column({ nullable: false }) imagePath: string;
}
