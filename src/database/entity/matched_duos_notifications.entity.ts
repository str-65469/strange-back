import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { GeneralEntity } from '../entity_inheritance/general';
import User from './user.entity';

@Entity('matched_duos_notifications')
export class MatchedDuosNotifications extends GeneralEntity {
  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  @Column()
  user_id: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'matched_user_id' })
  @Column()
  matched_user_id: number;

  @Column({ default: false, type: 'boolean' })
  is_seen: boolean;
}
