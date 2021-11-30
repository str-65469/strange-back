import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { GeneralEntity } from '../entity_inheritance/general';
import User from './user.entity';

@Entity('user_belongings')
export class UserBelongings extends GeneralEntity {
  @Column({ nullable: true, default: 0 })
  super_like?: number;

  @Column({ type: 'int', nullable: true })
  userId: number;

  @OneToOne(() => User, (user) => user.belongings)
  @JoinColumn()
  user: User;
}
