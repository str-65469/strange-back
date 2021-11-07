import { Column, Entity, ManyToOne } from 'typeorm';
import { GeneralEntity } from '../entity_inheritance/general';
import User from './user.entity';

@Entity('matched_duos')
export class MatchedDuos extends GeneralEntity {
  @Column({ nullable: true })
  is_favorite?: boolean;

  @ManyToOne(() => User, (user) => user.matchedDuoUsers)
  user: User;

  @ManyToOne(() => User, (user) => user.matchedDuoMatchedUsers)
  matchedUser: User;
}
