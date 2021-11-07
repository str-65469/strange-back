import { Entity, ManyToOne } from 'typeorm';
import { GeneralEntity } from '../entity_inheritance/general';
import User from './user.entity';

@Entity('matching_lobby')
export class MatchingLobby extends GeneralEntity {
  @ManyToOne(() => User, (user) => user.lobbyUsers)
  user: User;

  @ManyToOne(() => User, (user) => user.lobbyLikedUsers)
  likedUser: User;
}
