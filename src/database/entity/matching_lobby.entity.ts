import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { GeneralEntity } from '../entity_inheritance/general';
import User from './user.entity';

@Entity('matching_lobby')
export class MatchingLobby extends GeneralEntity {
  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  public user_id: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'liked_user_id' })
  public liked_user_id: number;
}
