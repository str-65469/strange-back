import { Column, Entity } from 'typeorm';
import { GeneralEntity } from '../entity_inheritance/general';

@Entity('forgot_password_cache')
export class ForgotPasswordCache extends GeneralEntity {
  @Column() user_id: number;
  @Column({ unique: true }) email: string;
  @Column() summoner_name?: string;
  @Column() uuid: string;

  @Column({ nullable: true }) secret_token?: string;
  @Column({ nullable: true }) secret?: string;
}
