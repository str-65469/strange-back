import { Column, Entity, ManyToOne } from 'typeorm';
import { GeneralEntity } from '../entity_inheritance/general';
import User from './user.entity';

@Entity('matched_duos_notifications')
export class MatchedDuosNotifications extends GeneralEntity {
  @Column({ default: false, type: 'boolean' })
  is_seen: boolean;

  @Column({ default: false, type: 'boolean' })
  is_hidden_seen: boolean;

  @Column({ type: 'int', nullable: true })
  userId: number;

  @ManyToOne(() => User, (user) => user.notificationUsers)
  user: User;

  @ManyToOne(() => User, (user) => user.notificationMatchedUsers)
  matchedUser: User;
}
