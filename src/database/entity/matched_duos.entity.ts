import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { GeneralEntity } from '../entity_inheritance/general';
import User from './user.entity';

@Entity('matched_duos')
export class MatchedDuos extends GeneralEntity {
  @Column({ nullable: true })
  is_favorite?: boolean;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user_id: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'matched_user_id' })
  matched_user_id: number;
}
