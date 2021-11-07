import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { GeneralEntity } from '../entity_inheritance/general';
import User from './user.entity';

@Entity('user_belongings')
export default class UserBelongings extends GeneralEntity {
  @Column({ nullable: true })
  super_like?: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user_id: User;
}
