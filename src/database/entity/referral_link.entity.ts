import { GeneralEntity } from 'src/database/entity_inheritance/general';
import { Column, Entity } from 'typeorm';

@Entity('referral_links')
export class ReferralLink extends GeneralEntity {
  @Column({ name: 'name', nullable: false }) name: string;
  @Column({ name: 'url_link', nullable: false }) urlLink: string;
  @Column({ name: 'token', nullable: false }) token: string;
  @Column({ name: 'secret', nullable: false }) secret: string;
  @Column({ name: 'entered_count', nullable: false }) enteredCount: number;
  @Column({ name: 'registered_count', nullable: false }) registeredCount: number;
}
