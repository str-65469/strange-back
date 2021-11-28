import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { GeneralEntity } from '../entity_inheritance/general';
import User from './user.entity';

@Entity('user_belongings')
export default class UserBelongings extends GeneralEntity {
  @Column({ nullable: true })
  super_like?: number;

  @OneToOne(() => User, (user) => user.belongings)
  @JoinColumn()
  user: User;
}
