import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { GeneralEntity } from '../entity_inheritance/general';
import User from './user.entity';

@Entity('matched_duos_notifications')
export class MatchedDuosNotifications extends GeneralEntity {
  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  @Column()
  public user_id: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'matched_user_id' })
  @Column()
  public matched_user_id: number;

  @Column({ default: false, type: 'boolean' })
  public is_seen: boolean;
}
