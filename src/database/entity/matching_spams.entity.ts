import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { GeneralEntity } from '../entity_inheritance/general';
import User from './user.entity';

@Entity('matching_spams')
export class MatchingSpams extends GeneralEntity {
  @Column({ nullable: false, type: 'int', default: [], array: true }) public accept_list: Array<number>;
  @Column({ nullable: false, type: 'int', default: [], array: true }) public decline_list: Array<number>;
  @Column({ nullable: false, type: 'int', default: [], array: true }) public remove_list: Array<number>;
  @Column({ nullable: false, type: 'int', default: [], array: true }) public matched_list: Array<number>;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  public user_id: number;
}
