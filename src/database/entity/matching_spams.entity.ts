import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { GeneralEntity } from '../entity_inheritance/general';
import User from './user.entity';

@Entity('matching_spams')
export class MatchingSpams extends GeneralEntity {
  @Column({ nullable: false, type: 'int', default: [], array: true }) accept_list: Array<number>;
  @Column({ nullable: false, type: 'int', default: [], array: true }) decline_list: Array<number>;
  @Column({ nullable: false, type: 'int', default: [], array: true }) remove_list: Array<number>;
  @Column({ nullable: false, type: 'int', default: [], array: true }) matched_list: Array<number>;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user_id: number;
}
